'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [''],
    stock: '',
    material: '',
    dimensions: '',
    weight: '',
    artisan: '',
    featured: false,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isAdmin) {
      router.push('/');
      return;
    }

    fetchProducts();
  }, [user, isAdmin]);

  const fetchProducts = async () => {
    try {
      const { products: data } = await api.getProducts({ search });
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, data);
        toast.success('Product updated successfully');
      } else {
        await api.createProduct(data);
        toast.success('Product created successfully');
      }

      setDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      images: product.images,
      stock: product.stock.toString(),
      material: product.material || '',
      dimensions: product.dimensions || '',
      weight: product.weight || '',
      artisan: product.artisan || '',
      featured: product.featured,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      images: [''],
      stock: '',
      material: '',
      dimensions: '',
      weight: '',
      artisan: '',
      featured: false,
    });
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Products Management</h1>
            <p className="text-gray-600">{products.length} products</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price (₹) *</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Stock *</Label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Category *</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Pottery, Textiles, Metalwork"
                    required
                  />
                </div>

                <div>
                  <Label>Image URL *</Label>
                  <Input
                    value={formData.images[0]}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="https://..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Material</Label>
                    <Input
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Dimensions</Label>
                    <Input
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Weight</Label>
                    <Input
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Artisan</Label>
                    <Input
                      value={formData.artisan}
                      onChange={(e) => setFormData({ ...formData, artisan: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">Featured Product</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Products Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Product</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Price</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Stock</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Featured</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="animate-pulse">Loading products...</div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={product.images[0] || '/placeholder.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.artisan}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{product.category}</td>
                      <td className="py-4 px-6 font-semibold">₹{product.price}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0 ? 'bg-red-100 text-red-800' :
                          product.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {product.featured ? (
                          <span className="text-amber-600">★ Featured</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleEdit(product)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(product._id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      <Footer />
    </div>
  );
}
