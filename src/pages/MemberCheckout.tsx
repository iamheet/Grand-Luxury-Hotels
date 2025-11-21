import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function MemberCheckout() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const room = (state as any)?.room
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [guests, setGuests] = useState(1)
  const [nights, setNights] = useState(1)
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [selectedServices, setSelectedServices] = useState<any[]>([])
  const [showAddServices, setShowAddServices] = useState(false)

  useEffect(() => {
    if (!room) navigate('/member-dashboard', { replace: true })
    const memberData = localStorage.getItem('memberCheckout')
    if (memberData) {
      const parsedMember = JSON.parse(memberData)
      setMember(parsedMember)
      setGuestEmail(parsedMember.email || '')
      setGuestPhone(parsedMember.phone || '')
    }
    
    // Add initial service to booking
    if (room) {
      setSelectedServices([room])
    }
    
    // Set default dates
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    setCheckInDate(today.toISOString().split('T')[0])
    setCheckOutDate(tomorrow.toISOString().split('T')[0])
    
    // Save pending booking when user leaves page
    const handleBeforeUnload = () => {
      if (room && member && (guestEmail || guestPhone)) {
        const pendingBooking = room?.type === 'aircraft' ? {
          id: Date.now().toString(),
          type: 'aircraft',
          aircraft: room.aircraft,
          room: room,
          member: member,
          guest: {
            name: member.name,
            email: guestEmail,
            phone: guestPhone
          },
          total: room.aircraft.price,
          bookingDate: new Date().toISOString(),
          status: 'pending'
        } : {
          id: Date.now().toString(),
          type: 'hotel',
          room: room,
          member: member,
          guest: {
            name: member.name,
            email: guestEmail,
            phone: guestPhone
          },
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: guests,
          nights: nights,
          total: room.price * nights,
          bookingDate: new Date().toISOString(),
          status: 'pending'
        }
        
        const existingBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
        const alreadyExists = existingBookings.find((b: any) => 
          b.room?.id === room.id && b.status === 'pending' && b.member?.membershipId === member.membershipId
        )
        
        if (!alreadyExists) {
          existingBookings.push(pendingBooking)
          localStorage.setItem('memberBookings', JSON.stringify(existingBookings))
        }
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [room, navigate])

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate)
      const end = new Date(checkOutDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNights(diffDays > 0 ? diffDays : 1)
    }
  }, [checkInDate, checkOutDate])

  const handleConfirm = async () => {
    setLoading(true)
    
    setTimeout(() => {
      const hasHotel = selectedServices.some(s => s.type !== 'aircraft' && s.type !== 'car' && s.type !== 'travel')
      const hasAircraft = selectedServices.some(s => s.type === 'aircraft')
      const hasCar = selectedServices.some(s => s.type === 'car')
      const hasTravel = selectedServices.some(s => s.type === 'travel')
      
      const hotelTotal = selectedServices
        .filter(s => s.type !== 'aircraft' && s.type !== 'car')
        .reduce((sum, s) => sum + (s.price * nights), 0)
      
      const aircraftTotal = selectedServices
        .filter(s => s.type === 'aircraft')
        .reduce((sum, s) => sum + s.aircraft.price, 0)
        
      const carTotal = selectedServices
        .filter(s => s.type === 'car')
        .reduce((sum, s) => sum + s.car.price, 0)
        
      const travelTotal = selectedServices
        .filter(s => s.type === 'travel')
        .reduce((sum, s) => sum + s.travel.price, 0)
      
      const booking = {
        id: Date.now().toString(),
        type: [hasHotel, hasAircraft, hasCar, hasTravel].filter(Boolean).length > 1 ? 'combined' : hasAircraft ? 'aircraft' : hasCar ? 'car' : hasTravel ? 'travel' : 'hotel',
        services: selectedServices,
        room: selectedServices.find(s => s.type !== 'aircraft' && s.type !== 'car' && s.type !== 'travel') || selectedServices[0],
        aircraft: selectedServices.find(s => s.type === 'aircraft')?.aircraft,
        car: selectedServices.find(s => s.type === 'car')?.car,
        travel: selectedServices.find(s => s.type === 'travel')?.travel,
        member: member,
        guest: {
          name: member.name,
          email: guestEmail,
          phone: guestPhone
        },
        ...(hasHotel && {
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: guests,
          nights: nights
        }),
        total: hotelTotal + aircraftTotal + carTotal + travelTotal,
        hotelTotal,
        aircraftTotal,
        carTotal,
        travelTotal,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      }
      
      const existingBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
      existingBookings.push(booking)
      localStorage.setItem('memberBookings', JSON.stringify(existingBookings))
      
      navigate('/booking-success', { state: { booking } })
    }, 2000)
  }
  
  const addService = (service: any) => {
    setSelectedServices(prev => [...prev, service])
    setShowAddServices(false)
  }
  
  const removeService = (index: number) => {
    setSelectedServices(prev => prev.filter((_, i) => i !== index))
  }

  if (!room || !member) return null

  const hotelServices = selectedServices.filter(s => s.type !== 'aircraft' && s.type !== 'car' && s.type !== 'travel')
  const aircraftServices = selectedServices.filter(s => s.type === 'aircraft')
  const carServices = selectedServices.filter(s => s.type === 'car')
  const travelServices = selectedServices.filter(s => s.type === 'travel')
  const hotelTotal = hotelServices.reduce((sum, s) => sum + (s.price * nights), 0)
  const aircraftTotal = aircraftServices.reduce((sum, s) => sum + s.aircraft.price, 0)
  const carTotal = carServices.reduce((sum, s) => sum + s.car.price, 0)
  const travelTotal = travelServices.reduce((sum, s) => sum + s.travel.price, 0)
  const total = hotelTotal + aircraftTotal + carTotal + travelTotal
  const savings = hotelServices.reduce((sum, s) => sum + ((s.originalPrice - s.price) * nights), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] pt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              // Ensure member data is available
              const memberData = localStorage.getItem('memberCheckout') || localStorage.getItem('member')
              if (memberData) {
                const parsedMember = JSON.parse(memberData)
                localStorage.setItem('member', JSON.stringify(parsedMember))
                localStorage.setItem('memberCheckout', JSON.stringify(parsedMember))
              }
              navigate('/member-dashboard', { replace: true })
            }}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white">Exclusive Member Checkout</h1>
            </div>
            <p className="text-gray-300">Complete your luxury reservation</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Member Info */}
            <div className="bg-gradient-to-r from-[var(--color-brand-gold)]/10 to-yellow-400/10 backdrop-blur-sm border border-[var(--color-brand-gold)]/20 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xl font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                    {member.name} • <span className="text-[var(--color-brand-gold)]">{member.tier} Member</span> • <span className="text-gray-300">ID: {member.membershipId}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Guest Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent"
                    placeholder="Enter phone number (required)"
                  />
                </div>
              </div>
            </div>

            {/* Booking Details - Only for hotels */}
            {room?.type !== 'aircraft' && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Booking Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Check-in Date</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent"
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num} className="bg-slate-800">{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nights</label>
                    <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white">
                      {nights} Night{nights > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={loading || !guestPhone.trim()}
              className="w-full bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] py-4 rounded-2xl font-bold text-lg hover:brightness-95 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-[var(--color-brand-navy)]/30 border-t-[var(--color-brand-navy)] rounded-full animate-spin"></div>
                  Processing Reservation...
                </div>
              ) : (
                `Confirm Luxury Reservation • $${total}`
              )}
            </button>
          </div>

          {/* Sidebar */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-fit">
            <h3 className="text-xl font-semibold text-white mb-6">Reservation Summary</h3>
            
            {/* Selected Services */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white text-lg">Selected Services</h4>
                <button
                  onClick={() => setShowAddServices(true)}
                  className="text-[var(--color-brand-gold)] text-sm hover:underline"
                >
                  + Add Service
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedServices.map((service, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <img src={service.image} alt={service.name} className="w-16 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-white font-medium">{service.name}</h5>
                          <button
                            onClick={() => removeService(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {service.type === 'aircraft' ? `✈️ ${service.aircraft.type}` : '🏨 Hotel Room'}
                        </p>
                        <p className="text-[var(--color-brand-gold)] font-semibold">
                          ${service.type === 'aircraft' ? service.aircraft.price : service.price}{service.type !== 'aircraft' ? '/night' : '/flight'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Add Services Modal */}
            {showAddServices && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-bold text-white mb-4">Add Service</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/member-dashboard')}
                      className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <div className="text-white font-medium">🏨 Add Hotel</div>
                      <div className="text-gray-400 text-sm">Browse exclusive hotels</div>
                    </button>
                    <button
                      onClick={() => navigate('/aircraft-booking')}
                      className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <div className="text-white font-medium">✈️ Add Aircraft</div>
                      <div className="text-gray-400 text-sm">Private jets & helicopters</div>
                    </button>
                    <button
                      onClick={() => navigate('/car-rental')}
                      className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <div className="text-white font-medium">🚗 Add Car Rental</div>
                      <div className="text-gray-400 text-sm">Luxury vehicles & chauffeurs</div>
                    </button>
                    <button
                      onClick={() => navigate('/airport-vip')}
                      className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <div className="text-white font-medium">✈️ Add Airport VIP</div>
                      <div className="text-gray-400 text-sm">Lounge access & fast-track</div>
                    </button>
                    <button
                      onClick={() => navigate('/yacht-charter')}
                      className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <div className="text-white font-medium">🚥 Add Yacht Charter</div>
                      <div className="text-gray-400 text-sm">Luxury boats & maritime</div>
                    </button>
                    <button
                      onClick={() => navigate('/travel-planning')}
                      className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <div className="text-white font-medium">🗺️ Add Travel Planning</div>
                      <div className="text-gray-400 text-sm">Custom itineraries & experiences</div>
                    </button>
                  </div>
                  <button
                    onClick={() => setShowAddServices(false)}
                    className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-3 border-t border-white/20 pt-4">
              {hotelServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>🏨 Hotel Services</span>
                    <span>${hotelTotal}</span>
                  </div>
                  {hotelServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name} × {nights} nights</span>
                      <span>${service.price * nights}</span>
                    </div>
                  ))}
                </>
              )}
              
              {aircraftServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>✈️ Aircraft Services</span>
                    <span>${aircraftTotal}</span>
                  </div>
                  {aircraftServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.aircraft.price}</span>
                    </div>
                  ))}
                </>
              )}
              
              {carServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>🚗 Car Rental Services</span>
                    <span>${carTotal}</span>
                  </div>
                  {carServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.car.price}/day</span>
                    </div>
                  ))}
                </>
              )}
              
              {travelServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>🌍 Travel Services</span>
                    <span>${travelTotal}</span>
                  </div>
                  {travelServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.travel.price}</span>
                    </div>
                  ))}
                </>
              )}
              
              {savings > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Member Savings</span>
                  <span>-${savings}</span>
                </div>
              )}
              
              <div className="flex justify-between text-xl font-bold text-[var(--color-brand-gold)] border-t border-white/20 pt-3">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            {/* Member Benefits */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--color-brand-gold)]/10 to-yellow-400/10 rounded-xl border border-[var(--color-brand-gold)]/20">
              <h5 className="font-semibold text-[var(--color-brand-gold)] mb-2">Exclusive Benefits Included</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                {room?.type === 'aircraft' ? (
                  <>
                    <li>• Priority boarding & departure</li>
                    <li>• Luxury ground transportation</li>
                    <li>• 24/7 flight concierge service</li>
                    <li>• Premium catering & amenities</li>
                  </>
                ) : (
                  <>
                    <li>• Priority check-in & late checkout</li>
                    <li>• Complimentary room upgrade (subject to availability)</li>
                    <li>• 24/7 concierge service</li>
                    <li>• Welcome amenities</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}