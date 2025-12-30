import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [exclusiveHotels, setExclusiveHotels] = useState<ExclusiveHotel[]>([])
  const [activeSection, setActiveSection] = useState('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true'
    if (!isAuthenticated) {
      navigate('/admin-login')
      return
    }

    const saved = localStorage.getItem('exclusiveHotels')
    if (saved) {
      setExclusiveHotels(JSON.parse(saved))
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

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/bookings/admin/all')
      const data = await response.json()
      if (data.success) {
        console.log('Bookings data:', data.bookings)
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers()
    } else if (activeSection === 'transactions') {
      fetchBookings()
    }
  }, [activeSection])

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', product: 'Grand Palace Resort', amount: 850, status: 'Completed', date: '2024-01-15' },
    { id: '#12346', customer: 'Jane Smith', product: 'Royal Mountain Lodge', amount: 720, status: 'Pending', date: '2024-01-14' },
    { id: '#12347', customer: 'Mike Johnson', product: 'Ocean View Villa', amount: 650, status: 'Completed', date: '2024-01-14' },
    { id: '#12348', customer: 'Sarah Williams', product: 'Desert Oasis Hotel', amount: 580, status: 'Processing', date: '2024-01-13' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/admin-login')
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-xl`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className={`font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen ? '✨ The Grand Stay' : '✨'}
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveSection('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeSection === 'dashboard' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform hover:scale-105' 
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          
          <button onClick={() => navigate('/normal-hotels-dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {sidebarOpen && <span>Hotels</span>}
          </button>

          <button onClick={() => setActiveSection('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeSection === 'users' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform hover:scale-105' 
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {sidebarOpen && <span>Users</span>}
          </button>

          <button onClick={() => setActiveSection('transactions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeSection === 'transactions' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform hover:scale-105' 
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {sidebarOpen && <span>Transactions</span>}
          </button>

          <button onClick={() => setActiveSection('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeSection === 'settings' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform hover:scale-105' 
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {sidebarOpen && <span>Settings</span>}
          </button>
        </nav>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-4 border-t border-gray-200 text-gray-600 hover:bg-gray-100 transition-all duration-200">
          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-6">
              <button onClick={() => navigate('/normal-hotels-dashboard')} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                + New Hotel
              </button>
              
              <button onClick={() => setActiveSection('notifications')} className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <button onClick={handleLogout} className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold hover:shadow-lg transform hover:scale-110 transition-all duration-200">
                  A
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-transparent via-purple-50/30 to-blue-50/30">
          {activeSection === 'dashboard' && (
            <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Dashboard Overview</h2>
            <p className="text-sm text-gray-500">Welcome back, Admin 👋</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div onClick={() => setActiveSection('revenue')} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+12.5%</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$328,000</p>
            </div>

            <div onClick={() => setActiveSection('users')} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+8.2%</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">2,847</p>
            </div>

            <div onClick={() => setActiveSection('orders')} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+15.3%</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>

            <div onClick={() => setActiveSection('analytics')} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">-2.4%</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">45,678</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 6 months</span>
              </div>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-400 text-sm">Revenue Chart</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">This month</span>
              </div>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  <p className="text-gray-400 text-sm">Category Chart</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <button onClick={() => setActiveSection('orders')} className="text-sm text-purple-600 hover:text-purple-700 font-medium">View All →</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} onClick={() => alert(`Order ${order.id} details: ${order.customer} - ${order.product}`)} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-all duration-200 cursor-pointer">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                    </tr>
                  ))}
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr key={user._id} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-all duration-200">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{user.phone || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  user.isMember ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {user.isMember ? '✓ Member' : 'Guest'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{user.membershipTier || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm font-medium text-purple-600">{user.points}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
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

          {/* Transactions Section */}
          {activeSection === 'transactions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Transactions & Bookings</h2>
                <button onClick={fetchBookings} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  🔄 Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading bookings...</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-Out</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                              No bookings found
                            </td>
                          </tr>
                        ) : (
                          bookings.map((booking) => (
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
                              <td className="px-6 py-4 text-sm text-gray-600">{(booking as any).room?.title || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.checkIn).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.checkOut).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{booking.guests}</td>
                              <td className="px-6 py-4 text-sm font-medium text-purple-600">${booking.totalPrice || booking.price}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.createdAt).toLocaleDateString()}</td>
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
    </div>
  )
}
