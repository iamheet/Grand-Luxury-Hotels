const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Hotel = require('./models/Hotel');
const User = require('./models/User');
const Member = require('./models/Member');
const Booking = require('./models/Booking');

async function restoreData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create Hotels
    const hotels = [
      {
        name: 'The Grand Palace',
        location: 'Mumbai',
        email: 'palace@grandstay.com',
        password: 'hotel123',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        rating: 4.8,
        exclusive: false
      },
      {
        name: 'Luxury Resort',
        location: 'Goa',
        email: 'resort@grandstay.com',
        password: 'hotel123',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
        rating: 4.9,
        exclusive: true
      },
      {
        name: 'Mountain View Hotel',
        location: 'Shimla',
        email: 'mountain@grandstay.com',
        password: 'hotel123',
        price: 6000,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        rating: 4.6,
        exclusive: false
      }
    ];

    for (const hotel of hotels) {
      const existing = await Hotel.findOne({ email: hotel.email });
      if (!existing) {
        await new Hotel(hotel).save();
        console.log(`✅ Created hotel: ${hotel.name}`);
      }
    }

    // Create Members
    const members = [
      {
        name: 'VIP Member',
        email: 'vip@grandstay.com',
        password: await bcrypt.hash('vip123', 10),
        phone: '+919876543210',
        tier: 'Platinum',
        membershipId: 'PLAT001',
        points: 10000
      },
      {
        name: 'Gold Member',
        email: 'gold@grandstay.com',
        password: await bcrypt.hash('gold123', 10),
        phone: '+919876543211',
        tier: 'Gold',
        membershipId: 'GOLD001',
        points: 5000
      }
    ];

    for (const member of members) {
      const existing = await Member.findOne({ membershipId: member.membershipId });
      if (!existing) {
        await new Member(member).save();
        console.log(`✅ Created member: ${member.name}`);
      }
    }

    // Create Users
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('user123', 10),
        phone: '+919876543212',
        isMember: false,
        points: 500
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('user123', 10),
        phone: '+919876543213',
        isMember: true,
        membershipTier: 'Silver',
        points: 1500
      }
    ];

    for (const user of users) {
      const existing = await User.findOne({ email: user.email });
      if (!existing) {
        await new User(user).save();
        console.log(`✅ Created user: ${user.name}`);
      }
    }

    console.log('\n🎉 All data restored successfully!');
    console.log('\nTest Credentials:');
    console.log('Hotels: palace@grandstay.com / hotel123');
    console.log('Members: PLAT001 / vip123, GOLD001 / gold123');
    console.log('Users: john@example.com / user123');
    console.log('Admin: admin / luxury2024');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error restoring data:', error);
    process.exit(1);
  }
}

restoreData();