const mongoose = require('mongoose');
require('dotenv').config();

const Hotel = require('./models/Hotel');
const User = require('./models/User');
const Member = require('./models/Member');
const Booking = require('./models/Booking');

async function checkExistingData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const hotelCount = await Hotel.countDocuments();
    const userCount = await User.countDocuments();
    const memberCount = await Member.countDocuments();
    const bookingCount = await Booking.countDocuments();

    console.log('\n📊 Current Database Status:');
    console.log(`Hotels: ${hotelCount}`);
    console.log(`Users: ${userCount}`);
    console.log(`Members: ${memberCount}`);
    console.log(`Bookings: ${bookingCount}`);

    if (bookingCount > 0) {
      console.log('\n📋 Recent Bookings:');
      const recentBookings = await Booking.find().limit(5).sort({ createdAt: -1 });
      recentBookings.forEach(booking => {
        console.log(`- ${booking.hotelName} | ${booking.guest?.name || 'N/A'} | ${booking.total}`);
      });
    }

    if (userCount > 0) {
      console.log('\n👥 Recent Users:');
      const recentUsers = await User.find().limit(5).sort({ createdAt: -1 });
      recentUsers.forEach(user => {
        console.log(`- ${user.name} | ${user.email}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkExistingData();