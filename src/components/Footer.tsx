'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">ArtisanCraft</h3>
            <p className="text-sm text-gray-400">
              Discover unique handcrafted art and handicrafts from talented artisans across the country.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-amber-500 transition">Home</Link></li>
              <li><Link href="/products" className="hover:text-amber-500 transition">Products</Link></li>
              <li><Link href="/about" className="hover:text-amber-500 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-amber-500 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=Pottery" className="hover:text-amber-500 transition">Pottery</Link></li>
              <li><Link href="/products?category=Textiles" className="hover:text-amber-500 transition">Textiles</Link></li>
              <li><Link href="/products?category=Metalwork" className="hover:text-amber-500 transition">Metalwork</Link></li>
              <li><Link href="/products?category=Woodwork" className="hover:text-amber-500 transition">Woodwork</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@artisancraft.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ArtisanCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
