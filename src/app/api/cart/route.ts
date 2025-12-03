import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();
    
    let cart = await Cart.findOne({ userId: user.userId }).populate('items.productId');

    if (!cart) {
      cart = await Cart.create({ userId: user.userId, items: [] });
    }

    return NextResponse.json({ cart });
  } catch (error: any) {
    console.error('Get cart error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();
    
    const { productId, quantity = 1 } = await request.json();

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    let cart = await Cart.findOne({ userId: user.userId });

    if (!cart) {
      cart = await Cart.create({
        userId: user.userId,
        items: [{ productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item: any) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      cart.updatedAt = new Date();
      await cart.save();
    }

    cart = await Cart.findOne({ userId: user.userId }).populate('items.productId');

    return NextResponse.json({ cart });
  } catch (error: any) {
    console.error('Add to cart error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();
    
    const { productId, quantity } = await request.json();

    const cart = await Cart.findOne({ userId: user.userId });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const item = cart.items.find(
      (item: any) => item.productId.toString() === productId
    );

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item: any) => item.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    cart.updatedAt = new Date();
    await cart.save();

    const updatedCart = await Cart.findOne({ userId: user.userId }).populate('items.productId');

    return NextResponse.json({ cart: updatedCart });
  } catch (error: any) {
    console.error('Update cart error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update cart' },
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

    const cart = await Cart.findOne({ userId: user.userId });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    if (productId) {
      cart.items = cart.items.filter(
        (item: any) => item.productId.toString() !== productId
      );
    } else {
      cart.items = [];
    }

    cart.updatedAt = new Date();
    await cart.save();

    const updatedCart = await Cart.findOne({ userId: user.userId }).populate('items.productId');

    return NextResponse.json({ cart: updatedCart });
  } catch (error: any) {
    console.error('Delete cart item error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to delete cart item' },
      { status: 500 }
    );
  }
}
