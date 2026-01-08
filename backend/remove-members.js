const mongoose = require('mongoose');
require('dotenv').config();

const Member = require('./models/Member');
const Booking = require('./models/Booking');

async function removeMembers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove all member bookings first
    const memberBookings = await Booking.deleteMany({ bookingType: 'Exclusive Member' });
    console.log(`🗑️ Removed ${memberBookings.deletedCount} member bookings`);

    // Remove all members
    const members = await Member.deleteMany({});
    console.log(`🗑️ Removed ${members.deletedCount} members`);

    console.log('\n✅ All members and their bookings have been removed');
    console.log('You can now create new members fresh!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

removeMembers();