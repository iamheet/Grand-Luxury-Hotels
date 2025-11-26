import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PrivateChef() {
  const navigate = useNavigate()

  const chefServices = [
    { id: 1, name: 'Michelin Star Experience', chef: 'Chef Marcus Aurelius', cuisine: 'French Fine Dining', price: 2500, guests: '2-8', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400', description: '3 Michelin star chef creates bespoke tasting menu' },
    { id: 2, name: 'Italian Culinary Journey', chef: 'Chef Isabella Romano', cuisine: 'Authentic Italian', price: 1800, guests: '4-12', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', description: 'Traditional Italian feast with wine pairings' },
    { id: 3, name: 'Japanese Omakase', chef: 'Chef Hiroshi Tanaka', cuisine: 'Japanese Kaiseki', price: 3200, guests: '2-6', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', description: 'Authentic kaiseki experience with premium ingredients' },
    { id: 4, name: 'Modern American', chef: 'Chef Sarah Mitchell', cuisine: 'Contemporary American', price: 2200, guests: '6-15', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', description: 'Farm-to-table cuisine with molecular gastronomy' },
    { id: 5, name: 'Mediterranean Feast', chef: 'Chef Antonio Greco', cuisine: 'Mediterranean', price: 1600, guests: '8-20', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', description: 'Fresh seafood and organic produce celebration' },
    { id: 6, name: 'Luxury BBQ Experience', chef: 'Chef Robert King', cuisine: 'Gourmet BBQ', price: 1400, guests: '10-25', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', description: 'Premium cuts with artisanal sides and cocktails' }
  ]

  const handleBooking = (service: any) => {
    const chefService = {
      id: `chef-${service.id}`,
      name: service.name,
      chef: service,
      type: 'chef'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: chefService } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-[var(--color-brand-navy)] to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">👨‍🍳 Private Chef & Catering</h1>
          <p className="text-gray-300 text-lg">World-class chefs for intimate dining experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chefServices.map((service) => (
            <div key={service.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 group">
              <div className="relative overflow-hidden">
                <img src={service.image} alt={service.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {service.guests} Guests
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm opacity-90">{service.chef}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                <p className="text-orange-300 text-sm font-medium mb-2">{service.cuisine}</p>
                <p className="text-gray-300 text-sm mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[var(--color-brand-gold)]">${service.price}</span>
                    <p className="text-xs text-gray-400">per event</p>
                  </div>
                  <button 
                    onClick={() => handleBooking(service)}
                    className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-2 rounded-lg font-bold hover:brightness-95 transition-all transform hover:scale-105"
                  >
                    Book Chef
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-orange-900/20 to-red-900/20 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/30">
          <h3 className="text-2xl font-bold text-center text-white mb-8">What's Included</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Premium Ingredients</h4>
              <p className="text-gray-300 text-sm">Finest quality ingredients sourced globally</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Full Service</h4>
              <p className="text-gray-300 text-sm">Setup, cooking, service, and cleanup included</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Customizable</h4>
              <p className="text-gray-300 text-sm">Tailored menus for dietary preferences</p>
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