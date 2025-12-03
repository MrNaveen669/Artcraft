'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Package, MapPin, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const statusColors: any = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isAdmin) {
      router.push('/');
      return;
    }

    fetchOrders();
  }, [user, isAdmin, filterStatus]);

  const fetchOrders = async () => {
    try {
      const { orders: data } = await api.getAdminOrders(filterStatus);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrder(orderId, { status });
      toast.success('Order status updated');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order');
    }
  };

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">{orders.length} orders</p>
        </div>

        {/* Filter */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Orders Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Items</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="animate-pulse">Loading orders...</div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-6 font-mono text-sm">#{order._id.slice(-8)}</td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium">{order.userId?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{order.userId?.email || ''}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{order.items.length}</td>
                      <td className="py-4 px-6 font-semibold">₹{order.totalAmount}</td>
                      <td className="py-4 px-6">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order._id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <Badge className={statusColors[order.status]}>
                              {order.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end">
                          <Button
                            onClick={() => viewOrderDetails(order)}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-mono font-semibold">#{selectedOrder._id}</p>
                  </div>
                  <Badge className={statusColors[selectedOrder.status]}>
                    {selectedOrder.status}
                  </Badge>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{selectedOrder.userId?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.userId?.email || ''}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-3 border-t mt-3">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl text-amber-600">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.shippingAddress.name}</p>
                    <p>{selectedOrder.shippingAddress.phone}</p>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                      {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Order Date
                  </h3>
                  <p className="text-gray-600">
                    {new Date(selectedOrder.orderDate).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
}
