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
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { wishlist: data } = await api.getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setProcessing(productId);
    try {
      const { wishlist: updatedWishlist } = await api.removeFromWishlist(productId);
      setWishlist(updatedWishlist);
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    } finally {
      setProcessing(null);
    }
  };

  const moveToCart = async (productId: string) => {
    setProcessing(productId);
    try {
      await api.addToCart(productId, 1);
      await api.removeFromWishlist(productId);
      const { wishlist: updatedWishlist } = await api.getWishlist();
      setWishlist(updatedWishlist);
      toast.success('Moved to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to move to cart');
    } finally {
      setProcessing(null);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-48 rounded mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-96 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const itemCount = wishlist?.products?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600 mb-8">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>

        {itemCount === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save your favorite items here!</p>
            <Link href="/products">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Browse Products
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.products.map((product: any) => (
              <Card key={product._id} className="group overflow-hidden">
                <Link href={`/products/${product._id}`}>
                  <div className="relative h-64">
                    <Image
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-amber-600 transition">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">• {product.category}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-amber-600">₹{product.price}</p>
                    {product.stock === 0 && (
                      <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => moveToCart(product._id)}
                      disabled={product.stock === 0 || processing === product._id}
                      className="flex-1 bg-amber-600 hover:bg-amber-700"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => removeFromWishlist(product._id)}
                      disabled={processing === product._id}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
