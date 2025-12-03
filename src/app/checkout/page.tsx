'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreditCard, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const { cart: data } = await api.getCart();
      if (!data?.items || data.items.length === 0) {
        toast.error('Your cart is empty');
        router.push('/cart');
        return;
      }
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total: number, item: any) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.street || 
        !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
      toast.error('Please fill all shipping details');
      return;
    }

    setProcessing(true);

    try {
      const totalAmount = calculateTotal();

      // Create Razorpay order
      const { order } = await api.createPaymentOrder(totalAmount);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: order.amount,
        currency: order.currency,
        name: 'ArtisanCraft',
        description: 'Handicraft Purchase',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Create order
            const orderItems = cart.items.map((item: any) => ({
              productId: item.productId._id,
              name: item.productId.name,
              price: item.productId.price,
              quantity: item.quantity,
              image: item.productId.images[0],
            }));

            const orderData = {
              items: orderItems,
              shippingAddress: shippingInfo,
              paymentMethod: 'Razorpay',
              paymentInfo: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              totalAmount,
            };

            const { order: createdOrder } = await api.createOrder(orderData);

            toast.success('Order placed successfully!');
            router.push(`/order-confirmation?orderId=${createdOrder._id}`);
          } catch (error: any) {
            toast.error(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: shippingInfo.name,
          contact: shippingInfo.phone,
        },
        theme: {
          color: '#D97706',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setProcessing(false);
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
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 w-48 rounded"></div>
            <div className="bg-gray-200 h-64 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold">Shipping Information</h2>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={shippingInfo.street}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-lg mt-6"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {processing ? 'Processing...' : `Pay ₹${total}`}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cart?.items?.map((item: any) => (
                    <div key={item.productId._id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-2">{item.productId.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₹{item.productId.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-amber-600">₹{total}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
