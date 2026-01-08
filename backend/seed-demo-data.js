const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Member = require('./models/Member');
const User = require('./models/User');

async function seedDemoData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create demo exclusive member
    const existingMember = await Member.findOne({ membershipId: 'GRAND2024' });
    if (!existingMember) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      const demoMember = new Member({
        name: 'Demo Member',
        email: 'demo@grandstay.com',
        password: hashedPassword,
        phone: '+1234567890',
        tier: 'Gold',
        membershipId: 'GRAND2024',
        points: 5000
      });
      await demoMember.save();
      console.log('✅ Demo exclusive member created: GRAND2024 / demo123');
    } else {
      console.log('✅ Demo exclusive member already exists');
    }

    // Create demo regular user
    const existingUser = await User.findOne({ email: 'user@demo.com' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      const demoUser = new User({
        name: 'Demo User',
        email: 'user@demo.com',
        password: hashedPassword,
        phone: '+1234567890',
        isMember: false,
        points: 100
      });
      await demoUser.save();
      console.log('✅ Demo regular user created: user@demo.com / demo123');
    } else {
      console.log('✅ Demo regular user already exists');
    }

    console.log('\n🎉 Demo data seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Exclusive Member: GRAND2024 / demo123');
    console.log('Regular User: user@demo.com / demo123');
    console.log('Admin: admin / luxury2024');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedDemoData();