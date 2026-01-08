const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Hotel = require('./models/Hotel');
const User = require('./models/User');
const Member = require('./models/Member');
const Booking = require('./models/Booking');

async function restoreFromBackup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Read backup file
    const backupData = JSON.parse(fs.readFileSync('complete-database-backup.json', 'utf8'));
    console.log('📁 Backup file loaded');

    // Clear existing data
    await Hotel.deleteMany({});
    await User.deleteMany({});
    await Member.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Restore your genuine users
    const genuineUsers = backupData.users.map(user => ({
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      firebaseUid: user.firebaseUid,
      isMember: user.isMember,
      membershipTier: user.membershipTier,
      points: user.points,
      createdAt: user.createdAt
    }));

    await User.insertMany(genuineUsers);
    console.log(`✅ Restored ${genuineUsers.length} genuine users`);

    // Restore your genuine members
    const genuineMembers = backupData.members.map(member => ({
      name: member.name,
      email: member.email,
      password: member.password,
      phone: member.phone,
      tier: member.tier,
      membershipId: member.membershipId,
      points: member.points,
      createdAt: member.createdAt
    }));

    await Member.insertMany(genuineMembers);
    console.log(`✅ Restored ${genuineMembers.length} genuine members`);

    // Restore your genuine bookings with updated user IDs
    const newUsers = await User.find();
    const newMembers = await Member.find();
    
    const userIdMap = {};
    const memberIdMap = {};
    
    // Create mapping from old IDs to new IDs
    backupData.users.forEach((oldUser, index) => {
      userIdMap[oldUser._id] = newUsers.find(u => u.email === oldUser.email)?._id;
    });
    
    backupData.members.forEach((oldMember, index) => {
      memberIdMap[oldMember._id] = newMembers.find(m => m.email === oldMember.email)?._id;
    });

    const genuineBookings = backupData.bookings.map(booking => {
      const newUserId = userIdMap[booking.userId] || memberIdMap[booking.userId];
      return {
        userId: newUserId,
        type: booking.type,
        services: booking.services || [],
        hotelId: booking.hotelId,
        hotelName: booking.hotelName,
        location: booking.location,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        nights: booking.nights,
        price: booking.price,
        total: booking.total,
        guest: booking.guest,
        member: booking.member,
        bookingType: booking.bookingType,
        memberTier: booking.memberTier,
        status: booking.status,
        bookingDate: booking.bookingDate,
        createdAt: booking.createdAt
      };
    }).filter(booking => booking.userId); // Only include bookings with valid user IDs

    await Booking.insertMany(genuineBookings);
    console.log(`✅ Restored ${genuineBookings.length} genuine bookings`);

    console.log('\n🎉 Your genuine data has been restored!');
    console.log('📊 Restored Data Summary:');
    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Members: ${await Member.countDocuments()}`);
    console.log(`Hotels: ${await Hotel.countDocuments()}`);
    console.log(`Bookings: ${await Booking.countDocuments()}`);

    console.log('\n🔑 Your Original Credentials:');
    console.log('Heet Chokshi: iamheetchokshi@gmail.com (Firebase auth)');
    console.log('Ram Kovind: ramkovind888@gmail.com (Firebase auth)');
    console.log('VIP Member: PLAT001 / vip123');
    console.log('Gold Member: GOLD001 / gold123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restoreFromBackup();