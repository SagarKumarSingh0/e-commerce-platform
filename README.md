# 🛍️ ShopHub - E-commerce Platform

Full-stack e-commerce platform built for Final Year Project.

## Features

✅ User authentication (JWT)
✅ Product listing with search, filters, sorting, pagination
✅ Shopping cart (add/update/remove/clear)
✅ Checkout with shipping address
✅ Order management
✅ Payment processing (mock Stripe integration)
✅ Admin panel (product CRUD)
✅ Responsive design (mobile-friendly)
✅ Role-based access control

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
**Frontend:** HTML5, CSS3, Vanilla JavaScript (fetch API)
**Payment:** Stripe (mock for demo)

## Setup Instructions

### 1. Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Edit with your credentials
node config/seeder.js  # Seed sample products
npm run dev

