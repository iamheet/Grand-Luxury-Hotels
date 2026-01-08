const mongoose = require('mongoose');
require('dotenv').config();

const Hotel = require('./models/Hotel');

async function restoreProperHotels() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing hotels
    await Hotel.deleteMany({});
    console.log('🗑️ Cleared existing hotels');

    // 25 Normal Hotels
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
    ];

    // 22 Exclusive Hotels
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
      { name: 'Sovereign Island Resort', location: 'Bahamas', price: 1100, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', rating: 5.0, exclusive: true, email: 'admin@sovereignisland.bs', password: 'exclusive123' },
      
      // Hong Kong hotels (6 exclusive)
      { name: 'The Peninsula Hong Kong', location: 'Hong Kong', price: 580, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/106988145.jpg?k=4dc750be5829df9afb3485ee7555b8d4697c151d3a403062908c4a5a1fd87112&o=', rating: 5, exclusive: true, email: 'admin@peninsula.hk', password: 'hongkong123' },
      { name: 'Mandarin Oriental Hong Kong', location: 'Hong Kong', price: 520, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/721154462.jpg?k=12932700b7c14aaeb157ec0bf77bbb0cf9cfac9f88c4fdb93100a16b91b31196&o=', rating: 5, exclusive: true, email: 'admin@mandarinoriental.hk', password: 'hongkong123' },
      { name: 'The Ritz-Carlton Hong Kong', location: 'Hong Kong', price: 650, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/225664341.jpg?k=0f8d1d1cce6e784a6c9589e46a112f9f2193c96867c2e44dcac670ccd7b7d6c2&o=', rating: 5, exclusive: true, email: 'admin@ritzcarlton.hk', password: 'hongkong123' },
      { name: 'Four Seasons Hotel Hong Kong', location: 'Hong Kong', price: 600, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763709548.jpg?k=8f4711a661ffe9156cc27298b7972526f7c2638ec9aab6d4cbc5a2c9fd6390c2&o=', rating: 5, exclusive: true, email: 'admin@fourseasons.hk', password: 'hongkong123' },
      { name: 'InterContinental Hong Kong', location: 'Hong Kong', price: 480, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/409143054.jpg?k=2e65ea2a4bd321768e91741df75162d8ae60256c808a36fd1521c53ebe79ab89&o=', rating: 5, exclusive: true, email: 'admin@intercontinental.hk', password: 'hongkong123' },
      { name: 'Grand Hyatt Hong Kong', location: 'Hong Kong', price: 450, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/593370627.jpg?k=c91650aace08fef98582558db6adb9a1332327278c3727ee89b59fa41cb4dde5&o=', rating: 5, exclusive: true, email: 'admin@grandhyatt.hk', password: 'hongkong123' }
    ];

    const allHotels = [...normalHotels, ...exclusiveHotels];
    
    await Hotel.insertMany(allHotels);
    
    console.log(`✅ Restored ${normalHotels.length} normal hotels`);
    console.log(`✅ Restored ${exclusiveHotels.length} exclusive hotels`);
    console.log(`📊 Total: ${allHotels.length} hotels`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restoreProperHotels();