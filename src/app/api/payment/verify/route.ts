import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    requireAuth(request);
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'test_secret';
    
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({ 
        success: true,
        message: 'Payment verified successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Verify payment error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
