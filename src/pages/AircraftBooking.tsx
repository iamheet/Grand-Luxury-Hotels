import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AircraftBooking() {
  const [member, setMember] = useState<any>(null)
  const [selectedAircraft, setSelectedAircraft] = useState<any>(null)
  const [showCheckout, setShowCheckout] = useState(false)
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

  const privateJets = [
    {
      id: 'pj-1',
      name: 'Gulfstream G650ER',
      type: 'Private Jet',
      capacity: '14 passengers',
      range: '7,500 nm',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400',
      features: ['Ultra-long range', 'Luxury interior', 'High-speed WiFi', 'Full galley', 'Private bedroom']
    },
    {
      id: 'pj-2', 
      name: 'Bombardier Global 7500',
      type: 'Private Jet',
      capacity: '19 passengers',
      range: '7,700 nm',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1583500178690-d2d8b5d8b1b5?w=400',
      features: ['Longest range', 'Four living spaces', 'Master suite', 'Full kitchen', 'Entertainment system']
    },
    {
      id: 'pj-3',
      name: 'Cessna Citation X+',
      type: 'Private Jet', 
      capacity: '12 passengers',
      range: '3,460 nm',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
      features: ['Fastest civilian aircraft', 'Advanced avionics', 'Spacious cabin', 'Premium leather', 'Climate control']
    }
  ]

  const helicopters = [
    {
      id: 'hc-1',
      name: 'Airbus H175',
      type: 'Helicopter',
      capacity: '16 passengers',
      range: '400 nm',
      price: 5500,
      image: 'https://images.unsplash.com/photo-1544717684-4d5c0c8b1e8b?w=400',
      features: ['VIP configuration', 'Low noise', 'Advanced safety', 'Luxury seating', 'Panoramic windows']
    },
    {
      id: 'hc-2',
      name: 'Bell 429 GlobalRanger',
      type: 'Helicopter',
      capacity: '8 passengers',
      range: '370 nm',
      price: 4200,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      features: ['Twin-engine safety', 'Spacious cabin', 'Advanced glass cockpit', 'Executive interior', 'Smooth flight']
    },
    {
      id: 'hc-3',
      name: 'Leonardo AW139',
      type: 'Helicopter',
      capacity: '15 passengers',
      range: '573 nm',
      price: 6800,
      image: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=400',
      features: ['Multi-role capability', 'VIP interior', 'Latest avionics', 'Enhanced safety', 'Superior comfort']
    }
  ]

  const allAircraft = [...privateJets, ...helicopters]

  const handleBookAircraft = (aircraft: any) => {
    // Convert aircraft to room-like object for checkout compatibility
    const aircraftAsRoom = {
      id: aircraft.id,
      name: aircraft.name,
      title: aircraft.name,
      image: aircraft.image,
      price: aircraft.price,
      features: aircraft.features,
      type: 'aircraft',
      aircraft: aircraft
    }
    
    // Navigate to member checkout with aircraft data
    navigate('/member-checkout', { state: { room: aircraftAsRoom } })
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
              ✈️ Private Aircraft Booking
            </h1>
            <p className="text-gray-300">Select your luxury aircraft for exclusive travel</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Private Jets Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold">✈️ JETS</span>
            Private Jets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privateJets.map((jet) => (
              <div key={jet.id} className="bg-gradient-to-br from-slate-900/60 to-blue-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-blue-500/30 hover:border-blue-400/50 transition-all transform hover:-translate-y-1">
                <div className="relative">
                  <img src={jet.image} alt={jet.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ${jet.price}/flight
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{jet.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="text-gray-300">Capacity: <span className="text-white">{jet.capacity}</span></div>
                    <div className="text-gray-300">Range: <span className="text-white">{jet.range}</span></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {jet.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-[var(--color-brand-gold)] rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleBookAircraft(jet)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-bold hover:brightness-95 transition-all"
                  >
                    Book Private Jet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Helicopters Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">🚁 HELICOPTERS</span>
            Luxury Helicopters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helicopters.map((helicopter) => (
              <div key={helicopter.id} className="bg-gradient-to-br from-slate-900/60 to-emerald-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-emerald-500/30 hover:border-emerald-400/50 transition-all transform hover:-translate-y-1">
                <div className="relative">
                  <img src={helicopter.image} alt={helicopter.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ${helicopter.price}/flight
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{helicopter.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="text-gray-300">Capacity: <span className="text-white">{helicopter.capacity}</span></div>
                    <div className="text-gray-300">Range: <span className="text-white">{helicopter.range}</span></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {helicopter.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-[var(--color-brand-gold)] rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleBookAircraft(helicopter)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-bold hover:brightness-95 transition-all"
                  >
                    Book Helicopter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}