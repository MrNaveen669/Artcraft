import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { requireAuth } from '@/lib/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret',
});

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const { amount, currency = 'INR' } = await request.json();

    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Create Razorpay order error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
