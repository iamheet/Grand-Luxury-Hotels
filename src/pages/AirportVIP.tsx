import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AirportVIP() {
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

  const vipServices = [
    {
      id: 'vip-1',
      name: 'Premium Lounge Access',
      type: 'VIP Lounge',
      category: 'Standard VIP',
      price: 150,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
      features: ['Premium lounge access', 'Complimentary food & drinks', 'Wi-Fi & charging stations', 'Quiet environment', 'Shower facilities']
    },
    {
      id: 'vip-2',
      name: 'Fast-Track Security',
      type: 'Express Service',
      category: 'Priority Access',
      price: 200,
      image: 'https://images.unsplash.com/photo-1556388158-158dc78cd3f8?w=400',
      features: ['Skip security lines', 'Dedicated lanes', 'Priority boarding', 'Baggage fast-track', 'Personal escort']
    },
    {
      id: 'vip-3',
      name: 'Elite Airport Experience',
      type: 'Full VIP Service',
      category: 'Ultimate VIP',
      price: 500,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      features: ['Private terminal access', 'Luxury car transfer', 'Personal concierge', 'Premium spa access', 'Fine dining']
    },
    {
      id: 'vip-4',
      name: 'Business Traveler Package',
      type: 'Business VIP',
      category: 'Executive',
      price: 300,
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
      features: ['Business center access', 'Meeting rooms', 'Secretarial services', 'Priority check-in', 'Executive lounge']
    },
    {
      id: 'vip-5',
      name: 'Family VIP Experience',
      type: 'Family Service',
      category: 'Family Package',
      price: 400,
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400',
      features: ['Family lounge access', 'Kids entertainment', 'Family fast-track', 'Special assistance', 'Child care services']
    },
    {
      id: 'vip-6',
      name: 'First Class Terminal',
      type: 'Exclusive Access',
      category: 'Ultra Premium',
      price: 800,
      image: 'https://images.unsplash.com/photo-1583500178690-d2d8b5d8b1b5?w=400',
      features: ['Private terminal', 'Luxury suites', 'Personal butler', 'Michelin dining', 'Helicopter transfer']
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
              ✈️ Airport VIP Services
            </h1>
            <p className="text-gray-300">Skip lines and enjoy exclusive airport amenities</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* VIP Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vipServices.map((service) => (
            <div key={service.id} className="bg-gradient-to-br from-slate-900/60 to-blue-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-blue-500/30 hover:border-blue-400/50 transition-all transform hover:-translate-y-1">
              <div className="relative">
                <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
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
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold hover:brightness-95 transition-all"
                >
                  Book VIP Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}