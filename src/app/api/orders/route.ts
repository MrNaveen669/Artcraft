import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();
    
    const orders = await Order.find({ userId: user.userId })
      .sort({ orderDate: -1 })
      .populate('items.productId');

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Get orders error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();
    
    const { items, shippingAddress, paymentMethod, paymentInfo, totalAmount } = await request.json();

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create({
      userId: user.userId,
      items,
      shippingAddress,
      paymentMethod,
      paymentInfo,
      totalAmount,
      status: 'pending',
    });

    // Clear cart after order
    await Cart.findOneAndUpdate(
      { userId: user.userId },
      { items: [], updatedAt: new Date() }
    );

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error('Create order error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
