import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('pass123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedAdminPassword,
      role: 'admin',
    });

    // Create sample products
    const products = [
      {
        name: 'Hand-Painted Ceramic Vase',
        description: 'Beautiful hand-painted ceramic vase with traditional patterns. Perfect for home decoration.',
        price: 2499,
        category: 'Pottery',
        images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80'],
        stock: 15,
        material: 'Ceramic',
        dimensions: '12" x 6"',
        weight: '800g',
        artisan: 'Rajesh Kumar',
        featured: true,
        rating: 4.5,
      },
      {
        name: 'Handwoven Cotton Rug',
        description: 'Handwoven cotton rug with intricate geometric patterns. Made using traditional weaving techniques.',
        price: 3999,
        category: 'Textiles',
        images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80'],
        stock: 8,
        material: 'Cotton',
        dimensions: '48" x 72"',
        weight: '2kg',
        artisan: 'Priya Sharma',
        featured: true,
        rating: 4.8,
      },
      {
        name: 'Brass Diya Set',
        description: 'Set of 5 handcrafted brass diyas with beautiful engravings. Perfect for festivals and ceremonies.',
        price: 899,
        category: 'Metalwork',
        images: ['https://images.unsplash.com/photo-1605900576497-8da77c84ebfb?w=800&q=80'],
        stock: 25,
        material: 'Brass',
        dimensions: '3" diameter each',
        weight: '500g',
        artisan: 'Anil Verma',
        featured: false,
        rating: 4.3,
      },
      {
        name: 'Wooden Wall Art',
        description: 'Handcrafted wooden wall art with intricate carvings. A unique piece for your home.',
        price: 4599,
        category: 'Woodwork',
        images: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80'],
        stock: 6,
        material: 'Teak Wood',
        dimensions: '24" x 18"',
        weight: '1.5kg',
        artisan: 'Mohan Das',
        featured: true,
        rating: 4.9,
      },
      {
        name: 'Embroidered Cushion Covers',
        description: 'Set of 2 cushion covers with traditional embroidery work. Adds elegance to your living space.',
        price: 1299,
        category: 'Textiles',
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
        stock: 20,
        material: 'Cotton with silk thread',
        dimensions: '16" x 16"',
        weight: '200g',
        artisan: 'Lakshmi Devi',
        featured: false,
        rating: 4.4,
      },
      {
        name: 'Terracotta Plant Pots Set',
        description: 'Set of 3 handmade terracotta plant pots with drainage holes. Perfect for indoor plants.',
        price: 799,
        category: 'Pottery',
        images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'],
        stock: 30,
        material: 'Terracotta',
        dimensions: 'Small, Medium, Large',
        weight: '1kg',
        artisan: 'Ganesh Patel',
        featured: false,
        rating: 4.2,
      },
      {
        name: 'Handmade Paper Journal',
        description: 'Eco-friendly journal made from handmade paper. Bound with traditional techniques.',
        price: 599,
        category: 'Stationery',
        images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'],
        stock: 40,
        material: 'Handmade Paper, Fabric',
        dimensions: '8" x 6"',
        weight: '300g',
        artisan: 'Neha Singh',
        featured: false,
        rating: 4.6,
      },
      {
        name: 'Silver Filigree Jewelry Box',
        description: 'Exquisite silver filigree jewelry box with velvet lining. A perfect gift.',
        price: 5999,
        category: 'Metalwork',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'],
        stock: 5,
        material: 'Silver',
        dimensions: '6" x 4" x 3"',
        weight: '400g',
        artisan: 'Kamal Hussain',
        featured: true,
        rating: 4.7,
      },
      {
        name: 'Block Print Table Runner',
        description: 'Hand block printed table runner with natural dyes. Adds a touch of tradition to your dining.',
        price: 1899,
        category: 'Textiles',
        images: ['https://images.unsplash.com/photo-1600494603989-9650cf6dccec?w=800&q=80'],
        stock: 12,
        material: 'Cotton',
        dimensions: '72" x 14"',
        weight: '250g',
        artisan: 'Asha Kumari',
        featured: false,
        rating: 4.5,
      },
      {
        name: 'Bamboo Wind Chimes',
        description: 'Handcrafted bamboo wind chimes with a soothing sound. Perfect for gardens and balconies.',
        price: 699,
        category: 'Woodwork',
        images: ['https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?w=800&q=80'],
        stock: 18,
        material: 'Bamboo',
        dimensions: '24" length',
        weight: '200g',
        artisan: 'Ravi Shankar',
        featured: false,
        rating: 4.1,
      },
      {
        name: 'Marble Coaster Set',
        description: 'Set of 4 marble coasters with gold inlay work. Elegant and functional.',
        price: 1499,
        category: 'Stoneware',
        images: ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&q=80'],
        stock: 22,
        material: 'Marble',
        dimensions: '4" x 4" each',
        weight: '600g',
        artisan: 'Amit Shah',
        featured: false,
        rating: 4.4,
      },
      {
        name: 'Handwoven Jute Basket',
        description: 'Large handwoven jute basket for storage. Eco-friendly and durable.',
        price: 1099,
        category: 'Textiles',
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'],
        stock: 16,
        material: 'Jute',
        dimensions: '12" x 10"',
        weight: '500g',
        artisan: 'Meena Rani',
        featured: false,
        rating: 4.3,
      },
    ];

    await Product.insertMany(products);

    return NextResponse.json({
      message: 'Database seeded successfully',
      adminCredentials: {
        email: 'admin',
        password: 'pass123',
      },
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
