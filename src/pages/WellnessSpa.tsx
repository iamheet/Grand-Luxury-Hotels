import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WellnessSpa() {
  const navigate = useNavigate()

  const spaServices = [
    { id: 1, name: 'Royal Rejuvenation Package', description: 'Full-day luxury spa experience with massage, facial, and body treatments', price: 850, duration: '6 hours', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400' },
    { id: 2, name: 'Couples Retreat Spa', description: 'Romantic spa experience for two with private suite and champagne', price: 1200, duration: '4 hours', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
    { id: 3, name: 'Executive Wellness', description: 'Quick luxury treatments designed for busy professionals', price: 450, duration: '2 hours', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400' },
    { id: 4, name: 'Holistic Healing Journey', description: 'Ancient wellness practices combined with modern luxury', price: 950, duration: '5 hours', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400' },
    { id: 5, name: 'Beauty & Wellness Transformation', description: 'Complete makeover with spa treatments and beauty services', price: 1100, duration: '7 hours', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400' },
    { id: 6, name: 'Thermal Spa Experience', description: 'Luxury thermal treatments with mineral baths and saunas', price: 650, duration: '3 hours', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }
  ]

  const handleBooking = (service: any) => {
    const wellness = {
      id: `wellness-${service.id}`,
      name: service.name,
      wellness: service,
      type: 'wellness'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: wellness } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-brand-navy)] to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🧘♀️ Wellness & Spa</h1>
          <p className="text-gray-300 text-lg">Rejuvenate your mind, body, and soul with our luxury wellness experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spaServices.map((service) => (
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
                    <p className="text-xs text-gray-400">per session</p>
                  </div>
                  <button 
                    onClick={() => handleBooking(service)}
                    className="bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-6 py-2 rounded-lg font-bold hover:brightness-95 transition-all"
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
            className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            ← Back to Concierge
          </button>
        </div>
      </div>
    </div>
  )
}