// Hong Kong Hotels API Service
export interface HongKongHotel {
  id: string
  name: string
  location: string
  district: string
  price: number
  rating: number
  image: string
  amenities: string[]
  description: string
  rooms: number
  starRating: number
}

const hongkongHotels: HongKongHotel[] = [
  {
    id: 'hk-1',
    name: 'The Peninsula Hong Kong',
    location: 'Salisbury Road, Tsim Sha Tsui',
    district: 'Kowloon',
    price: 650,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi'],
    description: 'Iconic luxury hotel with stunning Victoria Harbour views',
    rooms: 300,
    starRating: 5
  },
  {
    id: 'hk-2',
    name: 'The Ritz-Carlton Hong Kong',
    location: 'International Commerce Centre',
    district: 'West Kowloon',
    price: 720,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi', 'Rooftop'],
    description: 'World\'s highest hotel with breathtaking city views',
    rooms: 312,
    starRating: 5
  },
  {
    id: 'hk-3',
    name: 'Mandarin Oriental Hong Kong',
    location: '5 Connaught Road Central',
    district: 'Central',
    price: 580,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    amenities: ['Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi', 'Concierge'],
    description: 'Legendary hotel in the heart of Hong Kong\'s business district',
    rooms: 501,
    starRating: 5
  },
  {
    id: 'hk-4',
    name: 'Four Seasons Hotel Hong Kong',
    location: '8 Finance Street, Central',
    district: 'Central',
    price: 620,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi'],
    description: 'Waterfront luxury with Michelin-starred dining',
    rooms: 399,
    starRating: 5
  },
  {
    id: 'hk-5',
    name: 'The Upper House',
    location: 'Pacific Place, Admiralty',
    district: 'Admiralty',
    price: 550,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    amenities: ['Restaurant', 'Bar', 'Gym', 'WiFi', 'Library'],
    description: 'Contemporary luxury hotel with minimalist design',
    rooms: 117,
    starRating: 5
  },
  {
    id: 'hk-6',
    name: 'Island Shangri-La Hong Kong',
    location: 'Pacific Place, Supreme Court Road',
    district: 'Admiralty',
    price: 480,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi'],
    description: 'Towering hotel with panoramic harbour and mountain views',
    rooms: 565,
    starRating: 5
  },
  {
    id: 'hk-7',
    name: 'W Hong Kong',
    location: '1 Austin Road West, Kowloon',
    district: 'West Kowloon',
    price: 420,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi', 'Nightclub'],
    description: 'Trendy waterfront hotel with vibrant nightlife',
    rooms: 393,
    starRating: 5
  },
  {
    id: 'hk-8',
    name: 'The Langham Hong Kong',
    location: '8 Peking Road, Tsim Sha Tsui',
    district: 'Kowloon',
    price: 380,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi'],
    description: 'European elegance in the heart of Tsim Sha Tsui',
    rooms: 498,
    starRating: 5
  },
  {
    id: 'hk-9',
    name: 'Hotel ICON',
    location: '17 Science Museum Road, Tsim Sha Tsui East',
    district: 'Kowloon',
    price: 320,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    amenities: ['Pool', 'Restaurant', 'Bar', 'Gym', 'WiFi', 'Rooftop'],
    description: 'Modern design hotel with harbour views',
    rooms: 262,
    starRating: 4
  },
  {
    id: 'hk-10',
    name: 'Cordis Hong Kong',
    location: '555 Shanghai Street, Mongkok',
    district: 'Mongkok',
    price: 280,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi'],
    description: 'Contemporary hotel in vibrant Mongkok district',
    rooms: 665,
    starRating: 4
  }
]

export const getAllHotels = async (): Promise<HongKongHotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(hongkongHotels), 500)
  })
}

export const getHotelsByDistrict = async (district: string): Promise<HongKongHotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = hongkongHotels.filter(h => 
        h.district.toLowerCase().includes(district.toLowerCase())
      )
      resolve(filtered)
    }, 500)
  })
}

export const getHotelsByPriceRange = async (minPrice: number, maxPrice: number): Promise<HongKongHotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = hongkongHotels.filter(h => 
        h.price >= minPrice && h.price <= maxPrice
      )
      resolve(filtered)
    }, 500)
  })
}

export const getHotelById = async (id: string): Promise<HongKongHotel | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hotel = hongkongHotels.find(h => h.id === id)
      resolve(hotel || null)
    }, 500)
  })
}

export const searchHotels = async (query: string): Promise<HongKongHotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = hongkongHotels.filter(h => 
        h.name.toLowerCase().includes(query.toLowerCase()) ||
        h.location.toLowerCase().includes(query.toLowerCase()) ||
        h.district.toLowerCase().includes(query.toLowerCase())
      )
      resolve(filtered)
    }, 500)
  })
}
