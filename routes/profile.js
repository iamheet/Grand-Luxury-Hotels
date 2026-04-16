const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Member = require('../models/Member');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const mapAccountToProfileUser = (account, userType) => {
  const isMember = userType === 'member' || account.isMember;

  return {
    id: account._id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    emailVerified: account.emailVerified || false,
    phoneVerified: account.phoneVerified || false,
    isMember,
    membershipTier: userType === 'member' ? account.tier : account.membershipTier,
    membershipId: account.membershipId,
    points: account.points || 0,
    membershipDate: account.membershipDate,
    createdAt: account.createdAt
  };
};

// Get user profile with all their bookings
router.get('/', auth, async (req, res) => {
  try {
    console.log('🔍 Profile API Debug:');
    console.log('  - req.userId:', req.userId);
    console.log('  - req.headers.authorization:', req.headers.authorization);
    
    const userId = req.userId;
    console.log('  - Extracted userId:', userId);
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID not found in token',
        debug: {
          reqUserId: req.userId
        }
      });
    }
    
    const AccountModel = req.userType === 'member' ? Member : User;
    console.log(`  - Searching for ${req.userType === 'member' ? 'member' : 'user'} with ID:`, userId);
    const account = await AccountModel.findById(userId).select('-password -resetToken -resetTokenExpiry');
    console.log('  - Account found:', !!account);
    
    if (!account) {
      const anyAccount = await AccountModel.findOne().select('_id name email');
      console.log('  - Any matching account type in database:', !!anyAccount);
      
      return res.status(404).json({ 
        success: false,
        message: req.userType === 'member' ? 'Member not found' : 'User not found',
        debug: {
          searchedUserId: userId,
          userType: req.userType,
          userIdType: typeof userId,
          databaseHasAccounts: !!anyAccount
        }
      });
    }

    // Get all bookings for this user
    const bookings = await Booking.find({ userId: userId }).sort({ createdAt: -1 });

    // Calculate stats
    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((sum, booking) => sum + (booking.total || 0), 0);
    const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length;
    const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;

    // Format response
    const profileData = {
      user: mapAccountToProfileUser(account, req.userType),
      bookings: bookings.map(booking => ({
        id: booking._id,
        type: booking.type,
        hotelId: booking.hotelId,
        hotelName: booking.hotelName,
        roomTitle: booking.roomTitle,
        location: booking.location,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        nights: booking.nights,
        price: booking.price,
        total: booking.total,
        hotelTotal: booking.hotelTotal,
        aircraftTotal: booking.aircraftTotal,
        carTotal: booking.carTotal,
        travelTotal: booking.travelTotal,
        diningTotal: booking.diningTotal,
        entertainmentTotal: booking.entertainmentTotal,
        chefTotal: booking.chefTotal,
        wineTotal: booking.wineTotal,
        ticketTotal: booking.ticketTotal,
        eventTotal: booking.eventTotal,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        bookingType: booking.bookingType,
        memberTier: booking.memberTier,
        bookingDate: booking.bookingDate || booking.createdAt,
        createdAt: booking.createdAt,
        room: booking.room,
        aircraft: booking.aircraft,
        car: booking.car,
        travel: booking.travel,
        services: booking.services,
        guest: booking.guest,
        member: booking.member
      })),
      stats: {
        totalBookings,
        totalSpent,
        confirmedBookings,
        pendingBookings
      }
    };

    res.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching profile data',
      error: error.message 
    });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone } = req.body;

    // Validate input
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name must be at least 2 characters long' 
      });
    }

    const AccountModel = req.userType === 'member' ? Member : User;

    // Update account
    const updatedAccount = await AccountModel.findByIdAndUpdate(
      userId,
      { 
        name: name.trim(),
        phone: phone ? phone.trim() : undefined
      },
      { new: true, runValidators: true }
    ).select('-password -resetToken -resetTokenExpiry');

    if (!updatedAccount) {
      return res.status(404).json({ 
        success: false, 
        message: req.userType === 'member' ? 'Member not found' : 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: mapAccountToProfileUser(updatedAccount, req.userType)
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating profile',
      error: error.message 
    });
  }
});

// Get user booking by ID
router.get('/booking/:bookingId', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ 
      _id: bookingId, 
      userId: userId 
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Booking fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching booking',
      error: error.message 
    });
  }
});

module.exports = router;
