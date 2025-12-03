'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const orderId = searchParams.get('orderId');
    if (!orderId) {
      router.push('/');
      return;
    }

    fetchOrder(orderId);
  }, [user, searchParams]);

  const fetchOrder = async (orderId: string) => {
    try {
      const { order: data } = await api.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 w-64 rounded mx-auto"></div>
            <div className="bg-gray-200 h-64 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <Card className="p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono font-semibold">{order._id}</p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              {order.status}
            </Badge>
          </div>

          <div className="space-y-6">
            {/* Order Items */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold">Order Items</h3>
              </div>
              <div className="space-y-3">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold">Shipping Address</h3>
              </div>
              <div className="text-gray-600">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold">Payment Information</h3>
              </div>
              <div className="text-gray-600">
                <p>Payment Method: {order.paymentMethod}</p>
                <p className="text-sm font-mono">Payment ID: {order.paymentInfo.razorpayPaymentId}</p>
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-2xl font-bold">
                <span>Total Paid</span>
                <span className="text-amber-600">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto">
              View My Orders
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
