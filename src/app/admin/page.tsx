'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Clock, CheckCircle, Truck } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isAdmin) {
      router.push('/');
      return;
    }

    fetchStats();
  }, [user, isAdmin]);

  const fetchStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data.stats);
      setRecentOrders(data.recentOrders);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your e-commerce platform</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-4 w-24 rounded mb-2"></div>
                  <div className="bg-gray-200 h-8 w-16 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-10 h-10 opacity-80" />
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-white/80 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold">₹{stats?.totalRevenue || 0}</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingBag className="w-10 h-10 opacity-80" />
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-white/80 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-10 h-10 opacity-80" />
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-white/80 text-sm mb-1">Total Products</p>
                <p className="text-3xl font-bold">{stats?.totalProducts || 0}</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-10 h-10 opacity-80" />
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-white/80 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
              </Card>
            </div>

            {/* Orders by Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-gray-600 text-sm">Pending</p>
                    <p className="text-2xl font-bold">{stats?.ordersByStatus?.pending || 0}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-gray-600 text-sm">Processing</p>
                    <p className="text-2xl font-bold">{stats?.ordersByStatus?.processing || 0}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-gray-600 text-sm">Shipped</p>
                    <p className="text-2xl font-bold">{stats?.ordersByStatus?.shipped || 0}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-gray-600 text-sm">Delivered</p>
                    <p className="text-2xl font-bold">{stats?.ordersByStatus?.delivered || 0}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link href="/admin/products">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-amber-500">
                  <Package className="w-12 h-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Manage Products</h3>
                  <p className="text-gray-600">Add, edit, or remove products</p>
                </Card>
              </Link>

              <Link href="/admin/orders">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
                  <ShoppingBag className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Manage Orders</h3>
                  <p className="text-gray-600">View and update order status</p>
                </Card>
              </Link>

              <Link href="/admin/users">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
                  <Users className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
                  <p className="text-gray-600">View and manage user accounts</p>
                </Card>
              </Link>
            </div>

            {/* Recent Orders */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">#{order._id.slice(-8)}</td>
                        <td className="py-3 px-4">{order.userId?.name || 'N/A'}</td>
                        <td className="py-3 px-4 font-semibold">₹{order.totalAmount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
