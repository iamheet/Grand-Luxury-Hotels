import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MedicalServices() {
  const navigate = useNavigate()

  const medicalServices = [
    { id: 1, name: 'Executive Health Checkup', description: 'Comprehensive health assessment with top medical specialists', price: 2500, duration: '4 hours', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400' },
    { id: 2, name: 'Concierge Medicine Access', description: '24/7 access to personal physician and medical concierge', price: 5000, duration: 'Monthly', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400' },
    { id: 3, name: 'Specialist Consultations', description: 'Priority appointments with world-renowned medical specialists', price: 1500, duration: '90 minutes', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400' },
    { id: 4, name: 'Preventive Care Program', description: 'Personalized preventive healthcare and wellness monitoring', price: 3000, duration: 'Quarterly', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400' },
    { id: 5, name: 'Medical Tourism Coordination', description: 'Luxury medical travel with top international hospitals', price: 10000, duration: 'Per trip', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400' },
    { id: 6, name: 'Emergency Medical Response', description: 'Premium emergency medical services and evacuation', price: 7500, duration: 'Annual', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400' }
  ]

  const handleBooking = (service: any) => {
    const medical = {
      id: `medical-${service.id}`,
      name: service.name,
      medical: service,
      type: 'medical'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: medical } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-brand-navy)] to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🏥 Medical Services</h1>
          <p className="text-gray-300 text-lg">Premium healthcare with world-class medical professionals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {medicalServices.map((service) => (
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