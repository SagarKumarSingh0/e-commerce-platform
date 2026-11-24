const router = require('express').Router();
const mongoose = require('mongoose');

// Create a simple schema for contact messages
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newContact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message received', data: newContact });
  } catch (err) {
    next(err);
  }
});

module.exports = router;