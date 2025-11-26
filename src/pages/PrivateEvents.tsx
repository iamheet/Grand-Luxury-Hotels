import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PrivateEvents() {
  const navigate = useNavigate()

  const eventPackages = [
    { id: 1, name: 'Luxury Wedding Package', type: 'Wedding', guests: '50-200', price: 15000, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400', description: 'Complete wedding planning with venue, catering, and coordination' },
    { id: 2, name: 'Corporate Gala Event', type: 'Corporate', guests: '100-500', price: 12000, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400', description: 'Executive event planning with premium venues and services' },
    { id: 3, name: 'Birthday Celebration', type: 'Birthday', guests: '20-100', price: 8000, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400', description: 'Bespoke birthday party with custom themes and entertainment' },
    { id: 4, name: 'Anniversary Dinner', type: 'Anniversary', guests: '10-50', price: 5000, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', description: 'Intimate anniversary celebration with fine dining and ambiance' },
    { id: 5, name: 'Product Launch Event', type: 'Corporate', guests: '50-300', price: 10000, image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400', description: 'Professional product launch with media coordination' },
    { id: 6, name: 'Charity Fundraiser', type: 'Charity', guests: '100-400', price: 9000, image: 'https://images.unsplash.com/photo-1556125574-d7f27ec36a06?w=400', description: 'Elegant fundraising event with auction and entertainment' }
  ]

  const handleBooking = (eventPackage: any) => {
    if (eventPackage.id === 1) {
      navigate('/luxury-wedding')
      return
    }
    if (eventPackage.id === 3) {
      navigate('/birthday-celebration')
      return
    }
    if (eventPackage.id === 4) {
      navigate('/anniversary-dinner')
      return
    }
    if (eventPackage.id === 5) {
      navigate('/product-launch')
      return
    }
    if (eventPackage.id === 6) {
      navigate('/charity-fundraiser')
      return
    }
    
    const eventService = {
      id: `event-${eventPackage.id}`,
      name: eventPackage.name,
      event: eventPackage,
      type: 'event'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: eventService } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-[var(--color-brand-navy)] to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🎉 Private Event Planning</h1>
          <p className="text-gray-300 text-lg">Bespoke celebrations and gatherings tailored to perfection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventPackages.map((eventPackage) => (
            <div key={eventPackage.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 group">
              <div className="relative overflow-hidden">
                <img src={eventPackage.image} alt={eventPackage.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {eventPackage.guests} Guests
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm opacity-90">{eventPackage.type}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{eventPackage.name}</h3>
                <p className="text-pink-300 text-sm font-medium mb-2">{eventPackage.type} Event</p>
                <p className="text-gray-300 text-sm mb-4">{eventPackage.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[var(--color-brand-gold)]">${eventPackage.price}</span>
                    <p className="text-xs text-gray-400">starting price</p>
                  </div>
                  <button 
                    onClick={() => handleBooking(eventPackage)}
                    className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-2 rounded-lg font-bold hover:brightness-95 transition-all transform hover:scale-105"
                  >
                    Plan Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-pink-900/20 to-rose-900/20 backdrop-blur-xl rounded-3xl p-8 border border-pink-500/30">
          <h3 className="text-2xl font-bold text-center text-white mb-8">Full-Service Planning Includes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Venue Selection</h4>
              <p className="text-gray-300 text-sm">Premium locations with full setup and coordination</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Catering & Service</h4>
              <p className="text-gray-300 text-sm">Michelin-level cuisine with professional staff</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Complete Coordination</h4>
              <p className="text-gray-300 text-sm">End-to-end planning with dedicated event manager</p>
            </div>
          </div>
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