import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BeautyGrooming() {
  const navigate = useNavigate()

  const beautyServices = [
    { id: 1, name: 'Celebrity Styling Package', description: 'Complete makeover with A-list celebrity stylists and makeup artists', price: 1200, duration: '4 hours', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400' },
    { id: 2, name: 'Luxury Spa Beauty Day', description: 'Full-day beauty treatments at exclusive luxury spa locations', price: 800, duration: '6 hours', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400' },
    { id: 3, name: 'Executive Grooming', description: 'Professional grooming services for business executives', price: 400, duration: '2 hours', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400' },
    { id: 4, name: 'Bridal Beauty Experience', description: 'Complete bridal beauty package for your special day', price: 1500, duration: '5 hours', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400' },
    { id: 5, name: 'Anti-Aging Treatments', description: 'Advanced anti-aging and rejuvenation treatments', price: 2000, duration: '3 hours', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400' },
    { id: 6, name: 'Personal Shopping & Styling', description: 'Luxury personal shopping with professional stylists', price: 600, duration: '4 hours', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400' }
  ]

  const handleBooking = (service: any) => {
    const beauty = {
      id: `beauty-${service.id}`,
      name: service.name,
      beauty: service,
      type: 'beauty'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: beauty } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-brand-navy)] to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">💄 Beauty & Grooming</h1>
          <p className="text-gray-300 text-lg">Luxury beauty treatments with world-class professionals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beautyServices.map((service) => (
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