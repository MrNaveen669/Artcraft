import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .populate('userId', 'name email')
      .populate('items.productId');

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Get orders error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
