const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], default: 'Bronze' },
  membershipId: { type: String, unique: true },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);

async function createMember() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const member = new Member({
      name: 'Demo Member',
      email: 'demo@grandstay.com',
      password: hashedPassword,
      phone: '+1234567890',
      tier: 'Platinum',
      membershipId: 'GRAND2024',
      points: 5000
    });

    await member.save();
    console.log('Member created successfully!');
    console.log('Membership ID: GRAND2024');
    console.log('Password: password123');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
}

createMember();
