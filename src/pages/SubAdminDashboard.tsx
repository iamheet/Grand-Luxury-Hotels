import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import toast, { Toaster } from 'react-hot-toast'
import NotificationCenter from '../components/NotificationCenter'
import { getNotifications, addNotification } from '../utils/notificationCenter'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  isMember: boolean
  membershipTier?: string
  points: number
  createdAt: string
}

interface Booking {
  _id: string
  userId: { _id: string; name: string; email: string } | string
  hotelName: string
  checkIn: string
  checkOut: string
  guests: number
  price: number
  totalPrice?: number
  status?: string
  createdAt: string
}

interface Hotel {
  _id: string
  name: string
  location: string
  price: number
  rating: number
  image: string
  email?: string
  createdAt: string
}

export default function SubAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [subAdminData, setSubAdminData] = useState<any>(null)
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [showHotelModal, setShowHotelModal] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newHotel, setNewHotel] = useState({ name: '', location: '', price: 0, rating: 0, image: '' })
  const navigate = useNavigate()

  const handleHotelClick = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setEditingHotel({ ...hotel })
    setShowHotelModal(true)
  }

  const handleAddHotel = async () => {
    if (!newHotel.name || !newHotel.location || !newHotel.price || !newHotel.rating || !newHotel.image) {
      alert('❌ Please fill all fields')
      return
    }
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/hotels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHotel)
      })
      
      const data = await response.json()
      if (data.success) {
        alert('✅ Hotel added successfully!')
        setShowAddModal(false)
        setNewHotel({ name: '', location: '', price: 0, rating: 0, image: '' })
        fetchHotels()
      } else {
        alert('❌ Failed to add hotel: ' + data.message)
      }
    } catch (error) {
      alert('❌ Error adding hotel')
    }
  }

  const handleUpdateHotel = async () => {
    if (!editingHotel) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/hotels/${editingHotel._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingHotel.name,
          location: editingHotel.location,
          price: editingHotel.price,
          rating: editingHotel.rating,
          image: editingHotel.image
        })
      })
      
      const data = await response.json()
      if (data.success) {
        alert('✅ Hotel updated successfully!')
        setShowHotelModal(false)
        fetchHotels()
      } else {
        alert('❌ Failed to update hotel: ' + data.message)
      }
    } catch (error) {
      alert('❌ Error updating hotel')
    }
  }

  const handleDeleteHotel = async (hotelId: string) => {
    if (!confirm('Are you sure you want to delete this hotel?')) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/hotels/${hotelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        alert('✅ Hotel deleted successfully!')
        fetchHotels()
      } else {
        alert('❌ Failed to delete hotel: ' + data.message)
      }
    } catch (error) {
      alert('❌ Error deleting hotel')
    }
  }

  // Update unread notification count
  useEffect(() => {
    const updateUnreadCount = () => {
      const notifications = getNotifications()
      const unread = notifications.filter(n => !n.read).length
      setUnreadCount(unread)
    }
    
    updateUnreadCount()
    const interval = setInterval(updateUnreadCount, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = localStorage.getItem('adminAuth') === 'true'
      const adminType = localStorage.getItem('adminType')
      const token = localStorage.getItem('adminToken')
      const subAdminInfo = localStorage.getItem('subAdminData')

      console.log('SubAdmin Dashboard - Auth check:', { isAuth, adminType, hasToken: !!token }) // Debug

      if (!isAuth || adminType !== 'subadmin' || !token) {
        console.log('Not authenticated as subadmin, redirecting to login') // Debug
        navigate('/admin-login')
        return
      }

      if (subAdminInfo) {
        const parsedData = JSON.parse(subAdminInfo)
        console.log('SubAdmin data loaded:', parsedData) // Debug
        setSubAdminData(parsedData)
      }
    }

    checkAuth()

    // Socket.io connection for real-time notifications
    const socket = io('http://localhost:5000')
    
    socket.on('connect', () => {
      console.log('✅ SubAdmin connected to notification server')
    })
    
    socket.on('newBooking', (data) => {
      console.log('📧 SubAdmin received booking data:', data)
      console.log('🏨 Hotel name:', data.booking.hotelName)
      console.log('📍 SubAdmin location:', subAdminData?.location)
      
      // Get hotel location by fetching hotel details
      const getHotelLocation = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/hotels')
          const hotelsData = await response.json()
          if (hotelsData.success) {
            const hotel = hotelsData.hotels.find(h => h.name === data.booking.hotelName)
            console.log('🔍 Found hotel:', hotel)
            return hotel?.location
          }
        } catch (error) {
          console.error('Error fetching hotel location:', error)
        }
        return null
      }
      
      getHotelLocation().then(hotelLocation => {
        console.log('🗺️ Hotel location:', hotelLocation)
        
        const adminLocation = subAdminData?.location
        
        // If SubAdmin has a location and hotel location doesn't match, ignore
        if (adminLocation && hotelLocation && 
            adminLocation.toLowerCase() !== hotelLocation.toLowerCase()) {
          console.log('❌ Location mismatch - ignoring notification')
          return // Don't show notification for other locations
        }
        
        console.log('✅ Location match - showing notification')
        const bookingMsg = `New Booking in ${adminLocation || 'your area'}: ${data.booking.hotelName} - Customer: ${data.booking.customerName} - Amount: $${data.booking.amount}`
        
        toast.success(
          `🎉 ${bookingMsg}`,
          {
            duration: 5000,
            position: 'top-right',
            style: {
              background: '#10b981',
              color: '#fff',
              fontWeight: 'bold'
            },
            icon: '🔔'
          }
        )
        
        // Store booking notification
        addNotification(bookingMsg, 'success')
        
        // Auto-refresh bookings if on dashboard or transactions page
        if (activeSection === 'dashboard' || activeSection === 'transactions' || activeSection === 'bookings') {
          fetchBookings()
        }
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [navigate, activeSection])

  const fetchUsers = async () => {
    if (!subAdminData?.permissions?.viewUsers) return
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/users')
      const data = await response.json()
      if (data.success) setUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/bookings/admin/all')
      const data = await response.json()
      if (data.success) {
        console.log('📊 All bookings from database:', data.bookings)
        
        const adminLocation = subAdminData?.location
        console.log('📍 SubAdmin location for bookings:', adminLocation)
        
        if (adminLocation) {
          // Fetch hotels once
          const hotelsResponse = await fetch('http://localhost:5000/api/hotels')
          const hotelsData = await hotelsResponse.json()
          
          if (hotelsData.success) {
            console.log('🏨 All hotels for matching:', hotelsData.hotels)
            
            // Filter bookings by matching hotel location
            const filtered = data.bookings.filter((booking: Booking) => {
              // Try to find hotel by exact name match first
              let hotel = hotelsData.hotels.find((h: any) => h.name === booking.hotelName)
              
              // If not found, try to find by partial name match (for suites/rooms)
              if (!hotel && booking.hotelName) {
                hotel = hotelsData.hotels.find((h: any) => 
                  booking.hotelName.includes(h.name) || h.name.includes(booking.hotelName.split(' - ')[0])
                )
              }
              
              const match = hotel && hotel.location.toLowerCase().trim() === adminLocation.toLowerCase().trim()
              console.log(`📋 Booking: ${booking.hotelName} - Hotel found: ${!!hotel} - Hotel name: ${hotel?.name} - Location: ${hotel?.location} - Match: ${match}`)
              return match
            })
            console.log('✅ Filtered bookings for', adminLocation, ':', filtered)
            setBookings(filtered)
          } else {
            setBookings(data.bookings)
          }
        } else {
          setBookings(data.bookings)
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHotels = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/hotels')
      const data = await response.json()
      if (data.success) {
        console.log('📊 All hotels from database:', data.hotels)
        
        // Filter hotels by location if sub-admin has location
        const adminLocation = subAdminData?.location
        console.log('📍 SubAdmin location:', adminLocation)
        
        if (adminLocation) {
          const filteredHotels = data.hotels.filter((hotel: Hotel) => {
            const match = hotel.location.toLowerCase().trim() === adminLocation.toLowerCase().trim()
            console.log(`🏨 ${hotel.name} (${hotel.location}) - Match: ${match}`)
            return match
          })
          console.log('✅ Filtered hotels for', adminLocation, ':', filteredHotels)
          setHotels(filteredHotels)
        } else {
          setHotels(data.hotels)
        }
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeSection === 'users') fetchUsers()
    else if (activeSection === 'bookings' || activeSection === 'transactions') fetchBookings()
    else if (activeSection === 'hotels') fetchHotels()
    else if (activeSection === 'dashboard') {
      fetchUsers()
      fetchBookings()
      fetchHotels()
    }
  }, [activeSection, subAdminData])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminType')
    localStorage.removeItem('subAdminData')
    navigate('/admin-login')
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Toaster />
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-500 bg-white border-r border-gray-200 shadow-xl flex flex-col`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {sidebarOpen ? '👤 Admin' : '👤'}
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveSection('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-600 hover:bg-blue-50'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          {subAdminData?.permissions?.viewUsers && (
            <button onClick={() => setActiveSection('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'users' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-600 hover:bg-blue-50'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {sidebarOpen && <span>Users</span>}
            </button>
          )}

          {subAdminData?.permissions?.viewBookings && (
            <button onClick={() => setActiveSection('bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'bookings' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-600 hover:bg-blue-50'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {sidebarOpen && <span>Bookings</span>}
            </button>
          )}

          <button onClick={() => setActiveSection('transactions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'transactions' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-600 hover:bg-blue-50'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {sidebarOpen && <span>Transactions</span>}
          </button>

          <button onClick={() => setActiveSection('hotels')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'hotels' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-600 hover:bg-blue-50'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {sidebarOpen && <span>Hotels</span>}
          </button>
        </nav>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4 border-t border-gray-200 text-gray-600 hover:bg-gray-100">
          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg px-6 py-4 shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{subAdminData?.name || 'Admin'}</h2>
              <p className="text-sm text-gray-500">Administrator Panel</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowNotificationCenter(true)} className="relative p-2 rounded-lg transition-all duration-300 text-gray-600 hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all">
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === 'dashboard' && (
            <>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subAdminData?.permissions?.viewUsers && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                )}

                {subAdminData?.permissions?.viewBookings && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                )}

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">Total Hotels</p>
                  <p className="text-2xl font-bold text-gray-900">{hotels.length}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">Access Level</p>
                  <p className="text-2xl font-bold text-gray-900">Admin</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Bar Chart - Revenue Overview */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">Last 6 bookings</span>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                    <div className="w-full h-full p-4">
                      <div className="flex justify-between items-end h-full">
                        {bookings.slice(0, 6).map((booking, index) => {
                          const amount = booking.totalPrice || booking.price || (booking as any).total || (booking as any).amount || 0
                          const maxAmount = Math.max(...bookings.slice(0, 6).map(b => b.totalPrice || b.price || (b as any).total || (b as any).amount || 0), 1)
                          const height = (amount / maxAmount) * 180
                          return (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div 
                                className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t w-10 transition-all hover:opacity-80 cursor-pointer"
                                style={{ height: `${Math.max(height, 20)}px` }}
                                title={`$${amount.toLocaleString()}`}
                              ></div>
                              <span className="text-xs text-gray-600 mt-2">#{index + 1}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pie Chart - Hotel Revenue */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Revenue by Hotel</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">Total</span>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <div className="w-full h-full p-4 flex items-center justify-center">
                      {(() => {
                        const hotelRevenue: { [key: string]: number } = {}
                        bookings.forEach(b => {
                          const hotel = b.hotelName || 'Unknown'
                          const amount = b.totalPrice || b.price || (b as any).total || (b as any).amount || 0
                          hotelRevenue[hotel] = (hotelRevenue[hotel] || 0) + amount
                        })
                        const total = Object.values(hotelRevenue).reduce((sum, val) => sum + val, 0)
                        const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
                        let currentAngle = 0
                        
                        return (
                          <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              {Object.entries(hotelRevenue).slice(0, 5).map(([hotel, revenue], index) => {
                                const percentage = total > 0 ? revenue / total : 0
                                const dashArray = `${percentage * 251.2} 251.2`
                                const dashOffset = -currentAngle * 251.2 / 100
                                currentAngle += percentage * 100
                                return (
                                  <circle
                                    key={hotel}
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke={colors[index % colors.length]}
                                    strokeWidth="20"
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={dashOffset}
                                    className="transition-all hover:opacity-80 cursor-pointer"
                                  />
                                )
                              })}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-700">${total.toLocaleString()}</div>
                                <div className="text-sm text-gray-500">Total</div>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="mt-4 space-y-2">
                    {(() => {
                      const hotelRevenue: { [key: string]: number } = {}
                      bookings.forEach(b => {
                        const hotel = b.hotelName || 'Unknown'
                        const amount = b.totalPrice || b.price || (b as any).total || (b as any).amount || 0
                        hotelRevenue[hotel] = (hotelRevenue[hotel] || 0) + amount
                      })
                      const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
                      return Object.entries(hotelRevenue).slice(0, 5).map(([hotel, revenue], index) => (
                        <div key={hotel} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
                            <span className="text-gray-700">{hotel}</span>
                          </div>
                          <span className="font-medium text-gray-900">${revenue.toLocaleString()}</span>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'users' && subAdminData?.permissions?.viewUsers && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Users</h2>
                <button onClick={fetchUsers} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                  🔄 Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-blue-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.phone || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isMember ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {user.isMember ? '✓ Member' : 'Guest'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-purple-600">{user.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeSection === 'bookings' && subAdminData?.permissions?.viewBookings && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bookings</h2>
                <button onClick={fetchBookings} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                  🔄 Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-blue-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">#{booking._id.slice(-6)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {(() => {
                              const b = booking as any
                              return b.userId?.name || b.guest?.name || b.customerName || b.guestName || 'Guest User'
                            })()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{booking.hotelName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.checkIn).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{booking.guests}</td>
                          <td className="px-6 py-4 text-sm font-medium text-purple-600">
                            ${booking.totalPrice || booking.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeSection === 'transactions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Transactions {subAdminData?.location && `- ${subAdminData.location}`}
                </h2>
                <button onClick={fetchBookings} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                  🔄 Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            {subAdminData?.location 
                              ? `No transactions found for ${subAdminData.location}` 
                              : 'No transactions found'}
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-blue-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{booking._id.slice(-6)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {(() => {
                                const b = booking as any
                                return b.userId?.name || b.guest?.name || b.customerName || b.guestName || 'Guest User'
                              })()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{booking.hotelName}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.checkIn).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{booking.guests}</td>
                            <td className="px-6 py-4 text-sm font-medium text-purple-600">
                              ${(() => {
                                const total = booking.totalPrice || booking.price || (booking as any).total || (booking as any).amount || 0
                                return total.toLocaleString()
                              })()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeSection === 'hotels' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Hotels Management {subAdminData?.location && `- ${subAdminData.location}`}
                </h2>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    ✨ Add New Hotel
                  </button>
                  <button onClick={fetchHotels} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {hotels.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xl font-medium mb-2">
                        {subAdminData?.location 
                          ? `No hotels found in ${subAdminData.location}` 
                          : 'No hotels found'}
                      </p>
                      <p className="text-gray-400 mb-6">Add your first hotel to get started</p>
                      <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium">
                        ✨ Add Your First Hotel
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hotels.map((hotel) => (
                        <div key={hotel._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group" onClick={() => handleHotelClick(hotel)}>
                          {/* Hotel Image */}
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={hotel.image} 
                              alt={hotel.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Hotel+Image'
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute top-4 right-4">
                              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                <span className="text-yellow-500">⭐</span>
                                <span className="text-sm font-bold text-gray-800">{hotel.rating}</span>
                              </div>
                            </div>
                            <div className="absolute bottom-4 left-4">
                              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                ${hotel.price}/night
                              </div>
                            </div>
                          </div>
                          
                          {/* Hotel Details */}
                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
                              <div className="flex items-center gap-2 text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm font-medium">{hotel.location}</span>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleHotelClick(hotel); }}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm font-medium"
                              >
                                ✏️ Edit
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteHotel(hotel._id); }}
                                className="bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>
      
      {/* Enhanced Hotel Edit Modal */}
      {showHotelModal && editingHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">✨ Edit Hotel</h3>
                  <p className="text-blue-100 text-sm mt-1">Update hotel information and settings</p>
                </div>
                <button onClick={() => setShowHotelModal(false)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">🏨 Hotel Name</label>
                    <input
                      type="text"
                      value={editingHotel.name}
                      onChange={(e) => setEditingHotel({...editingHotel, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter hotel name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">📍 Location</label>
                    <input
                      type="text"
                      value={editingHotel.location}
                      onChange={(e) => setEditingHotel({...editingHotel, location: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter location"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">💰 Price/Night</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500 font-medium">$</span>
                        <input
                          type="number"
                          value={editingHotel.price}
                          onChange={(e) => setEditingHotel({...editingHotel, price: Number(e.target.value)})}
                          className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">⭐ Rating</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={editingHotel.rating}
                        onChange={(e) => setEditingHotel({...editingHotel, rating: Number(e.target.value)})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="4.5"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">🖼️ Image URL</label>
                    <input
                      type="url"
                      value={editingHotel.image}
                      onChange={(e) => setEditingHotel({...editingHotel, image: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  {/* Image Preview */}
                  {editingHotel.image && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Preview</label>
                      <div className="relative overflow-hidden rounded-xl border-2 border-gray-200">
                        <img 
                          src={editingHotel.image} 
                          alt="Hotel preview" 
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleUpdateHotel}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-bold text-lg"
                >
                  ✅ Update Hotel
                </button>
                <button
                  onClick={() => setShowHotelModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-bold text-lg"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Add Hotel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">✨ Add New Hotel</h3>
                  <p className="text-green-100 text-sm mt-1">Create a new hotel listing</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">🏨 Hotel Name</label>
                    <input
                      type="text"
                      value={newHotel.name}
                      onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter hotel name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">📍 Location</label>
                    <input
                      type="text"
                      value={newHotel.location}
                      onChange={(e) => setNewHotel({...newHotel, location: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter location"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">💰 Price/Night</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500 font-medium">$</span>
                        <input
                          type="number"
                          value={newHotel.price}
                          onChange={(e) => setNewHotel({...newHotel, price: Number(e.target.value)})}
                          className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">⭐ Rating</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={newHotel.rating}
                        onChange={(e) => setNewHotel({...newHotel, rating: Number(e.target.value)})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="4.5"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">🖼️ Image URL</label>
                    <input
                      type="url"
                      value={newHotel.image}
                      onChange={(e) => setNewHotel({...newHotel, image: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  {/* Image Preview */}
                  {newHotel.image && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Preview</label>
                      <div className="relative overflow-hidden rounded-xl border-2 border-gray-200">
                        <img 
                          src={newHotel.image} 
                          alt="Hotel preview" 
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleAddHotel}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-bold text-lg"
                >
                  ✅ Add Hotel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-bold text-lg"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />
    </div>
  )
}
