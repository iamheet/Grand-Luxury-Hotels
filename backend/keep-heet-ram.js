const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Booking = require('./models/Booking');

async function keepOnlyHeetAndRam() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find Heet and Ram users
    const heetUser = await User.findOne({ email: 'iamheetchokshi@gmail.com' });
    const ramUser = await User.findOne({ email: 'ramkovind888@gmail.com' });

    if (!heetUser || !ramUser) {
      console.log('❌ Could not find Heet or Ram users');
      process.exit(1);
    }

    console.log('✅ Found Heet and Ram users');

    // Get users to remove (all except Heet and Ram)
    const usersToRemove = await User.find({ 
      _id: { $nin: [heetUser._id, ramUser._id] }
    });

    console.log(`📋 Found ${usersToRemove.length} users to remove`);

    // Remove bookings of users to be deleted
    const userIdsToRemove = usersToRemove.map(u => u._id);
    const removedBookings = await Booking.deleteMany({ 
      userId: { $in: userIdsToRemove }
    });

    console.log(`🗑️ Removed ${removedBookings.deletedCount} bookings`);

    // Remove the users
    const removedUsers = await User.deleteMany({ 
      _id: { $in: userIdsToRemove }
    });

    console.log(`🗑️ Removed ${removedUsers.deletedCount} users`);

    console.log('\n✅ Cleanup complete!');
    console.log('👥 Remaining users: Heet Chokshi & Ram Kovind');
    console.log(`📊 Total users: ${await User.countDocuments()}`);
    console.log(`📊 Total bookings: ${await Booking.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

keepOnlyHeetAndRam();