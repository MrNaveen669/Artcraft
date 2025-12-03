'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const { cart: data } = await api.getCart();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    setUpdating(productId);
    try {
      const { cart: updatedCart } = await api.updateCartItem(productId, newQuantity);
      setCart(updatedCart);
      toast.success('Cart updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cart');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId: string) => {
    setUpdating(productId);
    try {
      const { cart: updatedCart } = await api.removeFromCart(productId);
      setCart(updatedCart);
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total: number, item: any) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 w-48 rounded"></div>
            <div className="bg-gray-200 h-32 rounded"></div>
            <div className="bg-gray-200 h-32 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const total = calculateTotal();
  const itemCount = cart?.items?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {itemCount === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some items to get started!</p>
            <Link href="/products">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item: any) => (
                <Card key={item.productId?._id} className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link href={`/products/${item.productId?._id}`} className="flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                        <Image
                          src={item.productId?.images?.[0] || '/placeholder.jpg'}
                          alt={item.productId?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1">
                      <Link href={`/products/${item.productId?._id}`}>
                        <h3 className="font-semibold text-lg hover:text-amber-600 transition">
                          {item.productId?.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-2">{item.productId?.category}</p>
                      <p className="text-2xl font-bold text-amber-600">₹{item.productId?.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        onClick={() => removeItem(item.productId?._id)}
                        disabled={updating === item.productId?._id}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)}
                          disabled={updating === item.productId?._id || item.quantity <= 1}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          readOnly
                          className="w-16 h-8 text-center"
                        />
                        <Button
                          onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)}
                          disabled={updating === item.productId?._id || item.quantity >= (item.productId?.stock || 0)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-amber-600">₹{total}</span>
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-lg"
                >
                  Proceed to Checkout
                </Button>

                <Link href="/products">
                  <Button variant="ghost" className="w-full mt-4">
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
