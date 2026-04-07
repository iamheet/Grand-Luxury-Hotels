const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Hotel = require('./models/Hotel');
const User = require('./models/User');
const Member = require('./models/Member');
const Booking = require('./models/Booking');

async function importData() {
  try {
    // Connect to cloud MongoDB (you'll need to update MONGODB_URI in .env)
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to cloud MongoDB');

    // Import Hotels
    if (fs.existsSync('./data-export/hotels.json')) {
      const hotels = JSON.parse(fs.readFileSync('./data-export/hotels.json', 'utf8'));
      if (hotels.length > 0) {
        await Hotel.deleteMany({}); // Clear existing
        await Hotel.insertMany(hotels);
        console.log(`🏨 Imported ${hotels.length} hotels`);
      }
    }

    // Import Users
    if (fs.existsSync('./data-export/users.json')) {
      const users = JSON.parse(fs.readFileSync('./data-export/users.json', 'utf8'));
      if (users.length > 0) {
        await User.deleteMany({}); // Clear existing
        await User.insertMany(users);
        console.log(`👥 Imported ${users.length} users`);
      }
    }

    // Import Members
    if (fs.existsSync('./data-export/members.json')) {
      const members = JSON.parse(fs.readFileSync('./data-export/members.json', 'utf8'));
      if (members.length > 0) {
        await Member.deleteMany({}); // Clear existing
        await Member.insertMany(members);
        console.log(`💎 Imported ${members.length} members`);
      }
    }

    // Import Bookings
    if (fs.existsSync('./data-export/bookings.json')) {
      const bookings = JSON.parse(fs.readFileSync('./data-export/bookings.json', 'utf8'));
      if (bookings.length > 0) {
        await Booking.deleteMany({}); // Clear existing
        await Booking.insertMany(bookings);
        console.log(`📋 Imported ${bookings.length} bookings`);
      }
    }

    console.log('\n✅ Data import completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import error:', error);
    process.exit(1);
  }
}

importData();