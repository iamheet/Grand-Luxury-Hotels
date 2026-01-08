const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Member = require('./models/Member');
const Booking = require('./models/Booking');
const Hotel = require('./models/Hotel');

async function restoreUsersAndBookings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Member.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️ Cleared existing users, members, and bookings');

    // Create realistic user base (50 users)
    const users = [];
    const userNames = [
      'Heet Chokshi', 'Ram Kovind', 'Priya Sharma', 'Arjun Patel', 'Sneha Gupta',
      'Vikram Singh', 'Anita Desai', 'Rohit Kumar', 'Kavya Nair', 'Aditya Joshi',
      'Meera Reddy', 'Sanjay Mehta', 'Pooja Agarwal', 'Rahul Verma', 'Divya Shah',
      'Karan Malhotra', 'Ritu Bansal', 'Amit Saxena', 'Neha Kapoor', 'Varun Chopra',
      'Shreya Iyer', 'Manish Tiwari', 'Deepika Rao', 'Nikhil Pandey', 'Swati Jain',
      'Harsh Goyal', 'Nisha Sinha', 'Rajesh Bhatt', 'Kritika Arora', 'Suresh Yadav',
      'Anjali Mishra', 'Gaurav Khanna', 'Preeti Dubey', 'Akash Sharma', 'Riya Gupta',
      'Vishal Kumar', 'Tanvi Patel', 'Mohit Agarwal', 'Sakshi Verma', 'Abhishek Singh',
      'Pallavi Nair', 'Rohan Joshi', 'Simran Kaur', 'Aryan Mehta', 'Ishita Bansal',
      'Kunal Saxena', 'Aditi Kapoor', 'Siddharth Chopra', 'Natasha Iyer', 'Yash Tiwari'
    ];

    for (let i = 0; i < userNames.length; i++) {
      const name = userNames[i];
      const email = name.toLowerCase().replace(' ', '') + '@gmail.com';
      const hashedPassword = await bcrypt.hash('user123', 10);
      
      users.push({
        name,
        email,
        password: hashedPassword,
        phone: `+91${9000000000 + i}`,
        isMember: Math.random() > 0.7, // 30% are members
        membershipTier: Math.random() > 0.7 ? ['Silver', 'Gold'][Math.floor(Math.random() * 2)] : null,
        points: Math.floor(Math.random() * 5000),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random date within last year
      });
    }

    const insertedUsers = await User.insertMany(users);
    console.log(`✅ Created ${insertedUsers.length} users`);

    // Create exclusive members (20 members)
    const members = [];
    const memberNames = [
      'Rajesh Ambani', 'Sunita Tata', 'Vikash Birla', 'Kavita Jindal', 'Arun Mittal',
      'Deepika Agarwal', 'Sunil Bajaj', 'Priya Mahindra', 'Rohit Godrej', 'Anita Piramal',
      'Karan Oberoi', 'Meera Singhania', 'Varun Goenka', 'Shreya Ruia', 'Amit Dalmia',
      'Neha Burman', 'Sanjay Lohia', 'Ritu Khemka', 'Manish Kothari', 'Divya Poddar'
    ];

    const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

    for (let i = 0; i < memberNames.length; i++) {
      const name = memberNames[i];
      const email = name.toLowerCase().replace(' ', '') + '@exclusive.com';
      const hashedPassword = await bcrypt.hash('member123', 10);
      const tier = tiers[Math.floor(Math.random() * tiers.length)];
      
      members.push({
        name,
        email,
        password: hashedPassword,
        phone: `+91${8000000000 + i}`,
        tier,
        membershipId: `GRAND${String(i + 1).padStart(3, '0')}`,
        points: Math.floor(Math.random() * 20000) + 5000, // 5k-25k points
        createdAt: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000) // Random date within last 2 years
      });
    }

    const insertedMembers = await Member.insertMany(members);
    console.log(`✅ Created ${insertedMembers.length} exclusive members`);

    // Get all hotels for bookings
    const hotels = await Hotel.find();
    const normalHotels = hotels.filter(h => !h.exclusive);
    const exclusiveHotels = hotels.filter(h => h.exclusive);

    // Create realistic bookings (150 bookings)
    const bookings = [];

    // User bookings (100 bookings)
    for (let i = 0; i < 100; i++) {
      const user = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
      const hotel = normalHotels[Math.floor(Math.random() * normalHotels.length)];
      
      const bookingDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000); // Last 6 months
      const checkIn = new Date(bookingDate.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000); // Within 2 months
      const nights = Math.floor(Math.random() * 7) + 1;
      const checkOut = new Date(checkIn.getTime() + nights * 24 * 60 * 60 * 1000);
      const guests = Math.floor(Math.random() * 4) + 1;
      const total = hotel.price * nights;

      bookings.push({
        userId: user._id,
        type: 'hotel',
        hotelId: hotel._id,
        hotelName: hotel.name,
        location: hotel.location,
        checkIn,
        checkOut,
        guests,
        nights,
        price: hotel.price,
        total,
        guest: {
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        bookingType: 'Regular User',
        status: ['confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
        bookingDate,
        createdAt: bookingDate
      });
    }

    // Member bookings (50 bookings)
    for (let i = 0; i < 50; i++) {
      const member = insertedMembers[Math.floor(Math.random() * insertedMembers.length)];
      const hotel = Math.random() > 0.3 ? 
        exclusiveHotels[Math.floor(Math.random() * exclusiveHotels.length)] :
        normalHotels[Math.floor(Math.random() * normalHotels.length)];
      
      const bookingDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
      const checkIn = new Date(bookingDate.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000);
      const nights = Math.floor(Math.random() * 10) + 2; // Members stay longer
      const checkOut = new Date(checkIn.getTime() + nights * 24 * 60 * 60 * 1000);
      const guests = Math.floor(Math.random() * 6) + 1;
      const baseTotal = hotel.price * nights;
      const discount = member.tier === 'Diamond' ? 0.8 : member.tier === 'Platinum' ? 0.85 : 0.9;
      const total = Math.floor(baseTotal * discount);

      bookings.push({
        userId: member._id,
        type: 'hotel',
        hotelId: hotel._id,
        hotelName: hotel.name,
        location: hotel.location,
        checkIn,
        checkOut,
        guests,
        nights,
        price: hotel.price,
        total,
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
          phone: member.phone
        },
        bookingType: 'Exclusive Member',
        memberTier: member.tier,
        status: ['confirmed', 'completed'][Math.floor(Math.random() * 2)], // Members rarely cancel
        bookingDate,
        createdAt: bookingDate
      });
    }

    const insertedBookings = await Booking.insertMany(bookings);
    console.log(`✅ Created ${insertedBookings.length} bookings`);

    // Final summary
    console.log('\n🎉 Complete restoration finished!');
    console.log('📊 Final Database Summary:');
    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Members: ${await Member.countDocuments()}`);
    console.log(`Hotels: ${await Hotel.countDocuments()}`);
    console.log(`Bookings: ${await Booking.countDocuments()}`);

    console.log('\n🔑 Test Credentials:');
    console.log('Regular Users: heetchokshi@gmail.com / user123');
    console.log('Regular Users: ramkovind@gmail.com / user123');
    console.log('Exclusive Members: GRAND001 / member123');
    console.log('Exclusive Members: GRAND002 / member123');
    console.log('Admin: admin / luxury2024');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restoreUsersAndBookings();