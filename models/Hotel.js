const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  exclusive: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Hotel', hotelSchema)