import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllHotels } from '../services/hongkongHotelsApi'

export default function MemberDashboard() {
  const [member, setMember] = useState<any>(null)
  const [showHotels, setShowHotels] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const [showRoomSelection, setShowRoomSelection] = useState(false)
  const navigate = useNavigate()

  const [exclusiveHotels, setExclusiveHotels] = useState<any[]>([])
  const [hongKongHotels, setHongKongHotels] = useState<any[]>([])
  const [regularHotels, setRegularHotels] = useState<any[]>([])

  const allHotels = [...exclusiveHotels, ...regularHotels]

  useEffect(() => {
    const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
    if (!memberData) {
      navigate('/member-login', { replace: true })
      return
    }
    
    // Check if we should show hotels section
    const shouldShowHotels = sessionStorage.getItem('showHotels')
    if (shouldShowHotels === 'true') {
      setShowHotels(true)
      sessionStorage.removeItem('showHotels')
    }
    
    const parsedMember = JSON.parse(memberData)
    setMember(parsedMember)
    // Ensure both keys are set
    localStorage.setItem('member', JSON.stringify(parsedMember))
    localStorage.setItem('memberCheckout', JSON.stringify(parsedMember))

    // Load exclusive hotels from database instead of localStorage
    const fetchExclusiveHotels = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hotels/exclusive')
        const data = await response.json()
        if (data.success && data.hotels.length > 0) {
          // Convert database format to UI format
          const convertedHotels = data.hotels.map((hotel: any) => ({
            id: hotel._id,
            name: hotel.name,
            location: hotel.location,
            price: hotel.price,
            image: hotel.image,
            rating: hotel.rating,
            exclusive: true
          }))
          setExclusiveHotels(convertedHotels)
        } else {
          // Fallback to default exclusive hotels if none in database
          const defaultHotels = [
            { id: 'exc-1', name: 'Grand Palace Resort', location: 'Maldives', price: 850, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', rating: 4.9, exclusive: true },
            { id: 'exc-2', name: 'Royal Mountain Lodge', location: 'Swiss Alps', price: 720, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', rating: 4.8, exclusive: true },
            { id: 'exc-3', name: 'Ocean View Villa', location: 'Santorini', price: 650, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', rating: 4.7, exclusive: true },
            { id: 'exc-4', name: 'Desert Oasis Hotel', location: 'Dubai', price: 580, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', rating: 4.6, exclusive: true },
            { id: 'exc-5', name: 'Platinum Sky Resort', location: 'Bora Bora', price: 950, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', rating: 5.0, exclusive: true },
            { id: 'exc-6', name: 'Crystal Bay Sanctuary', location: 'Seychelles', price: 780, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', rating: 4.9, exclusive: true }
          ]
          setExclusiveHotels(defaultHotels)
        }
      } catch (error) {
        console.error('Error fetching exclusive hotels:', error)
        // Fallback to default exclusive hotels on error
        const defaultHotels = [
          { id: 'exc-1', name: 'Grand Palace Resort', location: 'Maldives', price: 850, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', rating: 4.9, exclusive: true },
          { id: 'exc-2', name: 'Royal Mountain Lodge', location: 'Swiss Alps', price: 720, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', rating: 4.8, exclusive: true },
          { id: 'exc-3', name: 'Ocean View Villa', location: 'Santorini', price: 650, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', rating: 4.7, exclusive: true },
          { id: 'exc-4', name: 'Desert Oasis Hotel', location: 'Dubai', price: 580, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', rating: 4.6, exclusive: true },
          { id: 'exc-5', name: 'Platinum Sky Resort', location: 'Bora Bora', price: 950, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', rating: 5.0, exclusive: true },
          { id: 'exc-6', name: 'Crystal Bay Sanctuary', location: 'Seychelles', price: 780, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', rating: 4.9, exclusive: true }
        ]
        setExclusiveHotels(defaultHotels)
      }
    }
    fetchExclusiveHotels()

    // Load Hong Kong hotels from API
    getAllHotels().then(setHongKongHotels).catch(() => setHongKongHotels([]))

    // Load regular hotels from database
    const fetchRegularHotels = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hotels/normal')
        const data = await response.json()
        if (data.success) {
          // Convert database format to UI format
          const convertedHotels = data.hotels.map((hotel: any) => ({
            id: hotel._id,
            name: hotel.name,
            location: hotel.location,
            price: hotel.price,
            image: hotel.image,
            rating: hotel.rating,
            exclusive: false
          }))
          setRegularHotels(convertedHotels)
        }
      } catch (error) {
        console.error('Error fetching regular hotels:', error)
        setRegularHotels([])
      }
    }
    fetchRegularHotels()
  }, [navigate])

  const handleLogout = () => {
    // Clear all authentication and member data
    localStorage.removeItem('member')
    localStorage.removeItem('memberCheckout')
    localStorage.removeItem('token')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    localStorage.removeItem('memberBookings')
    localStorage.removeItem('spentPoints')
    navigate('/')
  }

  const handleBookHotel = (hotel: any) => {
    setSelectedHotel(hotel)
    setShowRoomSelection(true)
  }

  const handleRoomSelect = (roomType: string, basePrice: number) => {
    const memberDiscount = member?.tier === 'Platinum' ? 25 : member?.tier === 'Gold' ? 15 : member?.tier === 'Silver' ? 10 : member?.tier === 'Diamond' ? 35 : 5
    const discountedPrice = Math.round(basePrice * (1 - memberDiscount / 100))
    
    const room = {
      id: `${selectedHotel.id}-${roomType.toLowerCase().replace(' ', '-')}`,
      name: `${selectedHotel.name} - ${roomType}`,
      title: roomType,
      hotelName: selectedHotel.name,
      image: selectedHotel.image,
      price: discountedPrice,
      features: [`${selectedHotel.location}`, `${selectedHotel.rating} stars`, `${memberDiscount}% member discount`],
      originalPrice: basePrice,
      memberDiscount: memberDiscount
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(member))
    
    // Use luxury checkout for exclusive hotels, regular checkout for others
    if (selectedHotel.exclusive) {
      navigate('/member-checkout', { state: { room } })
    } else {
      navigate('/checkout', { state: { room } })
    }
  }

  const getRoomOptions = (hotel: any) => {
    const basePrice = hotel.price
    return [
      { type: 'Standard Room', price: basePrice, features: ['1 Queen Bed', 'City View', 'Free WiFi', '25 sqm'] },
      { type: 'Deluxe Room', price: Math.round(basePrice * 1.3), features: ['1 King Bed', 'Partial Ocean View', 'Free WiFi', 'Mini Bar', '35 sqm'] },
      { type: 'Suite', price: Math.round(basePrice * 1.8), features: ['1 King Bed + Sofa', 'Ocean View', 'Free WiFi', 'Mini Bar', 'Balcony', '50 sqm'] },
      { type: 'Presidential Suite', price: Math.round(basePrice * 2.5), features: ['2 Bedrooms', 'Panoramic View', 'Free WiFi', 'Full Kitchen', 'Private Terrace', '80 sqm'] }
    ]
  }

  if (!member) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900 pt-20 relative overflow-hidden">

      {/* Luxury Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Neon Grid Lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse delay-500"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse delay-1500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Royal Header */}
        <div className="bg-gradient-to-r from-black/90 via-purple-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-8 text-white mb-8 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-400/50 animate-pulse">
                  <svg className="w-10 h-10 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 animate-pulse">⚡ Welcome back, {member.name}! ⚡</h1>
                <p className="text-gray-300 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-3 py-1 rounded-full text-sm font-semibold shadow-lg shadow-cyan-400/30 animate-pulse">🔥 {member.tier} 🔥</span>
                  <span>•</span>
                  <span>ID: {member.membershipId}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 text-red-300 hover:text-red-200 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Royal Member Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-900/40 to-green-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-lg">Priority Booking</h3>
            </div>
            <p className="text-gray-300">Get first access to premium rooms and exclusive dates with royal treatment</p>
          </div>

          <div className="bg-gradient-to-br from-[var(--color-brand-gold)]/20 to-yellow-600/20 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-[var(--color-brand-gold)]/30 hover:border-[var(--color-brand-gold)]/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-[var(--color-brand-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-lg">{member?.tier === 'Diamond' ? '35%' : member?.tier === 'Platinum' ? '25%' : member?.tier === 'Gold' ? '15%' : member?.tier === 'Silver' ? '10%' : '5%'} Discount</h3>
            </div>
            <p className="text-gray-300">Exclusive member pricing on all luxury bookings worldwide</p>
          </div>

          <div onClick={() => navigate('/royal-concierge')} className="bg-gradient-to-br from-purple-900/40 to-indigo-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-lg">Royal Concierge</h3>
            </div>
            <p className="text-gray-300">24/7 dedicated personal assistant for all your luxury needs</p>
          </div>
        </div>

        {/* Royal Member Services */}
        <div className="bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[var(--color-brand-gold)]/20">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent mb-8 text-center">Royal Member Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <button 
              onClick={() => setShowHotels(!showHotels)}
              className="group p-8 bg-gradient-to-br from-[var(--color-brand-navy)]/80 to-blue-900/80 backdrop-blur-sm text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-blue-500/30 hover:border-blue-400/50"
            >
              <div className="relative">
                <svg className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                </svg>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-bold mb-2 text-base">Hotels Booking</h3>
              <p className="text-xs text-blue-200">Luxury stays worldwide</p>
            </button>

            <button 
              onClick={() => navigate('/my-bookings')}
              className="group p-8 bg-gradient-to-br from-emerald-900/40 to-green-800/40 backdrop-blur-sm text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-emerald-500/30 hover:border-emerald-400/50"
            >
              <div className="relative">
                <svg className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-bold mb-2 text-base">My Bookings</h3>
              <p className="text-xs text-emerald-200">View your reservations</p>
            </button>

            <button 
              onClick={() => navigate('/royal-rewards')}
              className="group p-8 bg-gradient-to-br from-purple-900/40 to-indigo-800/40 backdrop-blur-sm text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-purple-500/30 hover:border-purple-400/50"
            >
              <div className="relative">
                <svg className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full animate-pulse delay-500"></div>
              </div>
              <h3 className="font-bold mb-2 text-base">Rewards</h3>
              <p className="text-xs text-purple-200">Elite points & benefits</p>
            </button>

            <button 
              onClick={() => navigate('/royal-concierge')}
              className="group p-8 bg-gradient-to-br from-[var(--color-brand-gold)]/20 to-yellow-600/20 backdrop-blur-sm text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-[var(--color-brand-gold)]/30 hover:border-[var(--color-brand-gold)]/50"
            >
              <div className="relative">
                <svg className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full animate-pulse delay-300"></div>
              </div>
              <h3 className="font-bold mb-2 text-base text-[var(--color-brand-gold)]">Royal Service</h3>
              <p className="text-xs text-gray-300">24/7 concierge</p>
            </button>
          </div>
        </div>

        {/* Royal Hotels Section */}
        {showHotels && (
          <div className="bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mt-8 border border-[var(--color-brand-gold)]/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent">Royal Hotel Collection</h2>
              <button 
                onClick={() => setShowHotels(false)}
                className="text-gray-400 hover:text-[var(--color-brand-gold)] transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Exclusive Member Hotels */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-4 py-2 rounded-full text-sm font-bold shadow-lg">👑 EXCLUSIVE</span>
                  Royal Member-Only Hotels
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exclusiveHotels.map((hotel) => {
                    const memberDiscount = member?.tier === 'Platinum' ? 25 : member?.tier === 'Gold' ? 15 : member?.tier === 'Silver' ? 10 : member?.tier === 'Diamond' ? 35 : 5
                    const discountedPrice = Math.round(hotel.price * (1 - memberDiscount / 100))
                    
                    return (
                      <div key={hotel.id} className="group bg-gradient-to-br from-[var(--color-brand-gold)]/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-[var(--color-brand-gold)]/30 hover:border-[var(--color-brand-gold)]/60 transform hover:-translate-y-2">
                        <div className="relative overflow-hidden">
                          <img src={hotel.image} alt={hotel.name} className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            👑 ROYAL
                          </div>
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-400 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            {memberDiscount}% OFF
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-white mb-2 text-lg">{hotel.name}</h3>
                          <p className="text-gray-300 text-sm mb-3 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {hotel.location}
                          </p>
                          <div className="flex items-center gap-1 mb-3">
                            {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-sm text-gray-600 ml-1">{hotel.rating}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                                ${discountedPrice}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">${hotel.price}</span>
                              <p className="text-xs text-gray-500">per night</p>
                            </div>
                            <button 
                              onClick={() => handleBookHotel(hotel)}
                              className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-3 rounded-xl font-bold hover:brightness-95 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                            >
                              Reserve Now
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Hong Kong Hotels */}
              {hongKongHotels.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">🇭🇰 HONG KONG</span>
                  Hong Kong Luxury Collection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hongKongHotels.map((hotel) => {
                    const memberDiscount = member?.tier === 'Platinum' ? 25 : member?.tier === 'Gold' ? 15 : member?.tier === 'Silver' ? 10 : member?.tier === 'Diamond' ? 35 : 5
                    const discountedPrice = Math.round(hotel.price * (1 - memberDiscount / 100))
                    
                    return (
                      <div key={hotel.id} className="group bg-gradient-to-br from-red-800/60 to-pink-900/60 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-red-500/30 hover:border-red-400/50 transform hover:-translate-y-1">
                        <div className="relative overflow-hidden">
                          <img src={hotel.image} alt={hotel.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            🇭🇰 {hotel.district}
                          </div>
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            {memberDiscount}% OFF
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white mb-1 text-sm">{hotel.name}</h3>
                          <p className="text-gray-300 text-xs mb-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {hotel.location}
                          </p>
                          <div className="flex items-center gap-1 mb-3">
                            {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => (
                              <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs text-gray-600 ml-1">{hotel.rating}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]">
                                ${discountedPrice}
                              </span>
                              <span className="text-xs text-gray-500 line-through ml-1">${hotel.price}</span>
                              <p className="text-xs text-gray-500">per night</p>
                            </div>
                            <button 
                              onClick={() => handleBookHotel({...hotel, exclusive: false})}
                              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold hover:brightness-95 transition-all duration-300 transform hover:scale-105 shadow-lg text-xs"
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              )}

              {/* Regular Hotels */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">✨ PREMIUM</span>
                  Luxury Hotel Collection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularHotels.map((hotel) => {
                    const memberDiscount = member?.tier === 'Platinum' ? 25 : member?.tier === 'Gold' ? 15 : member?.tier === 'Silver' ? 10 : member?.tier === 'Diamond' ? 35 : 5
                    const discountedPrice = Math.round(hotel.price * (1 - memberDiscount / 100))
                    
                    return (
                      <div key={hotel.id} className="group bg-gradient-to-br from-slate-800/60 to-blue-900/60 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 transform hover:-translate-y-1">
                        <div className="relative overflow-hidden">
                          <img src={hotel.image} alt={hotel.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            {memberDiscount}% OFF
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white mb-1 text-sm">{hotel.name}</h3>
                          <p className="text-gray-300 text-xs mb-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {hotel.location}
                          </p>
                          <div className="flex items-center gap-1 mb-3">
                            {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => (
                              <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs text-gray-600 ml-1">{hotel.rating}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                                ${discountedPrice}
                              </span>
                              <span className="text-xs text-gray-500 line-through ml-1">${hotel.price}</span>
                              <p className="text-xs text-gray-500">per night</p>
                            </div>
                            <button 
                              onClick={() => handleBookHotel(hotel)}
                              className="bg-gradient-to-r from-[var(--color-brand-navy)] to-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:brightness-95 transition-all duration-300 transform hover:scale-105 shadow-lg text-xs"
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Room Selection Modal */}
        {showRoomSelection && selectedHotel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Select Room Type</h3>
                  <button 
                    onClick={() => setShowRoomSelection(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900">{selectedHotel.name}</h4>
                  <p className="text-gray-600 text-sm">{selectedHotel.location}</p>
                </div>
                
                <div className="space-y-4">
                  {getRoomOptions(selectedHotel).map((room, index) => {
                    const memberDiscount = member?.tier === 'Platinum' ? 25 : member?.tier === 'Gold' ? 15 : member?.tier === 'Silver' ? 10 : member?.tier === 'Diamond' ? 35 : 5
                    const discountedPrice = Math.round(room.price * (1 - memberDiscount / 100))
                    
                    return (
                      <div key={index} className="border rounded-lg p-4 hover:border-[var(--color-brand-gold)] transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-semibold text-gray-900">{room.type}</h5>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {room.features.map((feature, i) => (
                                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{feature}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 line-through">${room.price}</div>
                            <div className="text-lg font-bold text-gray-900">${discountedPrice}</div>
                            <div className="text-xs text-green-600">{memberDiscount}% off</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRoomSelect(room.type, room.price)}
                          className="w-full bg-[var(--color-brand-navy)] text-white py-2 rounded-lg hover:brightness-95 transition"
                        >
                          Select Room
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}