import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    await connectDB();
    
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.find()
        .sort({ orderDate: -1 })
        .limit(5)
        .populate('userId', 'name email')
        .populate('items.productId'),
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
        },
      },
      recentOrders,
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
