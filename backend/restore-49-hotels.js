const mongoose = require('mongoose');
require('dotenv').config();

const Hotel = require('./models/Hotel');

const hotels = [
  { name: 'The Grand Palace', location: 'Mumbai', price: 8000, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', rating: 4.8, exclusive: false },
  { name: 'Luxury Resort', location: 'Goa', price: 12000, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9', rating: 4.9, exclusive: true },
  { name: 'Mountain View Hotel', location: 'Shimla', price: 6000, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', rating: 4.6, exclusive: false },
  { name: 'Beach Paradise', location: 'Kerala', price: 9500, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', rating: 4.7, exclusive: true },
  { name: 'City Center Hotel', location: 'Delhi', price: 7500, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791', rating: 4.5, exclusive: false },
  { name: 'Royal Heritage', location: 'Rajasthan', price: 15000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', rating: 4.9, exclusive: true },
  { name: 'Coastal Retreat', location: 'Chennai', price: 8500, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', rating: 4.6, exclusive: false },
  { name: 'Hill Station Lodge', location: 'Manali', price: 5500, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', rating: 4.4, exclusive: false },
  { name: 'Business Hub', location: 'Bangalore', price: 7000, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', rating: 4.3, exclusive: false },
  { name: 'Garden Resort', location: 'Pune', price: 6500, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', rating: 4.5, exclusive: false },
  { name: 'Lake View Hotel', location: 'Udaipur', price: 11000, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6', rating: 4.8, exclusive: true },
  { name: 'Desert Oasis', location: 'Jaisalmer', price: 9000, image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b', rating: 4.7, exclusive: false },
  { name: 'Riverside Resort', location: 'Rishikesh', price: 4500, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', rating: 4.2, exclusive: false },
  { name: 'Metropolitan', location: 'Kolkata', price: 6800, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', rating: 4.4, exclusive: false },
  { name: 'Backwater Villa', location: 'Alleppey', price: 8800, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9', rating: 4.6, exclusive: true },
  { name: 'Tech Park Hotel', location: 'Hyderabad', price: 7200, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', rating: 4.3, exclusive: false },
  { name: 'Cultural Heritage', location: 'Varanasi', price: 5800, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', rating: 4.5, exclusive: false },
  { name: 'Wine Country Resort', location: 'Nashik', price: 7800, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791', rating: 4.4, exclusive: false },
  { name: 'Himalayan Retreat', location: 'Dharamshala', price: 6200, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', rating: 4.6, exclusive: false },
  { name: 'Spice Garden Hotel', location: 'Kochi', price: 7600, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', rating: 4.5, exclusive: false },
  { name: 'Golden Temple Lodge', location: 'Amritsar', price: 5200, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', rating: 4.3, exclusive: false },
  { name: 'IT Hub Hotel', location: 'Noida', price: 6900, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', rating: 4.2, exclusive: false },
  { name: 'Textile City Inn', location: 'Coimbatore', price: 5900, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', rating: 4.1, exclusive: false },
  { name: 'Pink City Palace', location: 'Jaipur', price: 10500, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6', rating: 4.8, exclusive: true },
  { name: 'Diamond Harbor', location: 'Surat', price: 6400, image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b', rating: 4.2, exclusive: false },
  { name: 'Steel City Hotel', location: 'Jamshedpur', price: 5600, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', rating: 4.0, exclusive: false },
  { name: 'Port City Resort', location: 'Visakhapatnam', price: 7100, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', rating: 4.3, exclusive: false },
  { name: 'Gateway Hotel', location: 'Ahmedabad', price: 6700, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9', rating: 4.4, exclusive: false },
  { name: 'Valley Resort', location: 'Dehradun', price: 5800, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', rating: 4.2, exclusive: false },
  { name: 'Coastal Paradise', location: 'Mangalore', price: 6800, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', rating: 4.3, exclusive: false },
  { name: 'Temple Town Lodge', location: 'Madurai', price: 5400, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791', rating: 4.1, exclusive: false },
  { name: 'Cyber City Hotel', location: 'Gurgaon', price: 8200, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', rating: 4.5, exclusive: false },
  { name: 'Jewel City Inn', location: 'Thrissur', price: 6100, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', rating: 4.2, exclusive: false },
  { name: 'Silk Route Hotel', location: 'Gangtok', price: 7300, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', rating: 4.6, exclusive: false },
  { name: 'Orange City Resort', location: 'Nagpur', price: 6000, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', rating: 4.1, exclusive: false },
  { name: 'Pharma Hub Hotel', location: 'Baddi', price: 5300, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', rating: 4.0, exclusive: false },
  { name: 'Tribal Heritage Lodge', location: 'Shillong', price: 5700, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6', rating: 4.3, exclusive: false },
  { name: 'Sunrise Resort', location: 'Puri', price: 6300, image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b', rating: 4.2, exclusive: false },
  { name: 'Monsoon Retreat', location: 'Lonavala', price: 7400, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', rating: 4.4, exclusive: false },
  { name: 'Capital Heights', location: 'Bhopal', price: 5900, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', rating: 4.1, exclusive: false },
  { name: 'Emerald Isle Resort', location: 'Andaman', price: 13500, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9', rating: 4.9, exclusive: true },
  { name: 'Snow Peak Lodge', location: 'Auli', price: 8900, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', rating: 4.7, exclusive: false },
  { name: 'Lagoon Resort', location: 'Lakshadweep', price: 16000, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', rating: 4.9, exclusive: true },
  { name: 'Vintage Palace', location: 'Mysore', price: 8100, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791', rating: 4.6, exclusive: false },
  { name: 'Wellness Retreat', location: 'Pondicherry', price: 7700, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', rating: 4.5, exclusive: false },
  { name: 'Tribal Village Resort', location: 'Kohima', price: 6500, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', rating: 4.3, exclusive: false },
  { name: 'Bamboo Grove Lodge', location: 'Imphal', price: 5500, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', rating: 4.1, exclusive: false },
  { name: 'Orchid Resort', location: 'Aizawl', price: 6200, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', rating: 4.2, exclusive: false },
  { name: 'Sunset Paradise', location: 'Daman', price: 7800, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', rating: 4.4, exclusive: false }
];

async function restore49Hotels() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Hotel.deleteMany({});
    console.log('🗑️ Cleared existing hotels');

    await Hotel.insertMany(hotels);
    console.log(`✅ Successfully restored ${hotels.length} hotels!`);

    const count = await Hotel.countDocuments();
    console.log(`📊 Total hotels in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restore49Hotels();