import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import toast, { Toaster } from 'react-hot-toast'
import NotificationCenter from '../components/NotificationCenter'
import { getNotifications, addNotification } from '../utils/notificationCenter'

interface ExclusiveHotel {
  id: string
  name: string
  location: string
  price: number
  image: string
  rating: number
  exclusive: boolean
}

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  isMember: boolean
  membershipTier?: string
  membershipId?: string
  points: number
  createdAt: string
}

interface Booking {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
    phone?: string
  } | string
  hotelName: string
  checkIn: string
  checkOut: string
  guests: number
  price: number
  totalPrice?: number
  status?: string
  createdAt: string
}

interface SubAdmin {
  _id: string
  name: string
  username: string
  email: string
  phone?: string
  permissions: {
    viewUsers: boolean
    viewBookings: boolean
    viewRevenue: boolean
    manageHotels: boolean
  }
  isActive: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  
  // CRITICAL: Block sub-admins immediately
  const adminType = localStorage.getItem('adminType')
  if (adminType === 'subadmin') {
    window.location.href = '/subadmin-dashboard'
    return null
  }
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [exclusiveHotels, setExclusiveHotels] = useState<ExclusiveHotel[]>([])
  const [activeSection, setActiveSection] = useState('dashboard')
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [revenueBreakdown, setRevenueBreakdown] = useState<any>({})
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null)
  const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'purple')
  const [darkMode, setDarkMode] = useState(localStorage.getItem('adminDarkMode') === 'true')
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || 'Admin')
  const [adminAvatar, setAdminAvatar] = useState(localStorage.getItem('adminAvatar') || 'A')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [paidMembers, setPaidMembers] = useState<any[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [totalBookings, setTotalBookings] = useState(0)
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([])
  const [hotels, setHotels] = useState<any[]>([])
  const [filteredHotels, setFilteredHotels] = useState<any[]>([])
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [pageViews, setPageViews] = useState(() => {
    const saved = localStorage.getItem('adminPageViews')
    return saved ? parseInt(saved) : 45
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPage, setOrdersPage] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [paginatedOrders, setPaginatedOrders] = useState<any[]>([])
  const itemsPerPage = 10
  const ordersPerPage = 10
  const [dailyViews, setDailyViews] = useState(() => {
    const today = new Date().toDateString()
    const saved = localStorage.getItem('adminDailyViews')
    const savedData = saved ? JSON.parse(saved) : { date: today, views: 0 }
    
    // Reset daily views if it's a new day
    if (savedData.date !== today) {
      return { date: today, views: 0 }
    }
    return savedData
  })
  const [adminTypeState, setAdminTypeState] = useState(adminType || 'super')
  const [currentHotel, setCurrentHotel] = useState(() => {
    const hotel = localStorage.getItem('currentHotel')
    return hotel ? JSON.parse(hotel) : null
  })
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [transactionLoading, setTransactionLoading] = useState(false)

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

  // Helper function for authenticated API requests
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('adminToken')
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = localStorage.getItem('adminAuth') === 'true'
      const token = localStorage.getItem('adminToken')
      
      // Double-check: Block sub-admins
      if (adminType === 'subadmin') {
        window.location.href = '/subadmin-dashboard'
        return
      }
      
      if (!isAuthenticated || !token) {
        navigate('/admin-login')
        return
      }

      // Verify token with backend
      try {
        const response = await fetch('http://localhost:5000/api/admin/database', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          // Token is invalid or expired
          localStorage.removeItem('adminAuth')
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminType')
          localStorage.removeItem('currentHotel')
          navigate('/admin-login')
          return
        }
      } catch (error) {
        // Network error or token validation failed
        localStorage.removeItem('adminAuth')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminType')
        localStorage.removeItem('currentHotel')
        navigate('/admin-login')
        return
      }

      // Fetch hotels from database
      fetchHotels()

      // If hotel admin, set hotel data
      if (adminType === 'hotel' && currentHotel) {
        // Filter data for this hotel only
        setActiveSection('hotel-dashboard')
      }

      const saved = localStorage.getItem('exclusiveHotels')
      if (saved) {
        setExclusiveHotels(JSON.parse(saved))
      }

      // Increment page views on dashboard load
      const newPageViews = pageViews + 1
      setPageViews(newPageViews)
      localStorage.setItem('adminPageViews', newPageViews.toString())
      
      // Update daily views
      const today = new Date().toDateString()
      const newDailyViews = { date: today, views: dailyViews.views + 1 }
      setDailyViews(newDailyViews)
      localStorage.setItem('adminDailyViews', JSON.stringify(newDailyViews))
    }

    checkAuthentication()

    // Socket.io connection for real-time notifications
    const socket = io('http://localhost:5000')
    
    socket.on('connect', () => {
      console.log('✅ Connected to notification server')
    })
    
    socket.on('newBooking', (data) => {
      const bookingMsg = `New Booking: ${data.booking.hotelName} - Customer: ${data.booking.customerName} - Amount: $${data.booking.amount}`
      
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
      if (activeSection === 'dashboard' || activeSection === 'transactions') {
        fetchBookings(currentPage)
      }
    })

    // Close profile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.profile-menu-container') && !target.closest('.profile-dropdown')) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      socket.disconnect()
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navigate])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/users')
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPaidMembers = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/members')
      const data = await response.json()
      if (data.success) {
        setPaidMembers(data.members)
      }
    } catch (error) {
      console.error('Error fetching paid members:', error)
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
        setHotels(data.hotels)
        setFilteredHotels(data.hotels)
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location)
    if (location === 'all') {
      setFilteredHotels(hotels)
    } else {
      setFilteredHotels(hotels.filter(hotel => hotel.location.toLowerCase() === location.toLowerCase()))
    }
  }

  const getUniqueLocations = () => {
    const locations = hotels.map(hotel => hotel.location)
    return ['all', ...Array.from(new Set(locations))]
  }

  const fetchBookings = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/admin/all?page=${page}&limit=${itemsPerPage}`)
      const data = await response.json()
      if (data.success) {
        console.log('Bookings data:', data.bookings)
        
        let filteredBookings = data.bookings
        
        // Filter bookings for hotel admin
        if (adminType === 'hotel' && currentHotel) {
          filteredBookings = data.bookings.filter((booking: any) => 
            booking.hotelName === currentHotel.name || 
            booking.room?.hotelName === currentHotel.name
          )
        }
        
        setBookings(filteredBookings)
        setTotalBookings(data.total || data.bookings.length)
        setTotalOrders(data.total || data.bookings.length)
        fetchPaginatedOrders(1, filteredBookings)
        
        // Calculate total revenue and breakdown
        let totalRev = 0
        const breakdown = {
          hotels: { total: 0, bookings: [] },
          aircraft: { total: 0, bookings: [] },
          cars: { total: 0, bookings: [] },
          dining: { total: 0, bookings: [] },
          entertainment: { total: 0, bookings: [] },
          other: { total: 0, bookings: [] }
        }
        
        filteredBookings.forEach((booking: any) => {
          const amount = booking.total || booking.totalPrice || booking.price || booking.amount || 0
          const numAmount = isNaN(amount) ? 0 : Number(amount)
          totalRev += numAmount
          
          // Categorize by hotel name or service type
          const hotelName = booking.hotelName?.toLowerCase() || ''
          if (hotelName.includes('aircraft') || hotelName.includes('jet') || hotelName.includes('flight') || hotelName.includes('plane')) {
            breakdown.aircraft.total += numAmount
            breakdown.aircraft.bookings.push(booking)
          } else if (hotelName.includes('car') || hotelName.includes('rental') || hotelName.includes('vehicle') || hotelName.includes('auto')) {
            breakdown.cars.total += numAmount
            breakdown.cars.bookings.push(booking)
          } else if (hotelName.includes('dining') || hotelName.includes('restaurant') || hotelName.includes('food') || hotelName.includes('cafe') || hotelName.includes('bistro')) {
            breakdown.dining.total += numAmount
            breakdown.dining.bookings.push(booking)
          } else if (hotelName.includes('entertainment') || hotelName.includes('show') || hotelName.includes('event') || hotelName.includes('theater') || hotelName.includes('concert')) {
            breakdown.entertainment.total += numAmount
            breakdown.entertainment.bookings.push(booking)
          } else {
            // Default to hotels for everything else (most bookings will be hotels)
            breakdown.hotels.total += numAmount
            breakdown.hotels.bookings.push(booking)
          }
        })
        
        setTotalRevenue(totalRev)
        setRevenueBreakdown(breakdown)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubAdmins = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/subadmin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setSubAdmins(data.subAdmins)
      }
    } catch (error) {
      console.error('Error fetching sub-admins:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers()
    } else if (activeSection === 'paid-members') {
      fetchPaidMembers()
    } else if (activeSection === 'transactions') {
      fetchBookings()
    } else if (activeSection === 'database') {
      fetchHotels()
    } else if (activeSection === 'subadmins') {
      fetchSubAdmins()
    } else if (activeSection === 'dashboard') {
      fetchBookings() // Fetch bookings for revenue calculation
      fetchUsers() // Fetch users for user count
      fetchHotels() // Fetch hotels from database
    }
    
    // Increment page views when switching sections
    if (activeSection !== 'dashboard') {
      const newPageViews = pageViews + Math.floor(Math.random() * 3) + 1
      setPageViews(newPageViews)
      localStorage.setItem('adminPageViews', newPageViews.toString())
    }
  }, [activeSection])

  const getThemeColors = () => {
    switch (theme) {
      case 'blue': return { primary: 'from-blue-600 to-cyan-600', light: 'from-blue-50 to-cyan-50', accent: 'blue' }
      case 'green': return { primary: 'from-green-600 to-emerald-600', light: 'from-green-50 to-emerald-50', accent: 'green' }
      case 'red': return { primary: 'from-red-600 to-pink-600', light: 'from-red-50 to-pink-50', accent: 'red' }
      case 'orange': return { primary: 'from-orange-600 to-yellow-600', light: 'from-orange-50 to-yellow-50', accent: 'orange' }
      default: return { primary: 'from-purple-600 to-blue-600', light: 'from-purple-50 to-blue-50', accent: 'purple' }
    }
  }

  const themeColors = getThemeColors()

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem('adminTheme', newTheme)
  }

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('adminDarkMode', newDarkMode.toString())
    
    // Add smooth transition effect
    document.documentElement.style.transition = 'all 0.3s ease-in-out'
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 300)
  }

  const handleProfileUpdate = () => {
    localStorage.setItem('adminName', adminName)
    localStorage.setItem('adminAvatar', adminAvatar)
    alert('Profile updated successfully!')
  }

  const fetchPaginatedOrders = (page: number, allBookings = bookings) => {
    const skip = (page - 1) * ordersPerPage
    const sortedBookings = [...allBookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const paginatedData = sortedBookings.slice(skip, skip + ordersPerPage)
    
    const orders = paginatedData.map(booking => {
      // Use the exact field names from backend
      let customerName = 'Guest User'
      
      // Check userId first (populated user object)
      if (typeof booking.userId === 'object' && booking.userId?.name) {
        customerName = booking.userId.name
      }
      // Then check guest object
      else if ((booking as any).guest?.name) {
        customerName = (booking as any).guest.name
      }
      // Then check direct name fields
      else if ((booking as any).customerName) {
        customerName = (booking as any).customerName
      }
      else if ((booking as any).guestName) {
        customerName = (booking as any).guestName
      }
      
      console.log('Booking customer name:', customerName, 'from booking:', booking)
      
      return {
        id: `#${booking._id.slice(-6)}`,
        customer: customerName,
        product: booking.hotelName,
        amount: (booking as any).total || booking.totalPrice || booking.price || (booking as any).amount || 0,
        status: (booking as any).status || 'Completed',
        date: new Date(booking.createdAt).toLocaleDateString()
      }
    })
    
    setPaginatedOrders(orders)
  }

  const handleOrdersPageChange = (page: number) => {
    setOrdersPage(page)
    fetchPaginatedOrders(page)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminType')
    localStorage.removeItem('currentHotel')
    navigate('/admin-login')
  }

  const fetchTransactionDetails = async (bookingId: string) => {
    setTransactionLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/payment/transaction/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setSelectedTransaction(data.transaction)
        setShowTransactionModal(true)
      } else {
        alert('❌ ' + (data.message || 'Failed to fetch transaction details'))
      }
    } catch (error) {
      console.error('Transaction fetch error:', error)
      alert('❌ Error fetching transaction details')
    } finally {
      setTransactionLoading(false)
    }
  }

  const formatDateTime = (timestamp: number | string) => {
    const date = new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className={`flex h-screen transition-all duration-500 ease-in-out ${darkMode ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'}`}>
      <Toaster />
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-500 ease-in-out flex flex-col shadow-xl ${darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'}`}>
        <div className={`p-6 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
          <h1 className={`font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen ? '✨ The Grand Stay' : '✨'}
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveSection('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeSection === 'dashboard' 
              ? `bg-gradient-to-r ${themeColors.primary} text-white shadow-lg transform hover:scale-105` 
              : `text-gray-600 hover:bg-gradient-to-r hover:${themeColors.light}`
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          
          <button onClick={() => adminType === 'hotel' ? setActiveSection('hotel-profile') : navigate('/normal-hotels-dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            (adminType === 'hotel' && activeSection === 'hotel-profile') || (adminType === 'super' && false)
              ? `bg-gradient-to-r ${themeColors.primary} text-white shadow-lg transform hover:scale-105`
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {sidebarOpen && <span>{adminType === 'hotel' ? 'My Hotel' : 'Hotels'}</span>}
          </button>

          <button onClick={() => setActiveSection('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${adminType === 'hotel' ? 'hidden' : activeSection === 'users' 
              ? `bg-gradient-to-r ${themeColors.primary} text-white shadow-lg transform hover:scale-105` 
              : `text-gray-600 hover:bg-gradient-to-r hover:${themeColors.light}`
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {sidebarOpen && <span>Users</span>}
          </button>

          <button onClick={() => setActiveSection('paid-members')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${adminType === 'hotel' ? 'hidden' : activeSection === 'paid-members' 
              ? `bg-gradient-to-r ${themeColors.primary} text-white shadow-lg transform hover:scale-105` 
              : `text-gray-600 hover:bg-gradient-to-r hover:${themeColors.light}`
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {sidebarOpen && <span>Paid Members</span>}
          </button>

          <button onClick={() => setActiveSection('transactions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeSection === 'transactions' 
              ? `bg-gradient-to-r ${themeColors.primary} text-white shadow-lg transform hover:scale-105` 
              : `text-gray-600 hover:bg-gradient-to-r hover:${themeColors.light}`
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {sidebarOpen && <span>Transactions</span>}
          </button>

          <button onClick={() => setActiveSection('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${adminType === 'hotel' ? 'hidden' : activeSection === 'settings' 
              ? `bg-gradient-to-r ${themeColors.primary} text-white shadow-lg transform hover:scale-105` 
              : `text-gray-600 hover:bg-gradient-to-r hover:${themeColors.light}`
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {sidebarOpen && <span>Settings</span>}
          </button>

          <button onClick={() => setActiveSection('subadmins')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${adminType === 'hotel' ? 'hidden' : activeSection === 'subadmins' 
              ? `bg-gradient-to-r ${themeColors.primary} text-white shadow-lg transform hover:scale-105` 
              : `text-gray-600 hover:bg-gradient-to-r hover:${themeColors.light}`
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {sidebarOpen && <span>Sub Admins</span>}
          </button>

          <button onClick={() => setActiveSection('database')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${adminType === 'hotel' ? 'hidden' : activeSection === 'database' 
              ? `bg-gradient-to-r ${themeColors.primary} text-white shadow-lg transform hover:scale-105` 
              : `text-gray-600 hover:bg-gradient-to-r hover:${themeColors.light}`
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            {sidebarOpen && <span>Database</span>}
          </button>
        </nav>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-4 ${darkMode ? 'border-t border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-t border-gray-200 text-gray-600 hover:bg-gray-100'} transition-all duration-200`}>
          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className={`backdrop-blur-lg px-6 py-4 shadow-sm transition-all duration-300 ${darkMode ? 'bg-gray-800/80 border-b border-gray-700' : 'bg-white/80 border-b border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back, {adminName} 👋</p>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/normal-hotels-dashboard')} className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${adminType === 'hotel' ? 'hidden' : ''}`}>
                + New Hotel
              </button>
              
              <button onClick={() => setShowNotificationCenter(true)} className={`relative p-2 rounded-lg transition-all duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <div className={`flex items-center gap-3 pl-4 ${darkMode ? 'border-l border-gray-700' : 'border-l border-gray-200'}`}>
                <div className="text-right">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{adminName}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Administrator</p>
                </div>
                <div className="relative profile-menu-container">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className={`w-10 h-10 bg-gradient-to-r ${themeColors.primary} rounded-full flex items-center justify-center text-white font-bold hover:shadow-lg transform hover:scale-110 transition-all duration-200`}
                  >
                    {adminAvatar}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className={`flex-1 overflow-y-auto p-6 transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-transparent via-gray-800/30 to-gray-900/30' : 'bg-gradient-to-br from-transparent via-purple-50/30 to-blue-50/30'}`}>
          {/* Hotel Admin Header - Improved Design */}
          {adminType === 'hotel' && currentHotel && (
            <div className={`mb-6 p-6 rounded-2xl shadow-lg transition-all duration-500 ${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {currentHotel.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentHotel.name}</h2>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                        📍 {currentHotel.location}
                      </span>
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                        ⭐ {currentHotel.rating} Rating
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
                        Hotel Admin
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back!</div>
                  <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Manage Your Hotel</div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'dashboard' && (
            <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Dashboard Overview</h2>
            <p className="text-sm text-gray-500">Welcome back, Admin 👋</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div onClick={() => setActiveSection('revenue')} className={`rounded-xl p-6 shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 cursor-pointer ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+12.5%</span>
              </div>
              <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>${totalRevenue.toLocaleString()}</p>
            </div>

            <div onClick={() => setActiveSection('users')} className={`rounded-xl p-6 shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+8.2%</span>
              </div>
              <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Users</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{users.length}</p>
            </div>

            <div onClick={() => setActiveSection('transactions')} className={`rounded-xl p-6 shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+15.3%</span>
              </div>
              <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{bookings.length}</p>
            </div>

            <div onClick={() => setActiveSection('analytics')} className={`rounded-xl p-6 shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  pageViews > (JSON.parse(localStorage.getItem('adminPageViews') || '45678') - 100) 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-red-600 bg-red-50'
                }`}>
                  {pageViews > (JSON.parse(localStorage.getItem('adminPageViews') || '45678') - 100) ? '+' : '-'}
                  {Math.abs(pageViews - (JSON.parse(localStorage.getItem('adminPageViews') || '45678') - 100))}%
                </span>
              </div>
              <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Page Views</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pageViews.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Today: +{dailyViews.views}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className={`rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Revenue Overview</h3>
                <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'}`}>Last 6 months</span>
              </div>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                <div className="w-full h-full p-4">
                  <div className="flex justify-between items-end h-full">
                    {/* Simple Bar Chart */}
                    <div className="flex items-end space-x-2 h-full w-full">
                      <div className="flex flex-col items-center">
                        <div className="bg-purple-500 rounded-t" style={{height: `${Math.max(20, (revenueBreakdown.hotels?.total || 0) / totalRevenue * 200)}px`, width: '40px'}}></div>
                        <span className="text-xs mt-1 text-gray-600">Hotels</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-500 rounded-t" style={{height: `${Math.max(20, (revenueBreakdown.aircraft?.total || 0) / totalRevenue * 200)}px`, width: '40px'}}></div>
                        <span className="text-xs mt-1 text-gray-600">Aircraft</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-green-500 rounded-t" style={{height: `${Math.max(20, (revenueBreakdown.cars?.total || 0) / totalRevenue * 200)}px`, width: '40px'}}></div>
                        <span className="text-xs mt-1 text-gray-600">Cars</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-orange-500 rounded-t" style={{height: `${Math.max(20, (revenueBreakdown.dining?.total || 0) / totalRevenue * 200)}px`, width: '40px'}}></div>
                        <span className="text-xs mt-1 text-gray-600">Dining</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-pink-500 rounded-t" style={{height: `${Math.max(20, (revenueBreakdown.entertainment?.total || 0) / totalRevenue * 200)}px`, width: '40px'}}></div>
                        <span className="text-xs mt-1 text-gray-600">Entertainment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sales by Category</h3>
                <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'}`}>This month</span>
              </div>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <div className="w-full h-full p-4 flex items-center justify-center">
                  {/* Simple Pie Chart */}
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Hotels */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="20" 
                        strokeDasharray={`${(revenueBreakdown.hotels?.total || 0) / totalRevenue * 251.2} 251.2`} 
                        strokeDashoffset="0" />
                      {/* Aircraft */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" 
                        strokeDasharray={`${(revenueBreakdown.aircraft?.total || 0) / totalRevenue * 251.2} 251.2`} 
                        strokeDashoffset={`-${(revenueBreakdown.hotels?.total || 0) / totalRevenue * 251.2}`} />
                      {/* Cars */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" 
                        strokeDasharray={`${(revenueBreakdown.cars?.total || 0) / totalRevenue * 251.2} 251.2`} 
                        strokeDashoffset={`-${((revenueBreakdown.hotels?.total || 0) + (revenueBreakdown.aircraft?.total || 0)) / totalRevenue * 251.2}`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-700">${totalRevenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Total Revenue</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Orders Table */}
          <div className={`rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700 bg-gradient-to-r from-gray-700 to-gray-600' : 'border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total Orders</h3>
                <div className="flex items-center gap-3">
                  <button onClick={() => fetchBookings()} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    🔄 Refresh
                  </button>
                  {totalOrders > ordersPerPage && (
                    <select 
                      value={ordersPage}
                      onChange={(e) => handleOrdersPageChange(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Array.from({ length: Math.ceil(totalOrders / ordersPerPage) }, (_, i) => i + 1).map(page => {
                        const start = (page - 1) * ordersPerPage + 1
                        const end = Math.min(page * ordersPerPage, totalOrders)
                        return (
                          <option key={page} value={page}>{start}-{end}</option>
                        )
                      })}
                    </select>
                  )}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Order ID</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Customer</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Product</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Amount</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Date</th>
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`px-6 py-8 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr key={order.id} onClick={() => alert(`Order ${order.id} details: ${order.customer} - ${order.product}`)} className={`transition-all duration-200 cursor-pointer ${darkMode ? 'hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50' : 'hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50'}`}>
                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{order.id}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{order.customer}</td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{order.product}</td>
                        <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>${order.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'Completed' || order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            order.status === 'Pending' || order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status === 'confirmed' ? 'Completed' : order.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{order.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
            </>
          )}

          {/* Users Section */}
          {activeSection === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">User Management</h2>
                <button onClick={fetchUsers} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  🔄 Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                  </div>
                </div>
              ) : (
                <div className={`rounded-xl shadow-sm overflow-hidden transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <tr>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Name</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Email</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Phone</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Member</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Tier</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Points</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Joined</th>
                        </tr>
                      </thead>
                      <tbody className={`transition-all duration-300 ${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={7} className={`px-6 py-8 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              No users found
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr key={user._id} className={`transition-all duration-300 ${darkMode ? 'hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50' : 'hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50'}`}>
                              <td className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.phone || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  user.isMember ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {user.isMember ? '✓ Member' : 'Guest'}
                                </span>
                              </td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.membershipTier || 'N/A'}</td>
                              <td className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{user.points}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paid Members Section */}
          {activeSection === 'paid-members' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Paid Members</h2>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Members who have purchased premium memberships</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total: </span>
                    <span className={`text-lg font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{paidMembers.length}</span>
                  </div>
                  <button onClick={fetchPaidMembers} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading paid members...</p>
                  </div>
                </div>
              ) : (
                <div className={`rounded-xl shadow-sm overflow-hidden transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <tr>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Member ID</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Name</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Email</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Phone</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Tier</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Points</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Payment Method</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Joined</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Expires</th>
                        </tr>
                      </thead>
                      <tbody className={`transition-all duration-300 ${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                        {paidMembers.length === 0 ? (
                          <tr>
                            <td colSpan={9} className={`px-6 py-8 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              No paid members found
                            </td>
                          </tr>
                        ) : (
                          paidMembers.map((member) => (
                            <tr key={member._id} className={`transition-all duration-300 ${darkMode ? 'hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50' : 'hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50'}`}>
                              <td className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                <span className={`px-2 py-1 rounded-full text-xs font-mono ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                                  {member.membershipId}
                                </span>
                              </td>
                              <td className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{member.name}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{member.email}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{member.phone || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  member.tier === 'Diamond' ? 'bg-purple-100 text-purple-700' :
                                  member.tier === 'Platinum' ? 'bg-gray-100 text-gray-700' :
                                  member.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                                  member.tier === 'Silver' ? 'bg-gray-100 text-gray-600' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  💎 {member.tier}
                                </span>
                              </td>
                              <td className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{member.points || 0}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${
                                  member.paymentMethod === 'paypal' ? 'bg-blue-100 text-blue-700' :
                                  member.paymentMethod === 'razorpay' ? 'bg-purple-100 text-purple-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {member.paymentMethod === 'paypal' ? (
                                    <>
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M7.016 19.625h-4.375a.469.469 0 0 1-.469-.469V4.844c0-.259.21-.469.469-.469h4.375c3.727 0 6.75 3.023 6.75 6.75s-3.023 6.75-6.75 6.75zm0 0h4.969c3.727 0 6.75-3.023 6.75-6.75S15.712 6.125 11.985 6.125H7.016m0 13.5V6.125m0 13.5c-3.727 0-6.75-3.023-6.75-6.75S3.289 6.125 7.016 6.125" fill="#003087"/>
                                        <path d="M7.016 19.625h4.969c3.727 0 6.75-3.023 6.75-6.75S15.712 6.125 11.985 6.125H7.016c3.727 0 6.75 3.023 6.75 6.75s-3.023 6.75-6.75 6.75z" fill="#0070ba"/>
                                      </svg>
                                      PayPal
                                    </>
                                  ) : member.paymentMethod === 'razorpay' ? (
                                    <>
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.436 0H1.564C.7 0 0 .7 0 1.564v20.872C0 23.3.7 24 1.564 24h20.872c.864 0 1.564-.7 1.564-1.564V1.564C24 .7 23.3 0 22.436 0zM7.735 18.259L5.667 8.297h3.274l1.026 6.202L12.5 8.297h3.274L7.735 18.259zm9.53-6.202c0 2.16-1.728 3.888-3.888 3.888s-3.888-1.728-3.888-3.888 1.728-3.888 3.888-3.888 3.888 1.728 3.888 3.888z" fill="#072654"/>
                                      </svg>
                                      Razorpay
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                      </svg>
                                      {member.paymentMethod || 'Unknown'}
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(member.createdAt).toLocaleDateString()}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {(() => {
                                  const joinDate = new Date(member.createdAt)
                                  const expiryDate = new Date(joinDate.getFullYear() + 1, joinDate.getMonth(), joinDate.getDate())
                                  const today = new Date()
                                  const isExpired = expiryDate < today
                                  const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                                  
                                  return (
                                    <div className="flex flex-col">
                                      <span className={isExpired ? 'text-red-500 font-medium' : daysLeft <= 30 ? 'text-orange-500 font-medium' : ''}>
                                        {expiryDate.toLocaleDateString()}
                                      </span>
                                      {isExpired ? (
                                        <span className="text-xs text-red-500">Expired</span>
                                      ) : daysLeft <= 30 ? (
                                        <span className="text-xs text-orange-500">{daysLeft} days left</span>
                                      ) : (
                                        <span className="text-xs text-green-500">{daysLeft} days left</span>
                                      )}
                                    </div>
                                  )
                                })()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Revenue Section */}
          {activeSection === 'revenue' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Revenue Breakdown</h2>
                <button onClick={fetchBookings} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  🔄 Refresh
                </button>
              </div>

              {/* Revenue Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">Average Booking</p>
                  <p className="text-2xl font-bold text-gray-900">${bookings.length > 0 ? Math.round(totalRevenue / bookings.length).toLocaleString() : 0}</p>
                </div>
              </div>

              {/* Revenue by Service Type */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue by Service Type</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <button 
                      onClick={() => setSelectedServiceType('hotels')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">🏨</span>
                        </div>
                        <span className="font-medium text-gray-900">Hotels & Resorts</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">${revenueBreakdown.hotels?.total?.toLocaleString() || 0}</span>
                    </button>

                    <button 
                      onClick={() => setSelectedServiceType('aircraft')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 text-sm font-bold">✈️</span>
                        </div>
                        <span className="font-medium text-gray-900">Aircraft & Jets</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">${revenueBreakdown.aircraft?.total?.toLocaleString() || 0}</span>
                    </button>

                    <button 
                      onClick={() => setSelectedServiceType('cars')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm font-bold">🚗</span>
                        </div>
                        <span className="font-medium text-gray-900">Car Rentals</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">${revenueBreakdown.cars?.total?.toLocaleString() || 0}</span>
                    </button>

                    <button 
                      onClick={() => setSelectedServiceType('dining')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 text-sm font-bold">🍽️</span>
                        </div>
                        <span className="font-medium text-gray-900">Dining Services</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">${revenueBreakdown.dining?.total?.toLocaleString() || 0}</span>
                    </button>

                    <button 
                      onClick={() => setSelectedServiceType('entertainment')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-pink-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <span className="text-pink-600 text-sm font-bold">🎭</span>
                        </div>
                        <span className="font-medium text-gray-900">Entertainment</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">${revenueBreakdown.entertainment?.total?.toLocaleString() || 0}</span>
                    </button>

                    <button 
                      onClick={() => setSelectedServiceType('other')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-bold">📦</span>
                        </div>
                        <span className="font-medium text-gray-900">Other Services</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">${revenueBreakdown.other?.total?.toLocaleString() || 0}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Service Revenue View */}
              {selectedServiceType && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedServiceType.charAt(0).toUpperCase() + selectedServiceType.slice(1)} Revenue Details
                      </h3>
                      <button 
                        onClick={() => setSelectedServiceType(null)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        ✕ Close
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {revenueBreakdown[selectedServiceType]?.bookings?.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                              No bookings found for this service type
                            </td>
                          </tr>
                        ) : (
                          revenueBreakdown[selectedServiceType]?.bookings?.map((booking: any) => (
                            <tr key={booking._id} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-all duration-200">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">#{booking._id.slice(-6)}</td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {typeof booking.userId === 'object' && booking.userId?.name 
                                    ? booking.userId.name 
                                    : (booking as any).guest?.name 
                                    ? (booking as any).guest.name
                                    : (booking as any).member?.name
                                    ? (booking as any).member.name
                                    : (booking as any).customerName
                                    ? (booking as any).customerName
                                    : (booking as any).guestName
                                    ? (booking as any).guestName
                                    : (booking as any).name
                                    ? (booking as any).name
                                    : 'Guest User'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {typeof booking.userId === 'object' && booking.userId?.email 
                                    ? booking.userId.email 
                                    : (booking as any).guest?.email
                                    ? (booking as any).guest.email
                                    : (booking as any).member?.email
                                    ? (booking as any).member.email
                                    : (booking as any).customerEmail
                                    ? (booking as any).customerEmail
                                    : (booking as any).guestEmail
                                    ? (booking as any).guestEmail
                                    : (booking as any).email
                                    ? (booking as any).email
                                    : 'No email'}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{booking.hotelName}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-sm font-medium text-purple-600">
                                ${(booking as any).total || booking.totalPrice || booking.price || (booking as any).amount || 'N/A'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hotel Profile Section for Sub-Admins */}
          {activeSection === 'hotel-profile' && adminType === 'hotel' && currentHotel && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">My Hotel Profile</h2>
              </div>

              <div className={`rounded-xl shadow-sm p-6 transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hotel Name</label>
                      <div className={`px-4 py-2 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700 border border-gray-600 text-white' : 'bg-gray-50 border border-gray-300 text-gray-900'}`}>
                        {currentHotel.name}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                      <div className={`px-4 py-2 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700 border border-gray-600 text-white' : 'bg-gray-50 border border-gray-300 text-gray-900'}`}>
                        {currentHotel.location}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price per Night</label>
                      <div className={`px-4 py-2 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700 border border-gray-600 text-white' : 'bg-gray-50 border border-gray-300 text-gray-900'}`}>
                        ${currentHotel.price}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rating</label>
                      <div className={`px-4 py-2 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700 border border-gray-600 text-white' : 'bg-gray-50 border border-gray-300 text-gray-900'}`}>
                        ⭐ {currentHotel.rating}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hotel Image</label>
                    <img src={currentHotel.image} alt={currentHotel.name} className="w-full h-48 object-cover rounded-lg border border-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Settings Section */}
          {activeSection === 'settings' && adminType === 'super' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>Admin Settings</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Theme Settings */}
                <div className={`rounded-xl shadow-sm p-6 transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🎨 Theme Settings</h3>
                  <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Choose your preferred color theme for the admin dashboard</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Purple', value: 'purple', colors: 'from-purple-600 to-blue-600' },
                      { name: 'Blue', value: 'blue', colors: 'from-blue-600 to-cyan-600' },
                      { name: 'Green', value: 'green', colors: 'from-green-600 to-emerald-600' },
                      { name: 'Red', value: 'red', colors: 'from-red-600 to-pink-600' },
                      { name: 'Orange', value: 'orange', colors: 'from-orange-600 to-yellow-600' }
                    ].map((themeOption) => (
                      <button
                        key={themeOption.value}
                        onClick={() => handleThemeChange(themeOption.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          theme === themeOption.value 
                            ? `border-gray-400 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}` 
                            : `${darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'}`
                        }`}
                      >
                        <div className={`w-full h-8 bg-gradient-to-r ${themeOption.colors} rounded mb-2`}></div>
                        <p className={`text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{themeOption.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Settings */}
                <div className={`rounded-xl shadow-sm p-6 transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>👤 Profile Settings</h3>
                  <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Customize your admin profile information</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Admin Name</label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${darkMode ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' : 'border border-gray-300 text-gray-900 placeholder-gray-500'}`}
                        placeholder="Enter admin name"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Avatar Initial</label>
                      <input
                        type="text"
                        value={adminAvatar}
                        onChange={(e) => setAdminAvatar(e.target.value.charAt(0).toUpperCase())}
                        maxLength={1}
                        className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${darkMode ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' : 'border border-gray-300 text-gray-900 placeholder-gray-500'}`}
                        placeholder="A"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 pt-2">
                      <div className={`w-10 h-10 bg-gradient-to-r ${themeColors.primary} rounded-full flex items-center justify-center text-white font-bold`}>
                        {adminAvatar}
                      </div>
                      <span className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Preview</span>
                    </div>
                    
                    <button
                      onClick={handleProfileUpdate}
                      className={`w-full bg-gradient-to-r ${themeColors.primary} text-white py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                    >
                      Update Profile
                    </button>
                  </div>
                </div>

                {/* System Settings */}
                <div className={`rounded-xl shadow-sm p-6 transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>⚙️ System Settings</h3>
                  <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage system preferences and configurations</p>
                  
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div>
                        <p className={`font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</p>
                        <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Receive booking alerts via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div>
                        <p className={`font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Auto Refresh</p>
                        <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Automatically refresh dashboard data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Data Management */}
                <div className={`rounded-xl shadow-sm p-6 transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📊 Data Management</h3>
                  <p className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Export and manage your business data</p>
                  
                  <div className="space-y-3">
                    <button className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${darkMode ? 'bg-blue-900/20 hover:bg-blue-800/30' : 'bg-blue-50 hover:bg-blue-100'}`}>
                      <div className={`font-medium transition-colors duration-300 ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>📥 Export Bookings</div>
                      <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Download all booking data as CSV</div>
                    </button>
                    
                    <button className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${darkMode ? 'bg-green-900/20 hover:bg-green-800/30' : 'bg-green-50 hover:bg-green-100'}`}>
                      <div className={`font-medium transition-colors duration-300 ${darkMode ? 'text-green-400' : 'text-green-900'}`}>📈 Export Revenue Report</div>
                      <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Generate detailed revenue analysis</div>
                    </button>
                    
                    <button className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${darkMode ? 'bg-purple-900/20 hover:bg-purple-800/30' : 'bg-purple-50 hover:bg-purple-100'}`}>
                      <div className={`font-medium transition-colors duration-300 ${darkMode ? 'text-purple-400' : 'text-purple-900'}`}>👥 Export User Data</div>
                      <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Download user and member information</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Section */}
          {activeSection === 'transactions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Transactions & Bookings</h2>
                <div className="flex items-center gap-3">
                  {totalBookings > itemsPerPage && (
                    <select 
                      value={currentPage}
                      onChange={(e) => { setCurrentPage(Number(e.target.value)); fetchBookings(Number(e.target.value)); }}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Array.from({ length: Math.ceil(totalBookings / itemsPerPage) }, (_, i) => i + 1).map(page => {
                        const start = (page - 1) * itemsPerPage + 1
                        const end = Math.min(page * itemsPerPage, totalBookings)
                        return (
                          <option key={page} value={page}>{start}-{end}</option>
                        )
                      })}
                    </select>
                  )}
                  <button onClick={() => fetchBookings(currentPage)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading bookings...</p>
                  </div>
                </div>
              ) : (
                <div className={`rounded-xl shadow-sm overflow-hidden transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <tr>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Booking ID</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Customer</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Hotel</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Room Type</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Check-In</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Check-Out</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Guests</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Payment Method</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Date</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Payment</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`transition-all duration-300 ${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan={12} className={`px-6 py-8 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              No bookings found
                            </td>
                          </tr>
                        ) : (
                          bookings.map((booking) => (
                            <tr key={booking._id} className={`transition-all duration-300 ${darkMode ? 'hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50' : 'hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50'}`}>
                              <td className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>#{booking._id.slice(-6)}</td>
                              <td className="px-6 py-4">
                                <div className={`text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {(() => {
                                    if (typeof booking.userId === 'object' && booking.userId?.name) return booking.userId.name
                                    if ((booking as any).guest?.name) return (booking as any).guest.name
                                    if ((booking as any).customerName) return (booking as any).customerName
                                    if ((booking as any).guestName) return (booking as any).guestName
                                    return 'Guest User'
                                  })()}
                                </div>
                                <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                  {typeof booking.userId === 'object' && booking.userId?.email 
                                    ? booking.userId.email 
                                    : (booking as any).guest?.email
                                    ? (booking as any).guest.email
                                    : (booking as any).customerEmail
                                    ? (booking as any).customerEmail
                                    : (booking as any).guestEmail
                                    ? (booking as any).guestEmail
                                    : (booking as any).email
                                    ? (booking as any).email
                                    : 'No email'}
                                </div>
                              </td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{booking.hotelName}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {(booking as any).room?.title || (booking as any).roomTitle || 'Standard Room'}
                              </td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(booking.checkIn).toLocaleDateString()}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(booking.checkOut).toLocaleDateString()}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{booking.guests}</td>
                              <td className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                ${(booking as any).total || booking.totalPrice || booking.price || (booking as any).amount || 'N/A'}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${
                                  (booking as any).paymentMethod === 'paypal' ? 'bg-blue-100 text-blue-700' :
                                  (booking as any).paymentMethod === 'razorpay' ? 'bg-purple-100 text-purple-700' :
                                  (booking as any).paymentMethod === 'stripe' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {(booking as any).paymentMethod === 'paypal' ? (
                                    <>
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M7.016 19.625h-4.375a.469.469 0 0 1-.469-.469V4.844c0-.259.21-.469.469-.469h4.375c3.727 0 6.75 3.023 6.75 6.75s-3.023 6.75-6.75 6.75zm0 0h4.969c3.727 0 6.75-3.023 6.75-6.75S15.712 6.125 11.985 6.125H7.016m0 13.5V6.125m0 13.5c-3.727 0-6.75-3.023-6.75-6.75S3.289 6.125 7.016 6.125" fill="#003087"/>
                                        <path d="M7.016 19.625h4.969c3.727 0 6.75-3.023 6.75-6.75S15.712 6.125 11.985 6.125H7.016c3.727 0 6.75 3.023 6.75 6.75s-3.023 6.75-6.75 6.75z" fill="#0070ba"/>
                                      </svg>
                                      PayPal
                                    </>
                                  ) : (booking as any).paymentMethod === 'razorpay' ? (
                                    <>
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.436 0H1.564C.7 0 0 .7 0 1.564v20.872C0 23.3.7 24 1.564 24h20.872c.864 0 1.564-.7 1.564-1.564V1.564C24 .7 23.3 0 22.436 0zM7.735 18.259L5.667 8.297h3.274l1.026 6.202L12.5 8.297h3.274L7.735 18.259zm9.53-6.202c0 2.16-1.728 3.888-3.888 3.888s-3.888-1.728-3.888-3.888 1.728-3.888 3.888-3.888 3.888 1.728 3.888 3.888z" fill="#072654"/>
                                      </svg>
                                      Razorpay
                                    </>
                                  ) : (booking as any).paymentMethod === 'stripe' ? (
                                    <>
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.274 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                                      </svg>
                                      Stripe
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                      </svg>
                                      Unknown
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {formatDateTime(booking.createdAt)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  (booking as any).paymentStatus === 'completed' ? 'bg-green-100 text-green-700' :
                                  (booking as any).paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {(booking as any).paymentStatus || 'pending'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => fetchTransactionDetails(booking._id)}
                                  disabled={transactionLoading}
                                  className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {transactionLoading ? 'Loading...' : 'Transaction'}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Database Section */}
          {activeSection === 'database' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Database - Hotels Collection</h2>
                <div className="flex gap-3 items-center">
                  <select 
                    value={locationFilter}
                    onChange={(e) => handleLocationFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {getUniqueLocations().map(loc => (
                      <option key={loc} value={loc}>
                        {loc === 'all' ? 'All Locations' : loc}
                      </option>
                    ))}
                  </select>
                  <button onClick={fetchHotels} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading hotels from database...</p>
                  </div>
                </div>
              ) : (
                <div className={`rounded-xl shadow-sm overflow-hidden transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <tr>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>ID</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Name</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Location</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Price</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Rating</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Email</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Created</th>
                        </tr>
                      </thead>
                      <tbody className={`transition-all duration-300 ${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                        {filteredHotels.length === 0 ? (
                          <tr>
                            <td colSpan={7} className={`px-6 py-8 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {locationFilter === 'all' ? 'No hotels found in database' : `No hotels found in ${locationFilter}`}
                            </td>
                          </tr>
                        ) : (
                          filteredHotels.map((hotel) => (
                            <tr key={hotel._id} className={`transition-all duration-300 ${darkMode ? 'hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50' : 'hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50'}`}>
                              <td className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{hotel._id.slice(-6)}</td>
                              <td className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{hotel.name}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{hotel.location}</td>
                              <td className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>${hotel.price}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>⭐ {hotel.rating}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{hotel.email || 'N/A'}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(hotel.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SubAdmins Section - Only for Super Admin */}
          {activeSection === 'subadmins' && adminType === 'super' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Sub Admin Management</h2>
                <button onClick={() => {
                  const name = prompt('Enter sub-admin name:')
                  const username = prompt('Enter username:')
                  const password = prompt('Enter password:')
                  const email = prompt('Enter email:')
                  
                  if (name && username && password && email) {
                    const token = localStorage.getItem('adminToken')
                    fetch('http://localhost:5000/api/subadmin', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ name, username, password, email })
                    })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        alert('✅ Sub-admin created successfully!')
                        fetchSubAdmins()
                      } else {
                        alert('❌ ' + data.message)
                      }
                    })
                    .catch(() => alert('❌ Error creating sub-admin'))
                  }
                }} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  + Add Sub Admin
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading sub-admins...</p>
                  </div>
                </div>
              ) : (
                <div className={`rounded-xl shadow-sm overflow-hidden transition-all duration-500 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <tr>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Name</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Username</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Email</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Permissions</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`transition-all duration-300 ${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                        {subAdmins.length === 0 ? (
                          <tr>
                            <td colSpan={6} className={`px-6 py-8 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              No sub-admins found. Click "Add Sub Admin" to create one.
                            </td>
                          </tr>
                        ) : (
                          subAdmins.map((subAdmin) => (
                            <tr key={subAdmin._id} className={`transition-all duration-300 ${darkMode ? 'hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50' : 'hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50'}`}>
                              <td className={`px-6 py-4 text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{subAdmin.name}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{subAdmin.username}</td>
                              <td className={`px-6 py-4 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{subAdmin.email}</td>
                              <td className="px-6 py-4">
                                <div className="flex gap-1">
                                  {subAdmin.permissions.viewUsers && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Users</span>}
                                  {subAdmin.permissions.viewBookings && <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Bookings</span>}
                                  {subAdmin.permissions.viewRevenue && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">Revenue</span>}
                                  {subAdmin.permissions.manageHotels && <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">Hotels</span>}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${subAdmin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {subAdmin.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <button onClick={() => {
                                  if (confirm(`Delete sub-admin ${subAdmin.name}?`)) {
                                    const token = localStorage.getItem('adminToken')
                                    fetch(`http://localhost:5000/api/subadmin/${subAdmin._id}`, {
                                      method: 'DELETE',
                                      headers: { 'Authorization': `Bearer ${token}` }
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                      if (data.success) {
                                        alert('✅ Sub-admin deleted')
                                        fetchSubAdmins()
                                      }
                                    })
                                  }
                                }} className="text-red-600 hover:text-red-800 text-sm font-medium">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      
      {/* Profile Dropdown Menu - Fixed Position */}
      {showProfileMenu && (
        <div className={`profile-dropdown fixed top-16 right-6 w-64 rounded-xl shadow-lg py-2 z-[9999] ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className={`px-4 py-3 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-100'}`}>
            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{adminName}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Administrator</p>
          </div>
          
          <div className={`px-4 py-3 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={darkMode}
                  onChange={handleDarkModeToggle}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
          
          <button 
            onClick={() => { setActiveSection('settings'); setShowProfileMenu(false); }}
            className={`w-full text-left px-4 py-2 transition-colors flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
          >
            <svg className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Settings</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className={`w-full text-left px-4 py-2 transition-colors flex items-center gap-2 text-red-600 ${darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        darkMode={darkMode}
      />
      
      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
          <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700 bg-gradient-to-r from-gray-700 to-gray-600' : 'border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transaction Details</h3>
                <button 
                  onClick={() => setShowTransactionModal(false)}
                  className={`text-gray-500 hover:text-gray-700 transition-colors ${darkMode ? 'hover:text-gray-300' : ''}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Payment Information */}
              <div>
                <h4 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>💳 Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Razorpay Payment ID</label>
                    <div className={`text-sm font-mono ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{selectedTransaction.razorpayPaymentId}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Razorpay Order ID</label>
                    <div className={`text-sm font-mono ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{selectedTransaction.razorpayOrderId}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Payment Status</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedTransaction.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' :
                      selectedTransaction.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedTransaction.paymentStatus}
                    </span>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Razorpay Status</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedTransaction.razorpayStatus === 'captured' ? 'bg-green-100 text-green-700' :
                      selectedTransaction.razorpayStatus === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedTransaction.razorpayStatus}
                    </span>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount</label>
                    <div className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {selectedTransaction.currency} {selectedTransaction.amount}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Payment Method</label>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedTransaction.method || 'N/A'}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Transaction Date</label>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedTransaction.createdAt ? formatDateTime(selectedTransaction.createdAt) : 'N/A'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Customer Contact</label>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedTransaction.contact || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              {/* Error Information (if any) */}
              {(selectedTransaction.errorCode || selectedTransaction.errorDescription) && (
                <div>
                  <h4 className={`text-md font-semibold mb-3 text-red-600`}>⚠️ Error Information</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedTransaction.errorCode && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <label className="block text-sm font-medium mb-1 text-red-700">Error Code</label>
                        <div className="text-sm font-mono text-red-600">{selectedTransaction.errorCode}</div>
                      </div>
                    )}
                    {selectedTransaction.errorDescription && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <label className="block text-sm font-medium mb-1 text-red-700">Error Description</label>
                        <div className="text-sm text-red-600">{selectedTransaction.errorDescription}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Booking Information */}
              <div>
                <h4 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🏨 Booking Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hotel Name</label>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedTransaction.bookingDetails?.hotelName || 'N/A'}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Guest Name</label>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedTransaction.bookingDetails?.guestName || 'N/A'}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Guest Email</label>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedTransaction.bookingDetails?.guestEmail || selectedTransaction.email || 'N/A'}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Booking ID</label>
                    <div className={`text-sm font-mono ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>#{selectedTransaction.bookingId.slice(-6)}</div>
                  </div>
                  {selectedTransaction.bookingDetails?.checkIn && (
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Check-in Date</label>
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(selectedTransaction.bookingDetails.checkIn).toLocaleDateString()}</div>
                    </div>
                  )}
                  {selectedTransaction.bookingDetails?.checkOut && (
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Check-out Date</label>
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(selectedTransaction.bookingDetails.checkOut).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Dispute Contact Information */}
              <div className={`p-4 rounded-lg border-2 border-dashed ${darkMode ? 'border-yellow-600 bg-yellow-900/20' : 'border-yellow-400 bg-yellow-50'}`}>
                <h4 className={`text-md font-semibold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>📞 For Razorpay Disputes</h4>
                <p className={`text-sm mb-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  Use the following information when contacting Razorpay support:
                </p>
                <div className={`text-sm space-y-1 ${darkMode ? 'text-yellow-200' : 'text-yellow-600'}`}>
                  <div><strong>Payment ID:</strong> {selectedTransaction.razorpayPaymentId}</div>
                  <div><strong>Order ID:</strong> {selectedTransaction.razorpayOrderId}</div>
                  <div><strong>Amount:</strong> {selectedTransaction.currency} {selectedTransaction.amount}</div>
                  <div><strong>Date:</strong> {selectedTransaction.createdAt ? formatDateTime(selectedTransaction.createdAt) : 'N/A'}</div>
                </div>
              </div>
            </div>
            
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
