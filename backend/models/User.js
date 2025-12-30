const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  firebaseUid: { type: String, unique: true, sparse: true },
  // Membership fields
  isMember: { type: Boolean, default: false },
  membershipTier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], default: null },
  membershipId: { type: String, unique: true, sparse: true },
  points: { type: Number, default: 0 },
  membershipDate: { type: Date },
  // Password reset fields
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
