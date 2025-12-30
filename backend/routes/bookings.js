const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Get user bookings (My Bookings)
router.get('/', auth, async (req, res) => {
  try {
    console.log('=== FETCHING BOOKINGS ===');
    console.log('User ID from token:', req.userId);
    console.log('User Type:', req.userType);
    console.log('Is Exclusive:', req.isExclusive);
    
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
    console.log('Found bookings count:', bookings.length);
    console.log('Booking user IDs:', bookings.map(b => b.userId));
    
    // Add booking type to each booking
    const bookingsWithType = bookings.map(booking => ({
      ...booking.toObject(),
      bookingType: req.isExclusive ? 'Exclusive Member' : 'Regular User',
      memberTier: req.memberTier || null
    }));
    
    res.json({
      success: true,
      count: bookings.length,
      bookings: bookingsWithType,
      currentUserId: req.userId // Add this for debugging
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings (Admin only)
router.get('/admin/all', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    // Additional validation - user already validated in auth middleware
    const bookingData = {
      ...req.body,
      userId: req.userId,
      bookingType: req.isExclusive ? 'Exclusive Member' : 'Regular User',
      memberTier: req.memberTier || null
    };
    
    const booking = new Booking(bookingData);
    await booking.save();
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
