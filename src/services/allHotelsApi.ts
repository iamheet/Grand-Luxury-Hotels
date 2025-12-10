// Combined Hotels API Service - All 53 Hotels
export interface Hotel {
  id: string
  name: string
  location: string
  price: number
  rating: number
  image: string
  exclusive: boolean
  category: 'exclusive' | 'regular' | 'hongkong'
  district?: string
}

const allHotels: Hotel[] = [
  // Exclusive Hotels (16)
  { id: 'exc-1', name: 'Grand Palace Resort', location: 'Maldives', price: 850, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', rating: 4.9, exclusive: true, category: 'exclusive' },
  { id: 'exc-2', name: 'Royal Mountain Lodge', location: 'Swiss Alps', price: 720, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', rating: 4.8, exclusive: true, category: 'exclusive' },
  { id: 'exc-3', name: 'Ocean View Villa', location: 'Santorini', price: 650, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', rating: 4.7, exclusive: true, category: 'exclusive' },
  { id: 'exc-4', name: 'Desert Oasis Hotel', location: 'Dubai', price: 580, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', rating: 4.6, exclusive: true, category: 'exclusive' },
  { id: 'exc-5', name: 'Platinum Sky Resort', location: 'Bora Bora', price: 950, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', rating: 5.0, exclusive: true, category: 'exclusive' },
  { id: 'exc-6', name: 'Crystal Bay Sanctuary', location: 'Seychelles', price: 780, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', rating: 4.9, exclusive: true, category: 'exclusive' },
  { id: 'exc-7', name: 'Aurora Ice Hotel', location: 'Iceland', price: 680, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', rating: 4.8, exclusive: true, category: 'exclusive' },
  { id: 'exc-8', name: 'Emerald Forest Lodge', location: 'Costa Rica', price: 620, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', rating: 4.7, exclusive: true, category: 'exclusive' },
  { id: 'exc-9', name: 'Diamond Crown Palace', location: 'Monaco', price: 1200, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400', rating: 5.0, exclusive: true, category: 'exclusive' },
  { id: 'exc-10', name: 'Royal Safari Lodge', location: 'Kenya', price: 890, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400', rating: 4.9, exclusive: true, category: 'exclusive' },
  { id: 'exc-11', name: 'Platinum Glacier Resort', location: 'Antarctica', price: 1500, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', rating: 5.0, exclusive: true, category: 'exclusive' },
  { id: 'exc-12', name: 'Golden Temple Retreat', location: 'Bhutan', price: 750, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', rating: 4.8, exclusive: true, category: 'exclusive' },
  { id: 'exc-13', name: 'Royal Vineyard Estate', location: 'Tuscany', price: 820, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', rating: 4.9, exclusive: true, category: 'exclusive' },
  { id: 'exc-14', name: 'Crown Jewel Resort', location: 'Fiji', price: 980, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', rating: 4.9, exclusive: true, category: 'exclusive' },
  { id: 'exc-15', name: 'Imperial Castle Hotel', location: 'Scotland', price: 690, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', rating: 4.8, exclusive: true, category: 'exclusive' },
  { id: 'exc-16', name: 'Sovereign Island Resort', location: 'Bahamas', price: 1100, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', rating: 5.0, exclusive: true, category: 'exclusive' },
  
  // Regular Hotels (27)
  { id: 'paris-1', name: 'Hôtel Étoile Royale', location: 'Paris', price: 520, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false, category: 'regular' },
  { id: 'paris-2', name: 'Le Jardin Suites', location: 'Paris', price: 360, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/549415122.jpg?k=6aa38e1d6d970b5756c6e0bd4297a603ce8618ffec17a5e8c2332ac20ab1bc2e&o=', rating: 4, exclusive: false, category: 'regular' },
  { id: 'paris-3', name: 'Montmartre Inn', location: 'Paris', price: 180, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/269945146.jpg?k=705f092a0e86ab775de93f8e2013b12ae5981739f5a513bcecead2c0db4e109d&o=', rating: 3, exclusive: false, category: 'regular' },
  { id: 'nyc-1', name: 'The Skyline Tower', location: 'New York', price: 480, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763346606.jpg?k=6ec8469c977fbd5e6867bd1da4f454db5914ccf5c962cd9b9ae74a5c2c766ca4&o=', rating: 5, exclusive: false, category: 'regular' },
  { id: 'nyc-2', name: 'Central Grand', location: 'New York', price: 340, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/674961168.jpg?k=478bea50dd93b61a34be446f180c1b079e08ed9ce425d2680b87f91afea36272&o=', rating: 4, exclusive: false, category: 'regular' },
  { id: 'nyc-3', name: 'Hudson Pods', location: 'New York', price: 150, image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false, category: 'regular' },
  { id: 'tokyo-1', name: 'Shinjuku Imperial', location: 'Tokyo', price: 450, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082763.jpg?k=1e0efd2d22e212697c98ff09502775672c39f4b38dc54b729c3a76f800173d12&o=', rating: 5, exclusive: false, category: 'regular' },
  { id: 'tokyo-2', name: 'Ginza Artisan Hotel', location: 'Tokyo', price: 310, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/622864288.jpg?k=6709fc69eab0ae881792007d3d099fb03e92be6f6a925e19dce4f212b0664971&o=', rating: 4, exclusive: false, category: 'regular' },
  { id: 'tokyo-3', name: 'Asakusa Capsule', location: 'Tokyo', price: 90, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/488327823.jpg?k=ff6638640efe474a5079fc280b26ba9e3ea4e1a4cfc0dbfaef69d29b3d3cb821&o=', rating: 3, exclusive: false, category: 'regular' },
  { id: 'dubai-1', name: 'Palm Marina Resort', location: 'Dubai', price: 530, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/727476358.jpg?k=aec126bb04f23b6b833361fd74d87bd9512216d5bc27827f96554dbe59602a31&o=', rating: 5, exclusive: false, category: 'regular' },
  { id: 'dubai-2', name: 'Desert Pearl', location: 'Dubai', price: 330, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/598095554.jpg?k=a6feffaab51bf2d7bdbdb6eb5ea1ef8f9e7800524f7f7cfc093519c50f28fd48&o=', rating: 4, exclusive: false, category: 'regular' },
  { id: 'dubai-3', name: 'Old Town Lodge', location: 'Dubai', price: 160, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/567316864.jpg?k=5a093e3d899bc5afd867cd1db35ee8eeb8c7ececdf92067eeb7ee0981fb4bbd0&o=', rating: 3, exclusive: false, category: 'regular' },
  { id: 'rome-1', name: 'Palazzo Aurelia', location: 'Rome', price: 400, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false, category: 'regular' },
  { id: 'rome-2', name: 'Via Condotti House', location: 'Rome', price: 290, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/435714928.jpg?k=bbf01bc66b9366bb644a3910b74e29a7da359a2c70f450de03bc37275d91c005&o=', rating: 4, exclusive: false, category: 'regular' },
  { id: 'rome-3', name: 'Trastevere Rooms', location: 'Rome', price: 140, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false, category: 'regular' },
  { id: 'sg-1', name: 'The Fullerton Hotel', location: 'Singapore', price: 470, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/106988145.jpg?k=4dc750be5829df9afb3485ee7555b8d4697c151d3a403062908c4a5a1fd87112&o=', rating: 5, exclusive: false, category: 'regular' },
  { id: 'sg-2', name: 'Orchard Grove', location: 'Singapore', price: 320, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/721154462.jpg?k=12932700b7c14aaeb157ec0bf77bbb0cf9cfac9f88c4fdb93100a16b91b31196&o=', rating: 4, exclusive: false, category: 'regular' },
  { id: 'sg-3', name: 'Bugis Budget Inn', location: 'Singapore', price: 120, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false, category: 'regular' },
  { id: 'my-1', name: 'Kuala Vista Residences', location: 'Malaysia', price: 380, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/624148627.jpg?k=f1f6ef6b9ef5a4a1a952ad5d47ad8bfdf0e2dba2c286e028bc1b628968fd6e5c&o=', rating: 5, exclusive: false, category: 'regular' },
  { id: 'my-2', name: 'Penang Heritage Hotel', location: 'Malaysia', price: 220, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/326893205.jpg?k=977021538d51e8e7d1ee65fd16d26db58547c263f681d78ad6f3f8bb41837865&o=', rating: 4, exclusive: false, category: 'regular' },
  { id: 'bkk-1', name: 'Chao Phraya Riverside', location: 'Bangkok', price: 390, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/593370627.jpg?k=c91650aace08fef98582558db6adb9a1332327278c3727ee89b59fa41cb4dde5&o=', rating: 5, exclusive: false, category: 'regular' },
  { id: 'bkk-2', name: 'Sukhumvit Urban Hotel', location: 'Bangkok', price: 240, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/555924063.jpg?k=6b3a9b6d6c3f1d5e2a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f&o=', rating: 4, exclusive: false, category: 'regular' },
  { id: 'bkk-3', name: 'Old Town Guesthouse', location: 'Bangkok', price: 120, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false, category: 'regular' },
  { id: 'seoul-1', name: 'Gangnam Heights', location: 'Seoul', price: 410, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/225664341.jpg?k=0f8d1d1cce6e784a6c9589e46a112f9f2193c96867c2e44dcac670ccd7b7d6c2&o=', rating: 5, exclusive: false, category: 'regular' },
  { id: 'seoul-2', name: 'Myeongdong Boutique', location: 'Seoul', price: 260, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763709548.jpg?k=8f4711a661ffe9156cc27298b7972526f7c2638ec9aab6d4cbc5a2c9fd6390c2&o=', rating: 4, exclusive: false, category: 'regular' },
  { id: 'seoul-3', name: 'Hanok House', location: 'Seoul', price: 130, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/409143054.jpg?k=2e65ea2a4bd321768e91741df75162d8ae60256c808a36fd1521c53ebe79ab89&o=', rating: 3, exclusive: false, category: 'regular' },
  
  // Hong Kong Hotels (10)
  { id: 'hk-1', name: 'The Peninsula Hong Kong', location: 'Salisbury Road, Tsim Sha Tsui', price: 650, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', rating: 4.9, exclusive: false, category: 'hongkong', district: 'Kowloon' },
  { id: 'hk-2', name: 'The Ritz-Carlton Hong Kong', location: 'International Commerce Centre', price: 720, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', rating: 4.9, exclusive: false, category: 'hongkong', district: 'West Kowloon' },
  { id: 'hk-3', name: 'Mandarin Oriental Hong Kong', location: '5 Connaught Road Central', price: 580, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', rating: 4.8, exclusive: false, category: 'hongkong', district: 'Central' },
  { id: 'hk-4', name: 'Four Seasons Hotel Hong Kong', location: '8 Finance Street, Central', price: 620, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', rating: 4.8, exclusive: false, category: 'hongkong', district: 'Central' },
  { id: 'hk-5', name: 'The Upper House', location: 'Pacific Place, Admiralty', price: 550, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', rating: 4.8, exclusive: false, category: 'hongkong', district: 'Admiralty' },
  { id: 'hk-6', name: 'Island Shangri-La Hong Kong', location: 'Pacific Place, Supreme Court Road', price: 480, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', rating: 4.7, exclusive: false, category: 'hongkong', district: 'Admiralty' },
  { id: 'hk-7', name: 'W Hong Kong', location: '1 Austin Road West, Kowloon', price: 420, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', rating: 4.6, exclusive: false, category: 'hongkong', district: 'West Kowloon' },
  { id: 'hk-8', name: 'The Langham Hong Kong', location: '8 Peking Road, Tsim Sha Tsui', price: 380, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', rating: 4.6, exclusive: false, category: 'hongkong', district: 'Kowloon' },
  { id: 'hk-9', name: 'Hotel ICON', location: '17 Science Museum Road, Tsim Sha Tsui East', price: 320, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', rating: 4.5, exclusive: false, category: 'hongkong', district: 'Kowloon' },
  { id: 'hk-10', name: 'Cordis Hong Kong', location: '555 Shanghai Street, Mongkok', price: 280, image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800', rating: 4.4, exclusive: false, category: 'hongkong', district: 'Mongkok' }
]

export const getAllHotels = async (): Promise<Hotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(allHotels), 500)
  })
}

export const getExclusiveHotels = async (): Promise<Hotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(allHotels.filter(h => h.category === 'exclusive')), 500)
  })
}

export const getRegularHotels = async (): Promise<Hotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(allHotels.filter(h => h.category === 'regular')), 500)
  })
}

export const getHongKongHotels = async (): Promise<Hotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(allHotels.filter(h => h.category === 'hongkong')), 500)
  })
}

export const getHotelsByLocation = async (location: string): Promise<Hotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = allHotels.filter(h => 
        h.location.toLowerCase().includes(location.toLowerCase())
      )
      resolve(filtered)
    }, 500)
  })
}

export const getHotelsByPriceRange = async (minPrice: number, maxPrice: number): Promise<Hotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = allHotels.filter(h => h.price >= minPrice && h.price <= maxPrice)
      resolve(filtered)
    }, 500)
  })
}

export const getHotelById = async (id: string): Promise<Hotel | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hotel = allHotels.find(h => h.id === id)
      resolve(hotel || null)
    }, 500)
  })
}

export const searchHotels = async (query: string): Promise<Hotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = allHotels.filter(h => 
        h.name.toLowerCase().includes(query.toLowerCase()) ||
        h.location.toLowerCase().includes(query.toLowerCase())
      )
      resolve(filtered)
    }, 500)
  })
}
