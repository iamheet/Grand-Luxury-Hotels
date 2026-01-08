const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Hotel = require('./models/Hotel');
const User = require('./models/User');
const Member = require('./models/Member');
const Booking = require('./models/Booking');

async function restoreAndBackup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get existing users and hotels
    const users = await User.find();
    const hotels = await Hotel.find();
    const members = await Member.find();

    // Create backup first
    const backupData = {
      hotels: hotels,
      users: users,
      members: members,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync('database-backup.json', JSON.stringify(backupData, null, 2));
    console.log('💾 Backup created: database-backup.json');

    // Create sample bookings for existing users
    const sampleBookings = [];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const randomHotel = hotels[Math.floor(Math.random() * hotels.length)];
      
      // Create 2-3 bookings per user
      for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 30) + 1);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + Math.floor(Math.random() * 5) + 1);
        
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const guests = Math.floor(Math.random() * 4) + 1;
        const total = randomHotel.price * nights;

        sampleBookings.push({
          userId: user._id,
          type: 'hotel',
          hotelId: randomHotel._id,
          hotelName: randomHotel.name,
          location: randomHotel.location,
          checkIn: checkIn,
          checkOut: checkOut,
          guests: guests,
          nights: nights,
          price: randomHotel.price,
          total: total,
          guest: {
            name: user.name,
            email: user.email,
            phone: user.phone || '+919876543210'
          },
          bookingType: 'Regular User',
          status: 'confirmed',
          bookingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      }
    }

    // Create bookings for members too
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const exclusiveHotels = hotels.filter(h => h.exclusive);
      const randomHotel = exclusiveHotels.length > 0 ? 
        exclusiveHotels[Math.floor(Math.random() * exclusiveHotels.length)] :
        hotels[Math.floor(Math.random() * hotels.length)];
      
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 30) + 1);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + Math.floor(Math.random() * 7) + 2);
      
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const guests = Math.floor(Math.random() * 4) + 1;
      const total = randomHotel.price * nights * 0.9; // 10% member discount

      sampleBookings.push({
        userId: member._id,
        type: 'hotel',
        hotelId: randomHotel._id,
        hotelName: randomHotel.name,
        location: randomHotel.location,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests,
        nights: nights,
        price: randomHotel.price,
        total: total,
        member: {
          id: member._id,
          name: member.name,
          email: member.email,
          membershipId: member.membershipId,
          tier: member.tier
        },
        guest: {
          name: member.name,
          email: member.email,
          phone: member.phone || '+919876543210'
        },
        bookingType: 'Exclusive Member',
        memberTier: member.tier,
        status: 'confirmed',
        bookingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }

    // Insert bookings
    await Booking.insertMany(sampleBookings);
    console.log(`✅ Created ${sampleBookings.length} bookings`);

    // Create final backup with bookings
    const finalBackup = {
      hotels: await Hotel.find(),
      users: await User.find(),
      members: await Member.find(),
      bookings: await Booking.find(),
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync('complete-database-backup.json', JSON.stringify(finalBackup, null, 2));
    console.log('💾 Complete backup created: complete-database-backup.json');

    console.log('\n🎉 Restoration complete!');
    console.log(`📊 Final counts:`);
    console.log(`Hotels: ${await Hotel.countDocuments()}`);
    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Members: ${await Member.countDocuments()}`);
    console.log(`Bookings: ${await Booking.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restoreAndBackup();