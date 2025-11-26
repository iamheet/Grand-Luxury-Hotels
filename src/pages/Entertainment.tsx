import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Entertainment() {
  const navigate = useNavigate()

  const entertainmentOptions = [
    { id: 1, name: 'Broadway VIP Experience', type: 'Theater', location: 'New York', price: 850, image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400', description: 'Premium seats + backstage meet & greet' },
    { id: 2, name: 'Private Opera Box', type: 'Opera', location: 'Vienna', price: 1200, image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400', description: 'Exclusive box at Vienna State Opera' },
    { id: 3, name: 'Celebrity Chef Experience', type: 'Culinary', location: 'Paris', price: 950, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', description: 'Private cooking class with Michelin chef' },
    { id: 4, name: 'Formula 1 Paddock Club', type: 'Sports', location: 'Monaco', price: 2500, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', description: 'VIP access to Monaco Grand Prix' },
    { id: 5, name: 'Private Concert Hall', type: 'Music', location: 'London', price: 1800, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', description: 'Exclusive classical music performance' },
    { id: 6, name: 'Art Gallery Private Tour', type: 'Culture', location: 'Florence', price: 650, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', description: 'After-hours Uffizi Gallery experience' }
  ]

  const handleBooking = (entertainment: any) => {
    const entertainmentService = {
      id: `entertainment-${entertainment.id}`,
      name: entertainment.name,
      entertainment: entertainment,
      type: 'entertainment'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: entertainmentService } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-[var(--color-brand-navy)] to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🎭 Luxury Entertainment</h1>
          <p className="text-gray-300 text-lg">Exclusive access to world-class entertainment experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {entertainmentOptions.map((entertainment) => (
            <div key={entertainment.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 group">
              <div className="relative overflow-hidden">
                <img src={entertainment.image} alt={entertainment.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {entertainment.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{entertainment.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{entertainment.description}</p>
                <p className="text-gray-400 text-sm mb-4 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {entertainment.location}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[var(--color-brand-gold)]">${entertainment.price}</span>
                    <p className="text-xs text-gray-400">per experience</p>
                  </div>
                  <button 
                    onClick={() => handleBooking(entertainment)}
                    className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-2 rounded-lg font-bold hover:brightness-95 transition-all transform hover:scale-105"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/royal-concierge')}
            className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            ← Back to Concierge
          </button>
        </div>
      </div>
    </div>
  )
}