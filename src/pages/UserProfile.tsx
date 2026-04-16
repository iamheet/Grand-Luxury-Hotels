import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileService, type User, type Booking, type ProfileStats } from '../services/profileService'

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if user has token
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        // Fetch profile data from API
        const profileData = await profileService.getProfile()
        
        setUser(profileData.user)
        setBookings(profileData.bookings)
        setStats(profileData.stats)
        
      } catch (error: any) {
        console.error('Failed to fetch profile:', error)
        setError(error.message)
        
        // If session expired, redirect to login
        if (error.message.includes('Session expired') || error.message.includes('authentication')) {
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [navigate])

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return '🏨'
      case 'aircraft': return '✈️'
      case 'car': return '🚗'
      case 'yacht': return '🛥️'
      case 'airport': return '🛫'
      case 'travel': return '🌍'
      case 'combined': return '📦'
      default: return '🏨'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-gold)] mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading your profile...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Profile</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-3 rounded-xl font-semibold hover:brightness-95 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] flex items-center justify-center">
        <div className="text-white text-xl">User not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] pt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent">
            My Profile
          </h1>
          
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-3xl p-8 border border-[var(--color-brand-gold)]/20">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-[var(--color-brand-navy)]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                {user.membershipTier && (
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] rounded-full text-sm font-semibold">
                    {user.membershipTier} Member
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white">{user.email}</p>
                    </div>
                    {user.phone && (
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white">{user.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {user.membershipTier && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">Membership Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Tier</p>
                        <p className="text-[var(--color-brand-gold)] font-semibold">{user.membershipTier}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Points</p>
                        <p className="text-white">{user.points?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Quick Stats</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Total Bookings</p>
                      <p className="text-white font-semibold">{stats?.totalBookings || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Spent</p>
                      <p className="text-[var(--color-brand-gold)] font-semibold">
                        ${stats?.totalSpent?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Confirmed Orders</p>
                      <p className="text-green-400 font-semibold">{stats?.confirmedBookings || 0}</p>
                    </div>
                    {stats && stats.pendingBookings > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm">Pending Orders</p>
                        <p className="text-yellow-400 font-semibold">{stats.pendingBookings}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings History */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-3xl p-8 border border-[var(--color-brand-gold)]/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">My Orders</h2>
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="text-[var(--color-brand-gold)] hover:text-yellow-300 transition-colors text-sm font-medium"
                >
                  View All →
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
                  <p className="text-gray-300 mb-6">Start exploring our luxury services and make your first booking</p>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-3 rounded-xl font-semibold hover:brightness-95 transition-all"
                  >
                    Browse Services
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {bookings.slice(0, 5).map((booking, index) => (
                    <div key={booking.id || index} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">
                            {getBookingTypeIcon(booking.type)}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">
                              {booking.type === 'combined' ? 'Luxury Package' : 
                               booking.hotelName || booking.roomTitle || 'Service Booking'}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {booking.checkIn && booking.checkOut ? (
                                `${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(booking.checkOut).toLocaleDateString()}`
                              ) : (
                                `Booked on ${new Date(booking.bookingDate).toLocaleDateString()}`
                              )}
                            </p>
                            {booking.guests && (
                              <p className="text-gray-400 text-sm">
                                {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[var(--color-brand-gold)] font-bold text-lg">
                            ${booking.total.toLocaleString()}
                          </div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'pending' 
                              ? 'bg-yellow-500 text-yellow-900' 
                              : 'bg-green-500 text-white'
                          }`}>
                            {booking.status === 'pending' ? 'Pending' : 'Confirmed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {bookings.length > 5 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => navigate('/my-bookings')}
                        className="text-[var(--color-brand-gold)] hover:text-yellow-300 transition-colors text-sm font-medium"
                      >
                        View {bookings.length - 5} more bookings →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}