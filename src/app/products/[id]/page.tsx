'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, Package, Ruler, Weight, User } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const { product: data } = await api.getProduct(params.id as string);
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await api.addToCart(product._id, 1);
      toast.success('Added to cart successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      router.push('/login');
      return;
    }

    setAddingToWishlist(true);
    try {
      await api.addToWishlist(product._id);
      toast.success('Added to wishlist successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to wishlist');
    } finally {
      setAddingToWishlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
              <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
              <div className="bg-gray-200 h-32 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Button onClick={() => router.push('/products')}>Browse Products</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative h-96 lg:h-[600px]">
                <Image
                  src={product.images[0] || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-amber-100 text-amber-800 hover:bg-amber-200">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="ml-1 font-semibold">{product.rating}</span>
                  <span className="ml-1 text-gray-500">({product.reviews?.length || 0} reviews)</span>
                </div>
                {product.stock > 0 ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-amber-600">₹{product.price}</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            </div>

            {/* Specifications */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="space-y-3">
                {product.material && (
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Material: </span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Dimensions: </span>
                      <span className="font-medium">{product.dimensions}</span>
                    </div>
                  </div>
                )}
                {product.weight && (
                  <div className="flex items-center gap-3">
                    <Weight className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Weight: </span>
                      <span className="font-medium">{product.weight}</span>
                    </div>
                  </div>
                )}
                {product.artisan && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Artisan: </span>
                      <span className="font-medium">{product.artisan}</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="flex-1 bg-amber-600 hover:bg-amber-700 h-12 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
                variant="outline"
                className="h-12 px-6"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {product.stock > 0 && product.stock < 10 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800 font-medium">
                  Only {product.stock} items left in stock!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
