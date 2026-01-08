const mongoose = require('mongoose');

const subAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  permissions: {
    viewUsers: { type: Boolean, default: true },
    viewBookings: { type: Boolean, default: true },
    viewRevenue: { type: Boolean, default: false },
    manageHotels: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, default: 'super-admin' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubAdmin', subAdminSchema);
