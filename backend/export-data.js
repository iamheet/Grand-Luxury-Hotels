const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Hotel = require('./models/Hotel');
const User = require('./models/User');
const Member = require('./models/Member');
const Booking = require('./models/Booking');

async function exportData() {
  try {
    // Connect to local MongoDB
    await mongoose.connect('mongodb://localhost:27017/the-grand-stay');
    console.log('✅ Connected to local MongoDB');

    // Export Hotels
    const hotels = await Hotel.find({});
    fs.writeFileSync('./data-export/hotels.json', JSON.stringify(hotels, null, 2));
    console.log(`📄 Exported ${hotels.length} hotels`);

    // Export Users
    const users = await User.find({});
    fs.writeFileSync('./data-export/users.json', JSON.stringify(users, null, 2));
    console.log(`👥 Exported ${users.length} users`);

    // Export Members
    const members = await Member.find({});
    fs.writeFileSync('./data-export/members.json', JSON.stringify(members, null, 2));
    console.log(`💎 Exported ${members.length} members`);

    // Export Bookings
    const bookings = await Booking.find({});
    fs.writeFileSync('./data-export/bookings.json', JSON.stringify(bookings, null, 2));
    console.log(`📋 Exported ${bookings.length} bookings`);

    console.log('\n✅ Data export completed! Files saved in ./data-export/');
    process.exit(0);
  } catch (error) {
    console.error('❌ Export error:', error);
    process.exit(1);
  }
}

// Create export directory if it doesn't exist
if (!fs.existsSync('./data-export')) {
  fs.mkdirSync('./data-export');
}

exportData();