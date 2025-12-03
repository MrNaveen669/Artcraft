'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, CreditCard, Calendar, Truck, CheckCircle } from 'lucide-react';

const statusColors: any = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const orderSteps = [
  { status: 'pending', label: 'Order Placed', icon: Package },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [user, params.id]);

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 w-48 rounded"></div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStepIndex = orderSteps.findIndex(step => step.status === order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost">← Back to Orders</Button>
          </Link>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
            <p className="text-gray-600 font-mono">Order #{order._id}</p>
          </div>
          <Badge className={statusColors[order.status]}>
            {order.status}
          </Badge>
        </div>

        {/* Order Tracking */}
        {order.status !== 'cancelled' && (
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">Order Tracking</h2>
            <div className="flex justify-between items-center">
              {orderSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.status} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <StepIcon className="w-6 h-6" />
                      </div>
                      <p
                        className={`text-xs text-center ${
                          isCurrent ? 'font-semibold' : ''
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                    {index < orderSteps.length - 1 && (
                      <div
                        className={`h-1 flex-1 ${
                          isCompleted ? 'bg-amber-600' : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Items */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold">Order Items</h3>
            </div>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-start py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
              <div className="pt-3 border-t flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-amber-600">₹{order.totalAmount}</span>
              </div>
            </div>
          </Card>

          {/* Shipping & Payment Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold">Shipping Address</h3>
              </div>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold">Payment Info</h3>
              </div>
              <div className="text-gray-600 space-y-1">
                <p>Method: {order.paymentMethod}</p>
                <p className="text-sm font-mono break-all">
                  Payment ID: {order.paymentInfo.razorpayPaymentId}
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold">Order Date</h3>
              </div>
              <p className="text-gray-600">
                {new Date(order.orderDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {order.deliveryDate && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600 mb-1">Delivered on:</p>
                  <p className="text-gray-900">
                    {new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
