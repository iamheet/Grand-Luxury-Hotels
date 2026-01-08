const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Member = require('./models/Member');

async function createTestMember() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing members
    const existingMembers = await Member.find();
    console.log('📋 Existing members:', existingMembers.map(m => `${m.name} (${m.membershipId})`));

    // Create a test member
    const hashedPassword = await bcrypt.hash('test123', 10);
    const testMember = new Member({
      name: 'Test Member',
      email: 'test@exclusive.com',
      password: hashedPassword,
      phone: '+919876543210',
      tier: 'Gold',
      membershipId: 'TEST001',
      points: 5000
    });

    await testMember.save();
    console.log('✅ Created test member: TEST001 / test123');

    console.log('\n🔑 Test Credentials:');
    console.log('Membership ID: TEST001');
    console.log('Password: test123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestMember();