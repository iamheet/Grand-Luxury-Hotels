import { useState, useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import ImageWithFallback from '../components/ImageWithFallback'
import HotelRoomListing from '../components/HotelRoomListing'

function getAmenityIcon(amenity: string) {
  const iconMap: Record<string, JSX.Element> = {
    'Free Wi‑Fi': <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
    'Pool': <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10s3-1 4-1 4 1 4 1 3-1 4-1 4 1 4 1v1s-3-1-4-1-4 1-4 1-3-1-4-1-4 1-4 1v-1zM2 13s3-1 4-1 4 1 4 1 3-1 4-1 4 1 4 1v1s-3-1-4-1-4 1-4 1-3-1-4-1-4 1-4 1v-1z"/></svg>,
    'Gym': <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 9V7a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1zM2 7a1 1 0 011-1h1v6H3a1 1 0 01-1-1V7zM17 6a1 1 0 011 1v4a1 1 0 01-1 1h-1V6h1z"/></svg>,
    'Restaurant': <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 01-1 1H8a1 1 0 110-2h4a1 1 0 011 1zm-1 4a1 1 0 100-2H8a1 1 0 100 2h4z" clipRule="evenodd" /></svg>,
    'Spa': <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
  }
  return iconMap[amenity] || <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3" /></svg>
}

export default function HotelDetails() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const stateHotel = (location as any).state?.hotel as any | undefined
  const localStorageHotel = typeof window !== 'undefined' ? localStorage.getItem('selectedHotel') : null
  const parsedLocalHotel = localStorageHotel ? JSON.parse(localStorageHotel) : null

  // --- Define all hotel data ---
  const hotels = useMemo(
    () => [
      {
        id: 'grand-palace',
        name: 'Grand Palace Hotel',
        rating: 5,
        address: '123 Luxury Ave, City, Country',
        description:
          'Experience timeless elegance at the Grand Palace Hotel, where refined interiors meet impeccable service. Enjoy panoramic skyline views, Michelin-starred dining, and a serene spa sanctuary.',
        images: [
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082763.jpg?k=1e0efd2d22e212697c98ff09502775672c39f4b38dc54b729c3a76f800173d12&o=',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082815.jpg?k=02f67b028a078c447148ec120fc37b81def8ce7baf2040ffce7a303d5d358940&o=',
        ],
        amenities: ['Free Wi-Fi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Valet Parking', 'Concierge', 'Room Service'],
        rooms: [
          { 
            id: 'gp-deluxe', 
            title: 'Deluxe Room', 
            price: 180, 
            guests: 2, 
            beds: 1, 
            image: 'https://images.unsplash.com/photo-1501117716987-c8eecb9767af?q=80&w=2070&auto=format&fit=crop',
            bedInfo: '1 king bed',
            size: 25,
            hasBalcony: true,
            hasCityView: true,
            amenities: ['Air conditioning', 'Private bathroom', 'Flat-screen TV', 'Free Wi-Fi'],
            detailedAmenities: ['Free toiletries', 'Shower', 'Safe', 'Towels', 'Linens', 'Socket near the bed', 'Refrigerator', 'Tea/Coffee maker', 'Hairdryer']
          },
          { 
            id: 'gp-suite', 
            title: 'Executive Suite', 
            price: 350, 
            guests: 3, 
            beds: 2, 
            image: 'https://images.unsplash.com/photo-1552902865-3930f0ec0a6b?q=80&w=2069&auto=format&fit=crop',
            bedInfo: '1 king bed and 1 futon bed',
            size: 45,
            hasBalcony: true,
            hasCityView: true,
            amenities: ['Air conditioning', 'Private bathroom', 'Flat-screen TV', 'Soundproof', 'Free Wi-Fi'],
            detailedAmenities: ['Free toiletries', 'Shower', 'Safe', 'Sofa', 'Towels', 'Linens', 'Socket near the bed', 'Refrigerator', 'Tea/Coffee maker', 'Hairdryer', 'Extra long beds (>2 meters)', 'Wake-up service', 'Dining area']
          },
          { 
            id: 'gp-royal', 
            title: 'Royal Suite', 
            price: 600, 
            guests: 4, 
            beds: 2, 
            image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082815.jpg?k=02f67b028a078c447148ec120fc37b81def8ce7baf2040ffce7a303d5d358940&o=',
            bedInfo: '1 king bed and 1 queen bed',
            size: 65,
            hasBalcony: true,
            hasCityView: true,
            amenities: ['Air conditioning', 'Private bathroom', 'Flat-screen TV', 'Soundproof', 'Sauna', 'Free Wi-Fi'],
            detailedAmenities: ['Free toiletries', 'Shower', 'Safe', 'Sofa', 'Towels', 'Linens', 'Socket near the bed', 'Refrigerator', 'Tea/Coffee maker', 'Hairdryer', 'Extra long beds (>2 meters)', 'Wake-up service', 'Dining area', 'Child safety socket covers', 'Baby safety gates', 'Air purifiers', 'Hand sanitizer']
          }
        ],
      },
      {
        id: 'royal-inn',
        name: 'Royal Inn',
        rating: 4,
        address: '45 Royal St, City, Country',
        description:
          'Cozy and refined stay with modern comforts. Steps from the central square and vibrant dining options.',
        images: [
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/446924572.jpg?k=1c5c38e495b2db2a77f061f2e255dc2464d6d07701cbf7176dd2706cd33420bb&o=',
          'https://images.unsplash.com/photo-1552902865-3930f0ec0a6b?q=80&w=2069&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1501117716987-c8eecb9767af?q=80&w=2070&auto=format&fit=crop',
        ],
        amenities: ['Free Wi-Fi', 'Breakfast', 'Concierge', 'Laundry'],
        rooms: [
          { 
            id: 'ri-standard', 
            title: 'Standard Room', 
            price: 90, 
            guests: 2, 
            beds: 1, 
            image: 'https://images.unsplash.com/photo-1501117716987-c8eecb9767af?q=80&w=2070&auto=format&fit=crop',
            bedInfo: '1 queen bed',
            size: 20,
            hasBalcony: false,
            hasCityView: true,
            amenities: ['Air conditioning', 'Private bathroom', 'Flat-screen TV', 'Free Wi-Fi'],
            detailedAmenities: ['Free toiletries', 'Shower', 'Towels', 'Linens', 'Socket near the bed', 'Tea/Coffee maker', 'Hairdryer']
          },
          { 
            id: 'ri-family', 
            title: 'Family Room', 
            price: 140, 
            guests: 4, 
            beds: 2, 
            image: 'https://images.unsplash.com/photo-1505692794400-1a1f4f54b0d4?q=80&w=2070&auto=format&fit=crop',
            bedInfo: '2 queen beds',
            size: 35,
            hasBalcony: false,
            hasCityView: true,
            amenities: ['Air conditioning', 'Private bathroom', 'Flat-screen TV', 'Free Wi-Fi'],
            detailedAmenities: ['Free toiletries', 'Shower', 'Safe', 'Towels', 'Linens', 'Socket near the bed', 'Refrigerator', 'Tea/Coffee maker', 'Hairdryer', 'Child safety socket covers']
          }
        ],
      },
      {
        id: 'sea-view',
        name: 'Sea View Resort',
        rating: 5,
        address: '7 Ocean Drive, Coast City',
        description:
          'Wake up to ocean breezes and panoramic sea views. Luxury suites, beach access, and watersports on site.',
        images: [
          'https://images.unsplash.com/photo-1501117716987-c8eecb9767af?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1505692794400-1a1f4f54b0d4?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=2070&auto=format&fit=crop',
        ],
        amenities: ['Beach Access', 'Pool', 'Spa', 'Water Sports', 'Free Wi-Fi'],
        rooms: [
          { 
            id: 'sv-sea-deluxe', 
            title: 'Sea View Deluxe', 
            price: 220, 
            guests: 2, 
            beds: 1, 
            image: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=2070&auto=format&fit=crop',
            bedInfo: '1 king bed',
            size: 30,
            hasBalcony: true,
            hasCityView: false,
            amenities: ['Air conditioning', 'Private bathroom', 'Flat-screen TV', 'Free Wi-Fi'],
            detailedAmenities: ['Free toiletries', 'Shower', 'Safe', 'Towels', 'Linens', 'Socket near the bed', 'Refrigerator', 'Tea/Coffee maker', 'Hairdryer', 'Extra long beds (>2 meters)']
          },
          { 
            id: 'sv-villa', 
            title: 'Beach Villa', 
            price: 480, 
            guests: 6, 
            beds: 3, 
            image: 'https://images.unsplash.com/photo-1505692794400-1a1f4f54b0d4?q=80&w=2070&auto=format&fit=crop',
            bedInfo: '2 king beds and 1 queen bed',
            size: 80,
            hasBalcony: true,
            hasCityView: false,
            amenities: ['Air conditioning', 'Private bathroom', 'Flat-screen TV', 'Soundproof', 'Free Wi-Fi'],
            detailedAmenities: ['Free toiletries', 'Shower', 'Safe', 'Sofa', 'Towels', 'Linens', 'Socket near the bed', 'Refrigerator', 'Tea/Coffee maker', 'Hairdryer', 'Extra long beds (>2 meters)', 'Wake-up service', 'Dining area', 'Air purifiers']
          }
        ],
      },
    ],
    []
  )

  // --- Resolve the display hotel ---
  const matchedById = hotels.find((h) => h.id === id)
  
  // Priority: state hotel > localStorage hotel > matched by ID > fallback
  const sourceHotel = stateHotel || parsedLocalHotel || matchedById
  
  // If sourceHotel exists but doesn't have the new room structure, merge with template
  let hotel
  if (sourceHotel && sourceHotel.rooms && sourceHotel.rooms.length > 0) {
    // Check if rooms have the new structure
    const hasNewStructure = sourceHotel.rooms[0].bedInfo !== undefined
    if (hasNewStructure) {
      hotel = sourceHotel
    } else {
      // Convert old room structure to new structure
      hotel = {
        ...sourceHotel,
        rooms: sourceHotel.rooms.map((room: any, index: number) => ({
          ...room,
          bedInfo: room.beds === 1 ? '1 queen bed' : `${room.beds} beds`,
          size: 25 + (index * 10),
          hasBalcony: index > 0,
          hasCityView: Math.random() > 0.3,
          amenities: ['Air conditioning', 'Private bathroom', 'Flat-screen TV', 'Free Wi-Fi'],
          detailedAmenities: ['Free toiletries', 'Shower', 'Towels', 'Linens', 'Socket near the bed', 'Tea/Coffee maker', 'Hairdryer'],
          image: room.image || 'https://images.unsplash.com/photo-1501117716987-c8eecb9767af?q=80&w=2070&auto=format&fit=crop'
        }))
      }
    }
  } else {
    hotel = {
      id: id || 'unknown',
      name: sourceHotel?.name || 'Hotel',
      rating: sourceHotel?.rating || 4,
      address: sourceHotel?.address || '—',
      description: sourceHotel?.description || 'Luxury accommodation',
      images: sourceHotel?.images || ['https://via.placeholder.com/800x600?text=Hotel+Image'],
      amenities: sourceHotel?.amenities || ['Free Wi-Fi', 'Pool', 'Restaurant'],
      rooms: [
        {
          id: 'standard',
          title: 'Standard Room',
          price: sourceHotel?.price || 120,
          guests: 2,
          beds: 1,
          image: 'https://images.unsplash.com/photo-1501117716987-c8eecb9767af?q=80&w=2070&auto=format&fit=crop',
          bedInfo: '1 queen bed',
          size: 25,
          hasBalcony: false,
          hasCityView: true,
          amenities: ['Air conditioning', 'Private bathroom', 'Free Wi-Fi'],
          detailedAmenities: ['Free toiletries', 'Shower', 'Towels', 'Linens', 'Socket near the bed']
        },
        {
          id: 'deluxe',
          title: 'Deluxe Room',
          price: (sourceHotel?.price || 120) + 50,
          guests: 3,
          beds: 1,
          image: 'https://images.unsplash.com/photo-1552902865-3930f0ec0a6b?q=80&w=2069&auto=format&fit=crop',
          bedInfo: '1 king bed',
          size: 35,
          hasBalcony: true,
          hasCityView: true,
          amenities: ['Air conditioning', 'Private bathroom', 'Flat-screen TV', 'Free Wi-Fi'],
          detailedAmenities: ['Free toiletries', 'Shower', 'Safe', 'Towels', 'Linens', 'Socket near the bed', 'Refrigerator', 'Tea/Coffee maker']
        },
        {
          id: 'suite',
          title: 'Executive Suite',
          price: (sourceHotel?.price || 120) + 120,
          guests: 4,
          beds: 2,
          image: 'https://images.unsplash.com/photo-1505692794400-1a1f4f54b0d4?q=80&w=2070&auto=format&fit=crop',
          bedInfo: '1 king bed and 1 sofa bed',
          size: 50,
          hasBalcony: true,
          hasCityView: true,
          amenities: ['Air conditioning', 'Private bathroom', 'Flat-screen TV', 'Soundproof', 'Free Wi-Fi'],
          detailedAmenities: ['Free toiletries', 'Shower', 'Safe', 'Sofa', 'Towels', 'Linens', 'Socket near the bed', 'Refrigerator', 'Tea/Coffee maker', 'Hairdryer', 'Wake-up service', 'Dining area']
        }
      ]
    }
  }
  const [index, setIndex] = useState(0)

  // --- UI ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1140px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-[26px] font-bold text-gray-900 mb-1">{hotel.name}</h1>
        </div>

        {/* Image Gallery Grid */}
        <div className="relative grid grid-cols-4 gap-1 h-[420px] mb-6">
          <div className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer">
            <ImageWithFallback src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover hover:opacity-90 transition" />
          </div>
          {hotel.images.slice(1, 5).map((src, i) => (
            <div key={i} className="relative overflow-hidden cursor-pointer">
              <ImageWithFallback src={src} alt={`${hotel.name} ${i+2}`} className="w-full h-full object-cover hover:opacity-90 transition" />
              {i === 3 && hotel.images.length > 5 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-semibold">+{hotel.images.length - 5} photos</span>
                </div>
              )}
            </div>
          ))}
          {hotel.images.length > 5 && (
            <button className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 px-4 py-2 rounded shadow-lg text-sm font-semibold transition">
              Show all photos
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6">
          {/* Content */}
          <div className="space-y-6">
            {/* Popular Facilities */}
            <div className="bg-white rounded p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Most popular facilities</h2>
              <div className="grid grid-cols-2 gap-3">
                {hotel.amenities.slice(0, 6).map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded p-6 shadow-sm">
              <p className="text-sm text-gray-700 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Availability */}
            <div id="rooms" className="bg-white rounded p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Availability</h2>
              <HotelRoomListing rooms={hotel.rooms} hotelName={hotel.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
