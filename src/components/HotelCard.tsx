import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

type Hotel = {
  id: string
  name: string
  stars: number
  price: number
  description: string
  images: string[]
  amenities?: string[]
  city?: string
}

const amenityIcons: { [key: string]: string } = {
  'Free Wi‑Fi': '📶',
  'WiFi': '📶',
  'Pool': '🏊',
  'Parking': '🅿️',
  'Breakfast': '🍳',
  'AC': '❄️',
  'Gym': '💪',
  'Spa': '💆',
  'Restaurant': '🍽️',
  'Bar': '🍸',
  'Room Service': '🛎️'
}

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const navigate = useNavigate()
  const images = hotel.images || []
  const amenities = hotel.amenities || []
  const mainImage = images[0] || 'https://via.placeholder.com/400x300?text=Hotel+Image'
  const reviewScore = 7 + (hotel.stars * 0.4)

  const getReviewText = (score: number) => {
    if (score >= 9) return 'Exceptional'
    if (score >= 8) return 'Excellent'
    if (score >= 7) return 'Very Good'
    if (score >= 6) return 'Good'
    return 'Pleasant'
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Hotel+Image'
  }

  const handleSeeAvailability = () => {
    localStorage.setItem('selectedHotel', JSON.stringify(hotel))
    window.open(`/hotel/${hotel.id}`, '_blank')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-4">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-72 flex-shrink-0">
          <div className="relative h-64 lg:h-full">
            <img
              src={mainImage}
              alt={hotel.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => navigate(`/hotel/${hotel.id}`)}
              onError={handleImageError}
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 flex gap-1">
                {images.slice(1, 4).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${hotel.name} ${idx + 2}`}
                    className="w-12 h-12 object-cover rounded border-2 border-white cursor-pointer hover:opacity-80"
                    onClick={() => navigate(`/hotel/${hotel.id}`)}
                    onError={handleImageError}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3
                className="text-xl font-bold text-blue-700 hover:text-blue-800 cursor-pointer mb-1"
                onClick={() => navigate(`/hotel/${hotel.id}`)}
              >
                {hotel.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <span>📍</span>
                <span>{hotel.city || 'Luxury Location'}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    {i < hotel.stars ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {hotel.description && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{hotel.description}</p>
          )}

          <div className="flex flex-wrap gap-3 mt-3">
            {amenities.slice(0, 6).map((amenity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded"
              >
                <span>{amenityIcons[amenity] || '✓'}</span>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-56 flex-shrink-0 p-4 lg:p-5 bg-gray-50 lg:bg-white flex flex-row lg:flex-col justify-between lg:justify-start items-center lg:items-end border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="flex items-center gap-2 mb-0 lg:mb-3">
            <div className="text-right">
              <div className="text-xs text-gray-600">{getReviewText(reviewScore)}</div>
              <div className="text-xs text-gray-500">{Math.floor(Math.random() * 1000 + 500)} reviews</div>
            </div>
            <div className="bg-blue-700 text-white font-bold text-lg px-2 py-1 rounded">
              {reviewScore.toFixed(1)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${hotel.price}
            </div>
            <div className="text-xs text-gray-500 mb-3">per night</div>
            <div className="text-xs text-green-700 mb-3">Includes taxes & fees</div>

            <button
              onClick={handleSeeAvailability}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded transition-colors duration-200"
            >
              See availability
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


