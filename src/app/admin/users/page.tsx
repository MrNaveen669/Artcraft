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
import { Users, Mail, Calendar, Ban, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
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

    fetchUsers();
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    try {
      const { users: data } = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      await api.updateUser(userId, { isBlocked: !isBlocked });
      toast.success(`User ${!isBlocked ? 'blocked' : 'unblocked'} successfully`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
    }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Users Management</h1>
          <p className="text-gray-600">{users.length} users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-10 h-10 text-blue-600" />
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-10 h-10 text-green-600" />
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => !u.isBlocked).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Ban className="w-10 h-10 text-red-600" />
              <div>
                <p className="text-gray-600 text-sm">Blocked Users</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.isBlocked).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">User</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Joined</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="animate-pulse">Loading users...</div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((usr) => (
                    <tr key={usr._id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {usr.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{usr.name}</p>
                            <p className="text-xs text-gray-500">ID: {usr._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {usr.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={usr.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}>
                          {usr.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(usr.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {usr.isBlocked ? (
                          <Badge className="bg-red-100 text-red-800">Blocked</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end">
                          {usr.role !== 'admin' && (
                            <Button
                              onClick={() => toggleBlockUser(usr._id, usr.isBlocked)}
                              variant="outline"
                              size="sm"
                              className={usr.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}
                            >
                              {usr.isBlocked ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <Ban className="w-4 h-4 mr-2" />
                                  Block
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
