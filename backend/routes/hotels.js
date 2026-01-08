const express = require('express')
const router = express.Router()
const Hotel = require('../models/Hotel')
const { authenticateAdmin } = require('../middleware/auth')

// Clean database - keep only specified hotels (must be before /:id routes)
router.delete('/clean-database', authenticateAdmin, async (req, res) => {
  try {
    // Define the hotel names to keep (26 normal + 22 exclusive)
    const hotelsToKeep = [
      // Normal hotels (25 from seed-normal)
      'Hôtel Étoile Royale', 'Le Jardin Suites', 'Montmartre Inn',
      'The Skyline Tower', 'Hudson Pods',
      'Shinjuku Imperial', 'Ginza Artisan Hotel', 'Asakusa Capsule',
      'Palm Marina Resort', 'Desert Pearl', 'Old Town Lodge',
      'Palazzo Aurelia', 'Via Condotti House', 'Trastevere Rooms',
      'The Fullerton Hotel', 'Orchard Grove', 'Bugis Budget Inn',
      'Kuala Vista Residences', 'Penang Heritage Hotel',
      'Chao Phraya Riverside', 'Old Town Guesthouse', 'Sukhumvit Urban Hotel',
      'Myeongdong Boutique', 'Gangnam Heights', 'Hanok House',
      // Exclusive hotels (22 from seed-exclusive)
      'Grand Palace Resort', 'Royal Mountain Lodge', 'Ocean View Villa', 'Desert Oasis Hotel',
      'Platinum Sky Resort', 'Crystal Bay Sanctuary', 'Aurora Ice Hotel', 'Emerald Forest Lodge',
      'Diamond Crown Palace', 'Royal Safari Lodge', 'Platinum Glacier Resort', 'Golden Temple Retreat',
      'Royal Vineyard Estate', 'Crown Jewel Resort', 'Imperial Castle Hotel', 'Sovereign Island Resort',
      // Hong Kong hotels (6 from seed-exclusive)
      'The Peninsula Hong Kong', 'Mandarin Oriental Hong Kong', 'The Ritz-Carlton Hong Kong',
      'Four Seasons Hotel Hong Kong', 'InterContinental Hong Kong', 'Grand Hyatt Hong Kong'
    ]

    // Delete all hotels NOT in the keep list
    const result = await Hotel.deleteMany({ name: { $nin: hotelsToKeep } })
    res.json({ success: true, message: `Cleaned database: deleted ${result.deletedCount} extra hotels, kept ${hotelsToKeep.length} specified hotels` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update hotel credentials by location
router.put('/update-credentials', authenticateAdmin, async (req, res) => {
  try {
    // Update Dubai hotels (including Desert Oasis Hotel exclusive)
    await Hotel.updateMany(
      { location: 'Dubai' },
      { email: 'dubai@gmail.com', password: 'dubai1234' }
    )
    
    // Update Hong Kong hotels
    await Hotel.updateMany(
      { location: 'Hong Kong' },
      { email: 'hongkong@gmail.com', password: 'hongkong1234' }
    )
    
    res.json({ success: true, message: 'Updated Dubai and Hong Kong hotel credentials successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Remove duplicate hotels
router.delete('/remove-duplicates', authenticateAdmin, async (req, res) => {
  try {
    const duplicates = await Hotel.aggregate([
      { $group: { _id: '$name', ids: { $push: '$_id' }, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ])
    
    let deletedCount = 0
    for (const duplicate of duplicates) {
      // Keep first, delete rest
      const idsToDelete = duplicate.ids.slice(1)
      await Hotel.deleteMany({ _id: { $in: idsToDelete } })
      deletedCount += idsToDelete.length
    }
    
    res.json({ success: true, message: `Removed ${deletedCount} duplicate hotels` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find()
    res.json({ success: true, hotels })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Frontend API - Get hotels for booking
router.get('/frontend', async (req, res) => {
  try {
    const hotels = await Hotel.find().select('name location price image rating exclusive')
    res.json(hotels)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Frontend API - Get exclusive hotels only
router.get('/frontend/exclusive', async (req, res) => {
  try {
    const hotels = await Hotel.find({ exclusive: true }).select('name location price image rating exclusive')
    res.json(hotels)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get normal hotels only (non-exclusive)
router.get('/normal', async (req, res) => {
  try {
    const hotels = await Hotel.find({ exclusive: { $ne: true } })
    res.json({ success: true, hotels })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Add new hotel
router.post('/', async (req, res) => {
  try {
    const hotel = new Hotel(req.body)
    await hotel.save()
    res.json({ success: true, hotel })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Update hotel
router.put('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' })
    }
    res.json({ success: true, hotel })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Delete hotel
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id)
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' })
    }
    res.json({ success: true, message: 'Hotel deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Seed default hotels
router.post('/seed', async (req, res) => {
  try {
    const existingHotels = await Hotel.countDocuments()
    if (existingHotels > 0) {
      return res.json({ success: false, message: 'Hotels already exist' })
    }

    const defaultHotels = [
      // Original 6 hotels
      { name: 'Hôtel Étoile Royale', location: 'Paris', price: 520, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
      { name: 'Le Jardin Suites', location: 'Paris', price: 360, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/549415122.jpg?k=6aa38e1d6d970b5756c6e0bd4297a603ce8618ffec17a5e8c2332ac20ab1bc2e&o=', rating: 4, exclusive: false },
      { name: 'The Skyline Tower', location: 'New York', price: 480, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763346606.jpg?k=6ec8469c977fbd5e6867bd1da4f454db5914ccf5c962cd9b9ae74a5c2c766ca4&o=', rating: 5, exclusive: false },
      { name: 'Shinjuku Imperial', location: 'Tokyo', price: 450, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082763.jpg?k=1e0efd2d22e212697c98ff09502775672c39f4b38dc54b729c3a76f800173d12&o=', rating: 5, exclusive: false },
      { name: 'Palm Marina Resort', location: 'Dubai', price: 530, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/727476358.jpg?k=aec126bb04f23b6b833361fd74d87bd9512216d5bc27827f96554dbe59602a31&o=', rating: 5, exclusive: false },
      { name: 'Palazzo Aurelia', location: 'Rome', price: 400, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
      
      // Additional 20 hotels
      { name: 'The Ritz Carlton', location: 'London', price: 650, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
      { name: 'Grand Hyatt', location: 'Singapore', price: 420, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
      { name: 'Four Seasons', location: 'Sydney', price: 580, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
      { name: 'Mandarin Oriental', location: 'Hong Kong', price: 490, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
      { name: 'The Peninsula', location: 'Bangkok', price: 380, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'St. Regis', location: 'Mumbai', price: 320, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
      { name: 'The Westin', location: 'Berlin', price: 340, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'Conrad Hotels', location: 'Istanbul', price: 290, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'Shangri-La', location: 'Kuala Lumpur', price: 280, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
      { name: 'InterContinental', location: 'Cairo', price: 250, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'Marriott Executive', location: 'Seoul', price: 370, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'Hilton Garden Inn', location: 'Toronto', price: 310, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'Sheraton Grand', location: 'Edinburgh', price: 390, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'Radisson Blu', location: 'Stockholm', price: 350, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'Crowne Plaza', location: 'Amsterdam', price: 330, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'DoubleTree by Hilton', location: 'Vienna', price: 300, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'Novotel', location: 'Brussels', price: 270, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'Pullman Hotels', location: 'Barcelona', price: 410, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false },
      { name: 'Sofitel', location: 'Lyon', price: 380, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
      { name: 'Fairmont Hotels', location: 'Vancouver', price: 450, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false }
    ]

    await Hotel.insertMany(defaultHotels)
    res.json({ success: true, message: 'All 26 hotels seeded successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Seed all normal hotels
router.post('/seed-normal', async (req, res) => {
  try {
    const normalHotels = [
      // Paris hotels
      { name: 'Hôtel Étoile Royale', location: 'Paris', price: 520, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false, email: 'paris@gmail.com', password: 'paris1234' },
      { name: 'Le Jardin Suites', location: 'Paris', price: 360, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/549415122.jpg?k=6aa38e1d6d970b5756c6e0bd4297a603ce8618ffec17a5e8c2332ac20ab1bc2e&o=', rating: 4, exclusive: false, email: 'paris@gmail.com', password: 'paris1234' },
      { name: 'Montmartre Inn', location: 'Paris', price: 280, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false, email: 'paris@gmail.com', password: 'paris1234' },
      
      // New York hotels
      { name: 'The Skyline Tower', location: 'New York', price: 480, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763346606.jpg?k=6ec8469c977fbd5e6867bd1da4f454db5914ccf5c962cd9b9ae74a5c2c766ca4&o=', rating: 5, exclusive: false, email: 'newyork@gmail.com', password: 'newyork1234' },
      { name: 'Hudson Pods', location: 'New York', price: 320, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false, email: 'newyork@gmail.com', password: 'newyork1234' },
      
      // Tokyo hotels
      { name: 'Shinjuku Imperial', location: 'Tokyo', price: 450, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082763.jpg?k=1e0efd2d22e212697c98ff09502775672c39f4b38dc54b729c3a76f800173d12&o=', rating: 5, exclusive: false, email: 'tokyo@gmail.com', password: 'tokyo1234' },
      { name: 'Ginza Artisan Hotel', location: 'Tokyo', price: 380, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false, email: 'tokyo@gmail.com', password: 'tokyo1234' },
      { name: 'Asakusa Capsule', location: 'Tokyo', price: 180, image: 'https://cf.bstatic.com/xdata/images/hotel/max500/97986399.jpg?k=cd109a8cb120efa5414c04f2f64bbaf0168431f2f78d79f4e4b3026f50c1852a&o=', rating: 4, exclusive: false, email: 'tokyo@gmail.com', password: 'tokyo1234' },
      
      // Dubai hotels
      { name: 'Palm Marina Resort', location: 'Dubai', price: 530, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/727476358.jpg?k=aec126bb04f23b6b833361fd74d87bd9512216d5bc27827f96554dbe59602a31&o=', rating: 5, exclusive: false, email: 'dubai@gmail.com', password: 'dubai1234' },
      { name: 'Desert Pearl', location: 'Dubai', price: 420, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/402062213.jpg?k=b210cfef3e9c3450e72a0c21675110a1b62f2f2174a276eb8c2762a99a5cd61d&o=', rating: 4, exclusive: false, email: 'dubai@gmail.com', password: 'dubai1234' },
      { name: 'Old Town Lodge', location: 'Dubai', price: 350, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false, email: 'dubai@gmail.com', password: 'dubai1234' },
      
      // Rome hotels
      { name: 'Palazzo Aurelia', location: 'Rome', price: 400, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false, email: 'rome@gmail.com', password: 'rome1234' },
      { name: 'Via Condotti House', location: 'Rome', price: 350, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false, email: 'rome@gmail.com', password: 'rome1234' },
      { name: 'Trastevere Rooms', location: 'Rome', price: 280, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false, email: 'rome@gmail.com', password: 'rome1234' },
      
      // Singapore hotels
      { name: 'The Fullerton Hotel', location: 'Singapore', price: 420, image: 'https://cf.bstatic.com/xdata/images/hotel/max300/281047348.jpg?k=16b2802339249d3978326b7f570026ae77af5ff78716646a46b6dbabdbc5ffcc&o=', rating: 5, exclusive: false, email: 'singapore@gmail.com', password: 'singapore1234' },
      { name: 'Orchard Grove', location: 'Singapore', price: 320, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false, email: 'singapore@gmail.com', password: 'singapore1234' },
      { name: 'Bugis Budget Inn', location: 'Singapore', price: 180, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false, email: 'singapore@gmail.com', password: 'singapore1234' },
      
      // Malaysia hotels
      { name: 'Kuala Vista Residences', location: 'Malaysia', price: 280, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/604095272.jpg?k=27eaf1958876c206e4284916e2655a042b9d79269204d4e5d24221a885f64a7b&o=', rating: 4, exclusive: false, email: 'malaysia@gmail.com', password: 'malaysia1234' },
      { name: 'Penang Heritage Hotel', location: 'Malaysia', price: 220, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false, email: 'malaysia@gmail.com', password: 'malaysia1234' },
      
      // Bangkok hotels
      { name: 'Chao Phraya Riverside', location: 'Bangkok', price: 380, image: 'https://cf.bstatic.com/xdata/images/hotel/max300/350599279.jpg?k=a5e491a7f969edd33907623ed53a6fe0ec67e5761664cbbdeffc1fbd436d36d0&o=', rating: 4, exclusive: false, email: 'bangkok@gmail.com', password: 'bangkok1234' },
      { name: 'Old Town Guesthouse', location: 'Bangkok', price: 150, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false, email: 'bangkok@gmail.com', password: 'bangkok1234' },
      { name: 'Sukhumvit Urban Hotel', location: 'Bangkok', price: 250, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false, email: 'bangkok@gmail.com', password: 'bangkok1234' },
      
      // Seoul hotels
      { name: 'Myeongdong Boutique', location: 'Seoul', price: 370, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/590904787.jpg?k=fc3a055117b45594091f5f59304fd450ed806a55a265d9c5917eecd7e7175695&o=', rating: 4, exclusive: false, email: 'seoul@gmail.com', password: 'seoul1234' },
      { name: 'Gangnam Heights', location: 'Seoul', price: 450, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false, email: 'seoul@gmail.com', password: 'seoul1234' },
      { name: 'Hanok House', location: 'Seoul', price: 200, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=400&auto=format&fit=crop', rating: 4, exclusive: false, email: 'seoul@gmail.com', password: 'seoul1234' }
    ]

    await Hotel.insertMany(normalHotels)
    res.json({ success: true, message: `Successfully added ${normalHotels.length} normal hotels` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Seed exclusive member hotels
router.post('/seed-exclusive', async (req, res) => {
  try {
    // Exclusive member hotels
    const exclusiveHotels = [
      { name: 'Grand Palace Resort', location: 'Maldives', price: 850, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', rating: 4.9, exclusive: true, email: 'admin@grandpalace.mv', password: 'exclusive123' },
      { name: 'Royal Mountain Lodge', location: 'Swiss Alps', price: 720, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', rating: 4.8, exclusive: true, email: 'admin@royalmountain.ch', password: 'exclusive123' },
      { name: 'Ocean View Villa', location: 'Santorini', price: 650, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', rating: 4.7, exclusive: true, email: 'admin@oceanview.gr', password: 'exclusive123' },
      { name: 'Desert Oasis Hotel', location: 'Dubai', price: 580, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', rating: 4.6, exclusive: true, email: 'admin@desertoasis.ae', password: 'exclusive123' },
      { name: 'Platinum Sky Resort', location: 'Bora Bora', price: 950, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', rating: 5.0, exclusive: true, email: 'admin@platinumsky.pf', password: 'exclusive123' },
      { name: 'Crystal Bay Sanctuary', location: 'Seychelles', price: 780, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', rating: 4.9, exclusive: true, email: 'admin@crystalbay.sc', password: 'exclusive123' },
      { name: 'Aurora Ice Hotel', location: 'Iceland', price: 680, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', rating: 4.8, exclusive: true, email: 'admin@auroraice.is', password: 'exclusive123' },
      { name: 'Emerald Forest Lodge', location: 'Costa Rica', price: 620, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', rating: 4.7, exclusive: true, email: 'admin@emeraldforest.cr', password: 'exclusive123' },
      { name: 'Diamond Crown Palace', location: 'Monaco', price: 1200, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400', rating: 5.0, exclusive: true, email: 'admin@diamondcrown.mc', password: 'exclusive123' },
      { name: 'Royal Safari Lodge', location: 'Kenya', price: 890, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400', rating: 4.9, exclusive: true, email: 'admin@royalsafari.ke', password: 'exclusive123' },
      { name: 'Platinum Glacier Resort', location: 'Antarctica', price: 1500, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', rating: 5.0, exclusive: true, email: 'admin@platinumglacier.aq', password: 'exclusive123' },
      { name: 'Golden Temple Retreat', location: 'Bhutan', price: 750, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', rating: 4.8, exclusive: true, email: 'admin@goldentemple.bt', password: 'exclusive123' },
      { name: 'Royal Vineyard Estate', location: 'Tuscany', price: 820, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', rating: 4.9, exclusive: true, email: 'admin@royalvineyard.it', password: 'exclusive123' },
      { name: 'Crown Jewel Resort', location: 'Fiji', price: 980, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', rating: 4.9, exclusive: true, email: 'admin@crownjewel.fj', password: 'exclusive123' },
      { name: 'Imperial Castle Hotel', location: 'Scotland', price: 690, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', rating: 4.8, exclusive: true, email: 'admin@imperialcastle.uk', password: 'exclusive123' },
      { name: 'Sovereign Island Resort', location: 'Bahamas', price: 1100, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', rating: 5.0, exclusive: true, email: 'admin@sovereignisland.bs', password: 'exclusive123' }
    ]

    // Hong Kong hotels
    const hongKongHotels = [
      { name: 'The Peninsula Hong Kong', location: 'Hong Kong', price: 580, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/106988145.jpg?k=4dc750be5829df9afb3485ee7555b8d4697c151d3a403062908c4a5a1fd87112&o=', rating: 5, exclusive: false, email: 'admin@peninsula.hk', password: 'hongkong123' },
      { name: 'Mandarin Oriental Hong Kong', location: 'Hong Kong', price: 520, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/721154462.jpg?k=12932700b7c14aaeb157ec0bf77bbb0cf9cfac9f88c4fdb93100a16b91b31196&o=', rating: 5, exclusive: false, email: 'admin@mandarinoriental.hk', password: 'hongkong123' },
      { name: 'The Ritz-Carlton Hong Kong', location: 'Hong Kong', price: 650, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/225664341.jpg?k=0f8d1d1cce6e784a6c9589e46a112f9f2193c96867c2e44dcac670ccd7b7d6c2&o=', rating: 5, exclusive: false, email: 'admin@ritzcarlton.hk', password: 'hongkong123' },
      { name: 'Four Seasons Hotel Hong Kong', location: 'Hong Kong', price: 600, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763709548.jpg?k=8f4711a661ffe9156cc27298b7972526f7c2638ec9aab6d4cbc5a2c9fd6390c2&o=', rating: 5, exclusive: false, email: 'admin@fourseasons.hk', password: 'hongkong123' },
      { name: 'InterContinental Hong Kong', location: 'Hong Kong', price: 480, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/409143054.jpg?k=2e65ea2a4bd321768e91741df75162d8ae60256c808a36fd1521c53ebe79ab89&o=', rating: 5, exclusive: false, email: 'admin@intercontinental.hk', password: 'hongkong123' },
      { name: 'Grand Hyatt Hong Kong', location: 'Hong Kong', price: 450, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/593370627.jpg?k=c91650aace08fef98582558db6adb9a1332327278c3727ee89b59fa41cb4dde5&o=', rating: 5, exclusive: false, email: 'admin@grandhyatt.hk', password: 'hongkong123' }
    ]

    const allHotels = [...exclusiveHotels, ...hongKongHotels]
    
    // Insert hotels
    const insertedHotels = await Hotel.insertMany(allHotels)
    
    res.json({
      success: true,
      message: `Successfully seeded ${insertedHotels.length} exclusive and Hong Kong hotels`,
      hotels: insertedHotels
    })
  } catch (error) {
    console.error('Error seeding exclusive hotels:', error)
    res.status(500).json({ success: false, message: 'Error seeding exclusive hotels', error: error.message })
  }
})

module.exports = router