import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function YachtCharter() {
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

  const yachtServices = [
    {
      id: 'yacht-1',
      name: 'Luxury Day Charter',
      type: 'Motor Yacht',
      category: 'Day Charter',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      features: ['8-hour charter', '12 guests capacity', 'Professional crew', 'Gourmet catering', 'Water sports equipment', 'Coastal exploration']
    },
    {
      id: 'yacht-2',
      name: 'Sunset Romance Cruise',
      type: 'Sailing Yacht',
      category: 'Evening Charter',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400',
      features: ['4-hour sunset cruise', '8 guests capacity', 'Champagne service', 'Live music', 'Romantic dinner', 'Photography service']
    },
    {
      id: 'yacht-3',
      name: 'Multi-Day Adventure',
      type: 'Super Yacht',
      category: 'Extended Charter',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      features: ['3-day charter', '20 guests capacity', 'Luxury cabins', 'Island hopping', 'Diving equipment', 'Private chef']
    },
    {
      id: 'yacht-4',
      name: 'Corporate Event Yacht',
      type: 'Event Yacht',
      category: 'Business Charter',
      price: 4200,
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
      features: ['6-hour charter', '50 guests capacity', 'Conference facilities', 'Catering service', 'Entertainment system', 'Team building activities']
    },
    {
      id: 'yacht-5',
      name: 'Fishing Expedition',
      type: 'Sport Fishing',
      category: 'Adventure Charter',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400',
      features: ['10-hour charter', '8 guests capacity', 'Fishing equipment', 'Expert guide', 'Fish cleaning service', 'Lunch included']
    },
    {
      id: 'yacht-6',
      name: 'Mega Yacht Experience',
      type: 'Mega Yacht',
      category: 'Ultra Luxury',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1583500178690-d2d8b5d8b1b5?w=400',
      features: ['Full day charter', '30 guests capacity', 'Helicopter pad', 'Spa facilities', 'Michelin chef', 'Personal butler service']
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
      type: 'yacht',
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
              🛥️ Yacht & Boat Charters
            </h1>
            <p className="text-gray-300">Exclusive maritime experiences and coastal adventures</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Yacht Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yachtServices.map((service) => (
            <div key={service.id} className="bg-gradient-to-br from-slate-900/60 to-cyan-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-cyan-500/30 hover:border-cyan-400/50 transition-all transform hover:-translate-y-1">
              <div className="relative">
                <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold">
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
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-bold hover:brightness-95 transition-all"
                >
                  Charter Yacht
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}