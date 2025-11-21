import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CarRental() {
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

  const luxuryCars = [
    {
      id: 'car-1',
      name: 'Rolls-Royce Phantom',
      type: 'Luxury Sedan',
      category: 'Ultra Luxury',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400',
      features: ['Chauffeur included', 'Premium leather', 'Champagne service', 'Privacy partition', 'Wi-Fi']
    },
    {
      id: 'car-2',
      name: 'Bentley Continental GT',
      type: 'Grand Tourer',
      category: 'Luxury Sports',
      price: 950,
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400',
      features: ['Self-drive available', 'Premium sound', 'Heated seats', 'Panoramic roof', 'GPS navigation']
    },
    {
      id: 'car-3',
      name: 'Mercedes S-Class Maybach',
      type: 'Executive Sedan',
      category: 'Business Luxury',
      price: 800,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
      features: ['Executive seating', 'Massage seats', 'Ambient lighting', 'Premium audio', 'Climate control']
    },
    {
      id: 'car-4',
      name: 'Lamborghini Huracán',
      type: 'Supercar',
      category: 'Exotic Sports',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400',
      features: ['Track performance', 'Carbon fiber', 'Sport exhaust', 'Racing seats', 'Launch control']
    },
    {
      id: 'car-5',
      name: 'Range Rover Autobiography',
      type: 'Luxury SUV',
      category: 'Premium SUV',
      price: 650,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
      features: ['All-terrain capable', 'Premium interior', 'Towing capacity', 'Off-road modes', 'Luxury comfort']
    },
    {
      id: 'car-6',
      name: 'Ferrari 488 Spider',
      type: 'Convertible Supercar',
      category: 'Exotic Sports',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
      features: ['Convertible top', 'V8 turbo engine', 'Sport suspension', 'Carbon brakes', 'Racing heritage']
    }
  ]

  const handleBookCar = (car: any) => {
    const carAsRoom = {
      id: car.id,
      name: car.name,
      title: car.name,
      image: car.image,
      price: car.price,
      features: car.features,
      type: 'car',
      car: car
    }
    
    navigate('/member-checkout', { state: { room: carAsRoom } })
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
              🚗 Luxury Car Rental
            </h1>
            <p className="text-gray-300">Premium vehicles for exclusive members</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Car Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {luxuryCars.map((car) => (
            <div key={car.id} className="bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-[var(--color-brand-gold)]/30 hover:border-[var(--color-brand-gold)]/50 transition-all transform hover:-translate-y-1">
              <div className="relative">
                <img src={car.image} alt={car.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-3 py-1 rounded-full text-sm font-bold">
                  ${car.price}/day
                </div>
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {car.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{car.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{car.type}</p>
                
                <div className="space-y-2 mb-4">
                  {car.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-[var(--color-brand-gold)] rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => handleBookCar(car)}
                  className="w-full bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] py-3 rounded-xl font-bold hover:brightness-95 transition-all"
                >
                  Reserve Vehicle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}