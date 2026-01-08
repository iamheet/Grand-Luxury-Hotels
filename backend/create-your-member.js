const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Member = require('./models/Member');

async function createYourMember() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing members
    const existingMembers = await Member.find();
    console.log('📋 Existing members:');
    existingMembers.forEach(m => {
      console.log(`- ${m.name} | ${m.membershipId} | ${m.email}`);
    });

    // Create the member you're trying to login with
    const hashedPassword = await bcrypt.hash('iycgspwm', 10);
    const yourMember = new Member({
      name: 'Heet Member',
      email: 'heet@exclusive.com',
      password: hashedPassword,
      phone: '+919876543210',
      tier: 'Diamond',
      membershipId: 'DI092133154',
      points: 15000
    });

    await yourMember.save();
    console.log('\n✅ Created your member:');
    console.log('Membership ID: DI092133154');
    console.log('Password: iycgspwm');
    console.log('Tier: Diamond');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createYourMember();