import { useNavigate } from 'react-router-dom'

interface Room {
  id: string
  title: string
  bedInfo: string
  size: number
  hasBalcony: boolean
  hasCityView: boolean
  amenities: string[]
  detailedAmenities: string[]
  price: number
  image: string
}

interface HotelRoomListingProps {
  rooms: Room[]
  hotelName?: string
}

const amenityIcons: Record<string, string> = {
  'Air conditioning': '❄️',
  'Private bathroom': '🚿',
  'Flat-screen TV': '📺',
  'Soundproof': '🔇',
  'Sauna': '🧖‍♀️',
  'Free Wi-Fi': '📶'
}

export default function HotelRoomListing({ rooms, hotelName }: HotelRoomListingProps) {
  const navigate = useNavigate()

  const handleSelectRoom = (room: Room) => {
    // Store selected room data in localStorage
    localStorage.setItem('selectedRoom', JSON.stringify({
      ...room,
      hotelName: hotelName || 'Hotel'
    }))
    
    // Navigate to checkout
    navigate('/checkout')
  }

  if (!rooms || !Array.isArray(rooms)) {
    return <div className="text-gray-500">No rooms available</div>
  }

  return (
    <div className="space-y-4">
      {rooms.map((room) => (
        <div key={room.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Room Details */}
            <div className="lg:col-span-2 space-y-3">
              {/* Room Title */}
              <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                {room.title}
              </h3>

              {/* Bed Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                <span>{room.bedInfo}</span>
              </div>

              {/* Room Features */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  📐 {room.size}㎡
                </span>
                {room.hasBalcony && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                    🏢 Balcony
                  </span>
                )}
                {room.hasCityView && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                    🏙️ City view
                  </span>
                )}
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <span 
                    key={amenity}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border border-gray-200 text-gray-700"
                  >
                    <span>{amenityIcons[amenity] || '✓'}</span>
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Detailed Amenities */}
              <div className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs text-gray-600">
                  {room.detailedAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Booking */}
            <div className="lg:col-span-1 flex flex-col justify-between">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">${room.price}</div>
                <div className="text-sm text-gray-500">per night</div>
              </div>
              <button 
                onClick={() => handleSelectRoom(room)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
              >
                Select Room
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}