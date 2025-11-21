import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TravelPlanning() {
  const [member, setMember] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
    if (!memberData) {
      navigate('/member-login')
    } else {
      const parsedMember = JSON.parse(memberData)
      setMember(parsedMember)
    }
  }, [navigate])

  const planningServices = [
    {
      id: 'plan-1',
      name: 'Bespoke Itinerary Design',
      type: 'Custom Planning',
      category: 'Personalized',
      price: 500,
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
      features: ['Personal consultation', 'Custom route planning', 'Exclusive experiences', 'Local connections', 'Detailed documentation', '24/7 support']
    },
    {
      id: 'plan-2',
      name: 'Luxury World Tour',
      type: 'Multi-Destination',
      category: 'Global Experience',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
      features: ['Multi-city planning', 'First-class arrangements', 'Cultural experiences', 'VIP access', 'Personal guide', 'Luxury accommodations']
    },
    {
      id: 'plan-3',
      name: 'Adventure Expedition',
      type: 'Adventure Planning',
      category: 'Thrill Seeking',
      price: 800,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      features: ['Unique destinations', 'Adventure activities', 'Safety arrangements', 'Expert guides', 'Equipment included', 'Risk management']
    },
    {
      id: 'plan-4',
      name: 'Romantic Getaway',
      type: 'Romance Planning',
      category: 'Couples Experience',
      price: 600,
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400',
      features: ['Romantic destinations', 'Intimate experiences', 'Special occasions', 'Private dining', 'Couple activities', 'Memory creation']
    },
    {
      id: 'plan-5',
      name: 'Cultural Immersion',
      type: 'Cultural Planning',
      category: 'Educational',
      price: 700,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      features: ['Cultural sites', 'Local traditions', 'Art & history', 'Language support', 'Cultural guides', 'Authentic experiences']
    },
    {
      id: 'plan-6',
      name: 'Wellness Retreat',
      type: 'Wellness Planning',
      category: 'Health & Wellness',
      price: 900,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      features: ['Spa destinations', 'Wellness programs', 'Healthy cuisine', 'Meditation retreats', 'Fitness activities', 'Holistic healing']
    }
  ]

  const handleBookService = (service: any) => {
    const serviceAsRoom = {
      id: service.id,
      name: service.name,
      title: service.name,
      image: service.image,
      price: service.price,
      features: service.features,
      type: 'travel',
      travel: service
    }
    
    navigate('/member-checkout', { state: { room: serviceAsRoom } })
  }

  if (!member) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/royal-concierge')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Concierge
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent mb-2">
              🗺️ Custom Travel Planning
            </h1>
            <p className="text-gray-300">Personalized journeys crafted to your preferences</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Planning Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planningServices.map((service) => (
            <div key={service.id} className="bg-gradient-to-br from-slate-900/60 to-purple-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-400/50 transition-all transform hover:-translate-y-1">
              <div className="relative">
                <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ${service.price}
                </div>
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {service.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{service.type}</p>
                
                <div className="space-y-2 mb-4">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-[var(--color-brand-gold)] rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => handleBookService(service)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:brightness-95 transition-all"
                >
                  Plan Journey
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}