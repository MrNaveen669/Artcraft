import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();
    
    let wishlist = await Wishlist.findOne({ userId: user.userId }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: user.userId, products: [] });
    }

    return NextResponse.json({ wishlist });
  } catch (error: any) {
    console.error('Get wishlist error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();
    
    const { productId } = await request.json();

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    let wishlist = await Wishlist.findOne({ userId: user.userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: user.userId,
        products: [productId],
      });
    } else {
      const exists = wishlist.products.some(
        (id: any) => id.toString() === productId
      );

      if (!exists) {
        wishlist.products.push(productId);
        wishlist.updatedAt = new Date();
        await wishlist.save();
      }
    }

    wishlist = await Wishlist.findOne({ userId: user.userId }).populate('products');

    return NextResponse.json({ wishlist });
  } catch (error: any) {
    console.error('Add to wishlist error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const wishlist = await Wishlist.findOne({ userId: user.userId });

    if (!wishlist) {
      return NextResponse.json(
        { error: 'Wishlist not found' },
        { status: 404 }
      );
    }

    wishlist.products = wishlist.products.filter(
      (id: any) => id.toString() !== productId
    );

    wishlist.updatedAt = new Date();
    await wishlist.save();

    const updatedWishlist = await Wishlist.findOne({ userId: user.userId }).populate('products');

    return NextResponse.json({ wishlist: updatedWishlist });
  } catch (error: any) {
    console.error('Delete wishlist item error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to delete wishlist item' },
      { status: 500 }
    );
  }
}
