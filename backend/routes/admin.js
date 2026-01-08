const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Member = require('../models/Member');
const Booking = require('../models/Booking');
const { authenticateAdmin } = require('../middleware/auth');

// Get all database data (for admin viewing)
router.get('/database', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const members = await Member.find().select('-password');
    const bookings = await Booking.find();

    res.json({
      success: true,
      data: {
        users: {
          count: users.length,
          data: users
        },
        members: {
          count: members.length,
          data: members
        },
        bookings: {
          count: bookings.length,
          data: bookings
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;