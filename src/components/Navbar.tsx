'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, User, LogOut, Package, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ArtisanCraft</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-amber-600 transition">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-amber-600 transition">
              Products
            </Link>
            {user && (
              <>
                <Link href="/wishlist" className="text-gray-700 hover:text-amber-600 transition flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  Wishlist
                </Link>
                <Link href="/cart" className="text-gray-700 hover:text-amber-600 transition flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin ? (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <Package className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button onClick={logout} variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-amber-600 py-2">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-amber-600 py-2">
                Products
              </Link>
              {user && (
                <>
                  <Link href="/wishlist" className="text-gray-700 hover:text-amber-600 py-2 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Wishlist
                  </Link>
                  <Link href="/cart" className="text-gray-700 hover:text-amber-600 py-2 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Cart
                  </Link>
                  {isAdmin ? (
                    <Link href="/admin" className="text-gray-700 hover:text-amber-600 py-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  ) : (
                    <Link href="/dashboard" className="text-gray-700 hover:text-amber-600 py-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="text-left text-gray-700 hover:text-amber-600 py-2 flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link href="/login">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
