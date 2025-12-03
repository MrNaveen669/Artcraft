'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles, Shield, Truck, Star } from 'lucide-react';

const categories = [
  { name: 'Pottery', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=80', color: 'from-amber-500 to-orange-500' },
  { name: 'Textiles', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&q=80', color: 'from-rose-500 to-pink-500' },
  { name: 'Metalwork', image: 'https://images.unsplash.com/photo-1605900576497-8da77c84ebfb?w=400&q=80', color: 'from-yellow-500 to-amber-500' },
  { name: 'Woodwork', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&q=80', color: 'from-emerald-500 to-teal-500' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { products } = await api.getProducts({ featured: true });
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 opacity-70"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Handcrafted with
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent"> Love</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover unique, authentic handicrafts made by talented artisans from across India
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-6">
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/products?featured=true">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-amber-600 text-amber-600 hover:bg-amber-50">
                  Featured Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Handicrafts</h3>
              <p className="text-gray-600">100% handmade by skilled artisans</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Each piece is carefully inspected</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Delivered safely to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/products?category=${category.name}`}>
                <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-50 transition-opacity`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-3xl font-bold text-white">{category.name}</h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Featured Products</h2>
            <Link href="/products?featured=true">
              <Button variant="ghost" className="text-amber-600 hover:text-amber-700">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-64"></div>
                    <div className="p-4 space-y-3">
                      <div className="bg-gray-200 h-4 rounded"></div>
                      <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product._id} href={`/products/${product._id}`}>
                  <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
                    <div className="relative h-64">
                      <Image
                        src={product.images[0] || '/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">• {product.category}</span>
                      </div>
                      <p className="text-2xl font-bold text-amber-600">₹{product.price}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}