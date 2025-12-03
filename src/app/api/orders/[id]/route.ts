import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAuth, requireAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request);
    await connectDB();
    
    const order = await Order.findById(params.id).populate('items.productId');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user owns the order or is admin
    if (order.userId.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Get order error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);
    await connectDB();
    
    const { status, deliveryDate } = await request.json();

    const order = await Order.findByIdAndUpdate(
      params.id,
      { status, ...(deliveryDate && { deliveryDate }) },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Update order error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
