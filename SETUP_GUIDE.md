# Quick Setup Guide

## ⚡ Fast Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

### 3. Update `.env.local` with your MongoDB URI
```env
MONGODB_URI=mongodb://localhost:27017/handicraft-ecommerce
JWT_SECRET=my-secret-key-123
RAZORPAY_KEY_ID=rzp_test_dummy
RAZORPAY_KEY_SECRET=dummy_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_dummy
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Seed the Database (in another terminal)
```bash
curl -X POST http://localhost:3000/api/seed
```

### 6. Access the Application

**Website:** http://localhost:3000

**Admin Panel:** http://localhost:3000/admin
- Email: `admin`
- Password: `pass123`

## 📚 Complete Documentation

See [README.md](./README.md) for detailed installation instructions, API documentation, and deployment guides.

## 🎯 Key Routes

### User Routes
- `/` - Homepage
- `/products` - Product listing
- `/products/[id]` - Product details
- `/cart` - Shopping cart
- `/wishlist` - Wishlist
- `/checkout` - Checkout page
- `/dashboard` - User dashboard
- `/login` - Login
- `/register` - Register

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/orders` - Manage orders
- `/admin/users` - Manage users

## 🔧 Common Issues

### MongoDB Not Running
```bash
# Start MongoDB
mongod
```

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
npx kill-port 3000
```

### Clear Cache and Restart
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 💡 Tips

1. **Use MongoDB Atlas** for cloud database (free tier available)
2. **Get Razorpay Test Keys** from dashboard.razorpay.com for testing payments
3. **Seed Database** before testing to get sample products
4. **Check Console** for any API errors during development

## 🎨 Customization

### Change Theme Colors
Edit `src/app/globals.css` to customize the color scheme.

### Add New Categories
Update category arrays in:
- `src/app/page.tsx`
- `src/app/products/page.tsx`

### Modify Sample Data
Edit the products array in `src/app/api/seed/route.ts`

---

Happy Coding! 🚀
