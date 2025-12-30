const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['hotel', 'aircraft', 'car', 'travel', 'dining', 'entertainment', 'chef', 'wine', 'ticket', 'event', 'business', 'combined'], default: 'hotel' },
  services: [mongoose.Schema.Types.Mixed],
  room: mongoose.Schema.Types.Mixed,
  aircraft: mongoose.Schema.Types.Mixed,
  car: mongoose.Schema.Types.Mixed,
  travel: mongoose.Schema.Types.Mixed,
  hotelId: String,
  hotelName: String,
  location: String,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  nights: Number,
  price: Number,
  total: Number,
  hotelTotal: Number,
  aircraftTotal: Number,
  carTotal: Number,
  travelTotal: Number,
  diningTotal: Number,
  entertainmentTotal: Number,
  chefTotal: Number,
  wineTotal: Number,
  ticketTotal: Number,
  eventTotal: Number,
  member: mongoose.Schema.Types.Mixed,
  guest: {
    name: String,
    email: String,
    phone: String
  },
  bookingType: { type: String, enum: ['Regular User', 'Exclusive Member'], default: 'Regular User' },
  memberTier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'] },
  status: { type: String, default: 'confirmed' },
  bookingDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
