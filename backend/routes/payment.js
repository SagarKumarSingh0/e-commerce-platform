const router = require('express').Router();
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

// Note: For production, integrate Stripe. This is a mock payment for demo.
router.post('/:orderId/pay', auth, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (order.isPaid) return res.status(400).json({ message: 'Order already paid' });

    // In production: create Stripe PaymentIntent here
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({...});

    // Mock payment success
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: 'MOCK_' + Date.now(),
      status: 'succeeded',
      email: req.body.email || 'customer@example.com'
    };
    order.status = 'processing';
    await order.save();
    res.json(order);
  } catch (err) { next(err); }
});

module.exports = router;