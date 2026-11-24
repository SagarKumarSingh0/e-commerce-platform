const router = require('express').Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { auth, admin } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/users', auth, admin, async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { next(err); }
});

// Get dashboard stats (Admin only)
router.get('/stats', auth, admin, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    res.json({ totalUsers, totalOrders, totalRevenue });
  } catch (err) { next(err); }
});

module.exports = router;