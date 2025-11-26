import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PersonalShopping() {
  const navigate = useNavigate()

  const shoppingServices = [
    { id: 1, name: 'Luxury Fashion Styling', description: 'Personal stylist for high-end fashion and designer pieces', price: 800, duration: '4 hours', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
    { id: 2, name: 'Executive Wardrobe Consultation', description: 'Professional wardrobe planning for business executives', price: 600, duration: '3 hours', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    { id: 3, name: 'Red Carpet Styling', description: 'Celebrity-level styling for special events and galas', price: 1500, duration: '6 hours', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400' },
    { id: 4, name: 'Luxury Shopping Experience', description: 'VIP shopping at exclusive boutiques and designer stores', price: 1200, duration: '5 hours', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400' },
    { id: 5, name: 'Personal Shopper Service', description: 'Dedicated personal shopper for all your fashion needs', price: 500, duration: '3 hours', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400' },
    { id: 6, name: 'Complete Style Makeover', description: 'Total transformation with new wardrobe and styling', price: 2000, duration: '8 hours', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400' }
  ]

  const handleBooking = (service: any) => {
    if (service.name === 'Red Carpet Styling') {
      navigate('/red-carpet-styling')
      return
    }
    
    const shopping = {
      id: `shopping-${service.id}`,
      name: service.name,
      shopping: service,
      type: 'shopping'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: shopping } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-brand-navy)] to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🛍️ Personal Shopping & Styling</h1>
          <p className="text-gray-300 text-lg">Luxury personal shopping with professional stylists</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shoppingServices.map((service) => (
            <div key={service.id} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="relative">
                <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-3 py-1 rounded-full text-sm font-bold">
                  {service.duration}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[var(--color-brand-gold)]">${service.price}</span>
                    <p className="text-xs text-gray-400">per service</p>
                  </div>
                  <button 
                    onClick={() => handleBooking(service)}
                    className="bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-6 py-2 rounded-lg font-bold hover:brightness-95 transition-all"
                  >
                    Book Service
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