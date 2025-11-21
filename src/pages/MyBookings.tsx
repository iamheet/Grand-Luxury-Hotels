import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MyBookings() {
  const [member, setMember] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [editingBooking, setEditingBooking] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})
  const [viewingBooking, setViewingBooking] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const navigate = useNavigate()

  useEffect(() => {
    const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
    const userData = localStorage.getItem('user')
    
    if (!memberData && !userData) {
      navigate('/')
    } else {
      if (memberData) {
        const parsedMember = JSON.parse(memberData)
        setMember(parsedMember)
      }
      
      // Load all bookings and sort by booking date (newest first)
      const allBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
      const bookingsWithType = allBookings.map((booking: any) => {
        // Add type field if missing (for backward compatibility)
        if (!booking.type) {
          if ([booking.aircraft, booking.room, booking.car, booking.travel, booking.yacht, booking.airport].filter(Boolean).length > 1) {
            booking.type = 'combined'
          } else if (booking.aircraft) {
            booking.type = 'aircraft'
          } else if (booking.car) {
            booking.type = 'car'
          } else if (booking.yacht || (booking.travel && booking.travel.category?.includes('Charter'))) {
            booking.type = 'yacht'
          } else if (booking.airport || (booking.travel && booking.travel.type === 'airport')) {
            booking.type = 'airport'
          } else if (booking.travel) {
            booking.type = 'travel'
          } else {
            booking.type = 'hotel'
          }
        }
        return booking
      })
      const sortedBookings = bookingsWithType.sort((a: any, b: any) => {
        const dateA = new Date(a.bookingDate || a.id).getTime()
        const dateB = new Date(b.bookingDate || b.id).getTime()
        return dateB - dateA // Newest first
      })
      setBookings(sortedBookings)
    }
  }, [navigate])

  // Allow access for both members and regular users
  const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
  const userData = localStorage.getItem('user')
  if (!memberData && !userData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] pt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
              if (memberData) {
                navigate('/member-dashboard')
              } else {
                navigate('/')
              }
            }}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {localStorage.getItem('member') || localStorage.getItem('memberCheckout') ? 'Back to Dashboard' : 'Back to Home'}
          </button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent">
            My Bookings
          </h1>
          
          <div className="w-32"></div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          {['all', 'hotel', 'aircraft', 'car', 'yacht', 'airport', 'travel', 'combined'].map((filter) => {
            const count = filter === 'all' ? bookings.length : bookings.filter(b => b.type === filter).length
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'hotel' ? '🏨 Hotels' : filter === 'aircraft' ? '✈️ Aircraft' : filter === 'car' ? '🚗 Cars' : filter === 'yacht' ? '🛥️ Yachts' : filter === 'airport' ? '🛫 Airport VIP' : filter === 'travel' ? '🌍 Travel' : '📦 Combined'} ({count})
              </button>
            )
          })}
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 text-sm">
            {activeFilter === 'all' ? bookings.length : bookings.filter(b => b.type === activeFilter).length} 
            {activeFilter === 'all' ? 'total' : activeFilter} booking{(activeFilter === 'all' ? bookings.length : bookings.filter(b => b.type === activeFilter).length) !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Bookings List */}
        {(activeFilter === 'all' ? bookings : bookings.filter(b => b.type === activeFilter)).length === 0 ? (
          <div className="bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-3xl p-12 text-center border border-[var(--color-brand-gold)]/20">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
            <p className="text-gray-300 mb-6">Start exploring our exclusive hotels and make your first reservation</p>
            <button
              onClick={() => {
                const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
                if (memberData) {
                  navigate('/member-dashboard')
                } else {
                  navigate('/')
                }
              }}
              className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-3 rounded-xl font-semibold hover:brightness-95 transition-all"
            >
              Browse Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {(activeFilter === 'all' ? bookings : bookings.filter(b => b.type === activeFilter)).map((booking, index) => (
              <div key={booking.id || index} className="bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-2xl p-6 border border-[var(--color-brand-gold)]/20 hover:border-[var(--color-brand-gold)]/40 transition-all">
                <div className="flex items-start gap-6">
                  {/* Image */}
                  <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={booking.aircraft?.image || booking.room?.image || booking.roomImage} 
                      alt={booking.aircraft?.name || booking.room?.name || booking.roomTitle} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {booking.type === 'combined' ? 'Luxury Package' : booking.aircraft?.name || booking.room?.name || booking.roomTitle || 'Booking'}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {booking.type === 'combined' ? '📦 Combined Package' : booking.type === 'aircraft' ? '✈️ Aircraft Booking' : booking.type === 'car' ? '🚗 Car Rental' : booking.type === 'yacht' ? '🛥️ Yacht Charter' : booking.type === 'airport' ? '🛫 Airport VIP Service' : booking.type === 'travel' ? '🌍 Travel Service' : '🏨 Hotel Booking'} • ID: {booking.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                          ${booking.total}
                        </div>
                        <div className="text-sm text-gray-300">
                          {booking.type === 'combined' ? 'Complete Package' : booking.type === 'aircraft' ? 'Per flight' : `${booking.nights} night${booking.nights > 1 ? 's' : ''}`}
                        </div>
                      </div>
                    </div>
                    
                    {/* Booking Info Grid */}
                    {booking.type === 'combined' ? (
                      <div className="space-y-4 mb-4">
                        {booking.hotelTotal > 0 && (
                          <div className="bg-white/5 rounded-lg p-3">
                            <h5 className="text-white font-semibold mb-2">🏨 Hotel Service - ${booking.hotelTotal}</h5>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Check-in</p>
                                <p className="text-white">{new Date(booking.checkIn).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Check-out</p>
                                <p className="text-white">{new Date(booking.checkOut).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Guests</p>
                                <p className="text-white">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {booking.aircraftTotal > 0 && (
                          <div className="bg-white/5 rounded-lg p-3">
                            <h5 className="text-white font-semibold mb-2">✈️ Aircraft Service - ${booking.aircraftTotal}</h5>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Aircraft Type</p>
                                <p className="text-white">{booking.aircraft?.type}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Capacity</p>
                                <p className="text-white">{booking.aircraft?.capacity}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Range</p>
                                <p className="text-white">{booking.aircraft?.range}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : booking.type === 'aircraft' ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Aircraft Type</p>
                          <p className="text-white font-semibold">{booking.aircraft?.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Capacity</p>
                          <p className="text-white font-semibold">{booking.aircraft?.capacity}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Range</p>
                          <p className="text-white font-semibold">{booking.aircraft?.range}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Check-in</p>
                          <p className="text-white font-semibold">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Check-out</p>
                          <p className="text-white font-semibold">
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Guests</p>
                          <p className="text-white font-semibold">
                            {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Member/Guest Info */}
                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                      <h4 className="text-white font-semibold mb-2">{booking.type === 'aircraft' ? 'Member Information' : 'Guest Information'}</h4>
                      {editingBooking === booking.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-400 text-sm mb-1">Email</label>
                              <input
                                type="email"
                                value={editData.email}
                                onChange={(e) => setEditData({...editData, email: e.target.value})}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-400 text-sm mb-1">Phone</label>
                              <input
                                type="tel"
                                value={editData.phone}
                                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                              />
                            </div>
                          </div>
                          {booking.type !== 'aircraft' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-gray-400 text-sm mb-1">Check-in</label>
                                <input
                                  type="date"
                                  value={editData.checkIn?.split('T')[0]}
                                  onChange={(e) => setEditData({...editData, checkIn: e.target.value})}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-400 text-sm mb-1">Check-out</label>
                                <input
                                  type="date"
                                  value={editData.checkOut?.split('T')[0]}
                                  onChange={(e) => setEditData({...editData, checkOut: e.target.value})}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-400 text-sm mb-1">Guests</label>
                                <select
                                  value={editData.guests}
                                  onChange={(e) => setEditData({...editData, guests: Number(e.target.value)})}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                                >
                                  {[1,2,3,4,5,6].map(num => (
                                    <option key={num} value={num} className="bg-slate-800">{num}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const updatedBookings = bookings.map(b => {
                                  if (b.id === booking.id) {
                                    const nights = booking.type !== 'aircraft' ? 
                                      Math.ceil((new Date(editData.checkOut).getTime() - new Date(editData.checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0
                                    return {
                                      ...b,
                                      guest: { ...b.guest, email: editData.email, phone: editData.phone },
                                      ...(booking.type !== 'aircraft' && {
                                        checkIn: editData.checkIn,
                                        checkOut: editData.checkOut,
                                        guests: editData.guests,
                                        nights,
                                        total: booking.type === 'combined' ? 
                                          (b.hotelTotal / b.nights * nights) + b.aircraftTotal :
                                          b.room.price * nights
                                      })
                                    }
                                  }
                                  return b
                                })
                                setBookings(updatedBookings)
                                localStorage.setItem('memberBookings', JSON.stringify(updatedBookings))
                                setEditingBooking(null)
                              }}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingBooking(null)}
                              className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Name</p>
                            <p className="text-white">{booking.member?.name || booking.guest?.name || booking.guestName}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">{booking.type === 'aircraft' ? 'Membership ID' : 'Email'}</p>
                            <p className="text-white">{booking.member?.membershipId || booking.guest?.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">{booking.type === 'aircraft' ? 'Tier' : 'Phone'}</p>
                            <p className="text-white">{booking.member?.tier || booking.guest?.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Status and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'pending' 
                            ? 'bg-yellow-500 text-yellow-900' 
                            : 'bg-green-500 text-white'
                        }`}>
                          {booking.status === 'pending' ? 'Pending' : 'Confirmed'}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {booking.status === 'pending' ? 'Started on' : 'Booked on'} {new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        {booking.status === 'pending' ? (
                          <button 
                            onClick={() => {
                              // Navigate back to checkout to complete booking
                              if (booking.member) {
                                navigate('/member-checkout', { state: { room: booking.room } })
                              } else {
                                navigate('/checkout', { state: { room: booking.room } })
                              }
                            }}
                            className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-95 transition-all"
                          >
                            Complete Booking
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => setViewingBooking(booking)}
                              className="bg-[var(--color-brand-navy)] text-white px-4 py-2 rounded-lg text-sm hover:brightness-95 transition-all"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => {
                                setEditingBooking(booking.id)
                                setEditData({
                                  checkIn: booking.checkIn,
                                  checkOut: booking.checkOut,
                                  guests: booking.guests,
                                  email: booking.guest?.email || '',
                                  phone: booking.guest?.phone || ''
                                })
                              }}
                              className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-95 transition-all"
                            >
                              Modify
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('Are you sure you want to remove this booking?')) {
                                  const updatedBookings = bookings.filter(b => b.id !== booking.id)
                                  setBookings(updatedBookings)
                                  localStorage.setItem('memberBookings', JSON.stringify(updatedBookings))
                                }
                              }}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-all"
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* View Details Modal */}
        {viewingBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-[var(--color-brand-navy)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                  <button
                    onClick={() => setViewingBooking(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Booking Summary */}
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Booking Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Booking ID</p>
                        <p className="text-white font-medium">{viewingBooking.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          viewingBooking.status === 'pending' ? 'bg-yellow-500 text-yellow-900' : 'bg-green-500 text-white'
                        }`}>
                          {viewingBooking.status === 'pending' ? 'Pending' : 'Confirmed'}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-400">Booking Date</p>
                        <p className="text-white font-medium">{new Date(viewingBooking.bookingDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Total Amount</p>
                        <p className="text-[var(--color-brand-gold)] font-bold text-lg">${viewingBooking.total}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Services */}
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Services</h3>
                    {viewingBooking.type === 'combined' ? (
                      <div className="space-y-4">
                        {viewingBooking.hotelTotal > 0 && (
                          <div className="bg-white/10 rounded-lg p-3">
                            <h4 className="text-white font-medium mb-2">🏨 Hotel Service</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Room</p>
                                <p className="text-white">{viewingBooking.room?.name}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Amount</p>
                                <p className="text-[var(--color-brand-gold)]">${viewingBooking.hotelTotal}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Check-in</p>
                                <p className="text-white">{new Date(viewingBooking.checkIn).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Check-out</p>
                                <p className="text-white">{new Date(viewingBooking.checkOut).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {viewingBooking.aircraftTotal > 0 && (
                          <div className="bg-white/10 rounded-lg p-3">
                            <h4 className="text-white font-medium mb-2">✈️ Aircraft Service</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Aircraft</p>
                                <p className="text-white">{viewingBooking.aircraft?.name}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Amount</p>
                                <p className="text-[var(--color-brand-gold)]">${viewingBooking.aircraftTotal}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Type</p>
                                <p className="text-white">{viewingBooking.aircraft?.type}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Capacity</p>
                                <p className="text-white">{viewingBooking.aircraft?.capacity}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {viewingBooking.carTotal > 0 && (
                          <div className="bg-white/10 rounded-lg p-3">
                            <h4 className="text-white font-medium mb-2">🚗 Car Rental Service</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Vehicle</p>
                                <p className="text-white">{viewingBooking.car?.name}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Amount</p>
                                <p className="text-[var(--color-brand-gold)]">${viewingBooking.carTotal}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Category</p>
                                <p className="text-white">{viewingBooking.car?.category}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Type</p>
                                <p className="text-white">{viewingBooking.car?.type}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Service Type</p>
                          <p className="text-white">{viewingBooking.type === 'aircraft' ? '✈️ Aircraft' : viewingBooking.type === 'car' ? '🚗 Car Rental' : viewingBooking.type === 'yacht' ? '🛥️ Yacht Charter' : viewingBooking.type === 'airport' ? '🛫 Airport VIP Service' : viewingBooking.type === 'travel' ? '🌍 Travel Service' : '🏨 Hotel'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Name</p>
                          <p className="text-white">{viewingBooking.aircraft?.name || viewingBooking.car?.name || viewingBooking.travel?.name || viewingBooking.room?.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Guest Information */}
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Guest Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Name</p>
                        <p className="text-white">{viewingBooking.member?.name || viewingBooking.guest?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Email</p>
                        <p className="text-white">{viewingBooking.guest?.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone</p>
                        <p className="text-white">{viewingBooking.guest?.phone}</p>
                      </div>
                      {viewingBooking.member && (
                        <div>
                          <p className="text-gray-400">Membership</p>
                          <p className="text-[var(--color-brand-gold)]">{viewingBooking.member.tier} - {viewingBooking.member.membershipId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setViewingBooking(null)}
                    className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-2 rounded-lg font-semibold hover:brightness-95 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}