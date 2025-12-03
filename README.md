# ArtisanCraft - E-Commerce Platform

A full-stack, production-ready e-commerce platform for handcrafted art and handicrafts built with Next.js 15, MongoDB, and Razorpay payment integration.

## 🎨 Features

### User Features
- 🏠 **Homepage** - Hero section, featured products, category browsing
- 🛍️ **Product Catalog** - Advanced filtering, sorting, and search
- 📦 **Product Details** - Detailed product information with reviews
- 🛒 **Shopping Cart** - Add, update, remove items
- ❤️ **Wishlist** - Save favorite products
- 💳 **Checkout** - Secure payment with Razorpay integration
- 📱 **Order Tracking** - View order status and history
- 👤 **User Dashboard** - Manage orders and profile

### Admin Features
- 🔐 **Admin Login** - Secure admin authentication (admin/pass123)
- 📊 **Dashboard** - Overview with stats and recent orders
- 📦 **Product Management** - CRUD operations for products
- 📋 **Order Management** - View and update order status
- 👥 **User Management** - View and block/unblock users

### Technical Features
- 🔒 **JWT Authentication** - Secure user authentication
- 💾 **MongoDB Database** - Scalable NoSQL database
- 💰 **Razorpay Integration** - Indian payment gateway
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Tailwind CSS** - Modern styling with handicraft theme
- ⚡ **Next.js 15** - Latest React framework with App Router

## 🚀 Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn/UI Components
- Lucide Icons

**Backend:**
- Next.js API Routes
- MongoDB with Mongoose
- JWT Authentication
- Razorpay Payment Gateway

## 📋 Prerequisites

Before you begin, ensure you have installed:
- Node.js 18+ or Bun
- MongoDB 4.4+
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd handicraft-ecommerce
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using bun:
```bash
bun install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the `.env.local` file with your configuration:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/handicraft-ecommerce

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in `.env.local`

### 5. Setup Razorpay

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from Settings → API Keys
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env.local`

**Note:** Use test mode keys for development.

### 6. Seed the Database

Seed the database with initial products and admin user:

```bash
# Start the development server first
npm run dev

# Then in another terminal, run the seed endpoint
curl -X POST http://localhost:3000/api/seed
```

This creates:
- Admin user (email: `admin`, password: `pass123`)
- 12 sample products across different categories

### 7. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🔑 Default Credentials

**Admin Access:**
- Email: `admin`
- Password: `pass123`

**Test User:**
Register a new account at `/register`

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── products/      # Product endpoints
│   │   │   ├── cart/          # Cart endpoints
│   │   │   ├── wishlist/      # Wishlist endpoints
│   │   │   ├── orders/        # Order endpoints
│   │   │   ├── payment/       # Payment endpoints
│   │   │   ├── admin/         # Admin endpoints
│   │   │   └── seed/          # Database seeding
│   │   ├── admin/             # Admin panel pages
│   │   ├── products/          # Product pages
│   │   ├── cart/              # Cart page
│   │   ├── wishlist/          # Wishlist page
│   │   ├── checkout/          # Checkout page
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Login page
│   │   └── register/          # Registration page
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn UI components
│   │   ├── Navbar.tsx        # Navigation bar
│   │   └── Footer.tsx        # Footer component
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication context
│   ├── lib/                  # Utility libraries
│   │   ├── api.ts           # API client
│   │   ├── auth.ts          # Auth utilities
│   │   ├── jwt.ts           # JWT utilities
│   │   └── mongodb.ts       # MongoDB connection
│   └── models/               # MongoDB models
│       ├── User.ts
│       ├── Product.ts
│       ├── Cart.ts
│       ├── Wishlist.ts
│       └── Order.ts
├── public/                   # Static assets
├── .env.example             # Environment variables template
├── .env.local              # Your environment variables (git-ignored)
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart` - Remove item from cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist` - Remove item from wishlist

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (admin)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user (block/unblock)
- `GET /api/admin/orders` - Get all orders

## 🎨 Customization

### Color Scheme

The handicraft theme uses warm amber and orange tones. You can customize colors in `src/app/globals.css`.

### Categories

Add or modify categories in:
- Frontend: `src/app/page.tsx` and `src/app/products/page.tsx`
- Backend: Product model accepts any category string

## 🧪 Testing

### Test the Seed Endpoint
```bash
curl -X POST http://localhost:3000/api/seed
```

### Test Authentication
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin","password":"pass123"}'
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secure random string
- `RAZORPAY_KEY_ID` - Razorpay key
- `RAZORPAY_KEY_SECRET` - Razorpay secret
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Public Razorpay key
- `NEXT_PUBLIC_APP_URL` - Your production URL

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env.local`
- Whitelist your IP in MongoDB Atlas

### Razorpay Payment Issues
- Verify API keys are correct
- Use test mode keys for development
- Check webhook configuration for production

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for artisan communities

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for beautiful UI components
- Razorpay for payment integration
- MongoDB for the database
- All the amazing artisans who inspired this project

---

**Note:** This is a demonstration project. For production use, implement additional security measures, error handling, and testing.