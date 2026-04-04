const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Already subscribed' });
    }

    const subscriber = new Newsletter({ email });
    await subscriber.save();

    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all subscribers (admin only)
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, count: subscribers.length, subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
