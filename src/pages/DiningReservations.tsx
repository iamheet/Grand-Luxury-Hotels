import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DiningReservations() {
  const navigate = useNavigate()
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null)

  const restaurants = [
    { id: 1, name: 'Le Bernardin', cuisine: 'French Seafood', location: 'New York', price: 350, stars: 3, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400' },
    { id: 2, name: 'Eleven Madison Park', cuisine: 'Contemporary American', location: 'New York', price: 295, stars: 3, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' },
    { id: 3, name: 'The French Laundry', cuisine: 'French', location: 'California', price: 450, stars: 3, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400' },
    { id: 4, name: 'Osteria Francescana', cuisine: 'Italian', location: 'Italy', price: 280, stars: 3, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
    { id: 5, name: 'Noma', cuisine: 'Nordic', location: 'Copenhagen', price: 380, stars: 2, image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400' },
    { id: 6, name: 'Sukiyabashi Jiro', cuisine: 'Japanese Sushi', location: 'Tokyo', price: 420, stars: 3, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' }
  ]

  const handleBooking = (restaurant: any) => {
    const dining = {
      id: `dining-${restaurant.id}`,
      name: restaurant.name,
      dining: restaurant,
      type: 'dining'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: dining } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-brand-navy)] to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🍽️ Fine Dining Reservations</h1>
          <p className="text-gray-300 text-lg">Exclusive access to world's finest restaurants</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="relative">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-3 py-1 rounded-full text-sm font-bold">
                  {'⭐'.repeat(restaurant.stars)} Michelin
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{restaurant.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{restaurant.cuisine}</p>
                <p className="text-gray-400 text-sm mb-4 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {restaurant.location}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[var(--color-brand-gold)]">${restaurant.price}</span>
                    <p className="text-xs text-gray-400">per person</p>
                  </div>
                  <button 
                    onClick={() => handleBooking(restaurant)}
                    className="bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-6 py-2 rounded-lg font-bold hover:brightness-95 transition-all"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/royal-concierge')}
            className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            ← Back to Concierge
          </button>
        </div>
      </div>
    </div>
  )
}