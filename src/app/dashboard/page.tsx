'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Calendar, CreditCard, Eye } from 'lucide-react';

const statusColors: any = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role === 'admin') {
      router.push('/admin');
      return;
    }

    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { orders: data } = await api.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role === 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold">{orders.length}</p>
              </div>
              <Package className="w-12 h-12 text-amber-600 opacity-50" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Orders</p>
                <p className="text-3xl font-bold">
                  {orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}
                </p>
              </div>
              <Package className="w-12 h-12 text-blue-600 opacity-50" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Delivered</p>
                <p className="text-3xl font-bold">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <Package className="w-12 h-12 text-green-600 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Orders List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">My Orders</h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-32 rounded"></div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
              <Link href="/products">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order._id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                        <span className="text-sm text-gray-500 font-mono">
                          #{order._id.slice(-8)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="w-4 h-4" />
                          {order.items.length} item(s)
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="w-4 h-4" />
                          {order.paymentMethod}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-2xl font-bold text-amber-600">₹{order.totalAmount}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link href={`/orders/${order._id}`}>
                        <Button variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  );
}
