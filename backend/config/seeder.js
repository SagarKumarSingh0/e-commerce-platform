const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  { name: 'Wireless Headphones', description: 'Premium noise-cancelling Bluetooth headphones', price: 199.99, category: 'Electronics', stock: 50, rating: 4.5, featured: true, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
  { name: 'Smart Watch', description: 'Fitness tracking smart watch with heart rate monitor', price: 249.99, category: 'Electronics', stock: 30, rating: 4.3, featured: true, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
  { name: 'Running Shoes', description: 'Lightweight running shoes for daily training', price: 89.99, category: 'Sports', stock: 100, rating: 4.6, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
  { name: 'Coffee Maker', description: 'Programmable coffee maker with thermal carafe', price: 79.99, category: 'Home', stock: 25, rating: 4.2, image: 'https://images.unsplash.com/photo-1517914309068-900c5b6b1d5b?w=500' },
  { name: 'Backpack', description: 'Durable laptop backpack with USB charging port', price: 59.99, category: 'Accessories', stock: 75, rating: 4.4, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500' },
  { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical gaming keyboard', price: 129.99, category: 'Electronics', stock: 40, rating: 4.7, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500' },
  { name: 'Water Bottle', description: 'Insulated stainless steel water bottle', price: 34.99, category: 'Sports', stock: 120, rating: 4.5, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500' },
  { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness', price: 44.99, category: 'Home', stock: 60, rating: 4.1, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500' }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce')
  .then(async () => {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Products seeded');
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });