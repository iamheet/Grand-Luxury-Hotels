import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Hotel {
  _id: string
  name: string
  location: string
  price: number
  image: string
  rating: number
  exclusive: boolean
  email?: string
  password?: string
}

export default function NormalHotelsDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    image: '',
    rating: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true'
    if (!isAuthenticated) {
      navigate('/admin-login')
      return
    }

    fetchHotels()
  }, [navigate])

  const fetchHotels = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/hotels')
      const data = await response.json()
      if (data.success) {
        setHotels(data.hotels)
      } else {
        // If no hotels in database, seed with defaults
        await seedDefaultHotels()
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
    } finally {
      setLoading(false)
    }
  }

  const seedDefaultHotels = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hotels/seed', {
        method: 'POST'
      })
      const data = await response.json()
      if (data.success) {
        fetchHotels()
      }
    } catch (error) {
      console.error('Error seeding hotels:', error)
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddHotel = async () => {
    if (!formData.name || !formData.location || !formData.price || !formData.image || !formData.rating || !formData.email || !formData.password) {
      showToast('Please fill all fields including email and password', 'error')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          location: formData.location.trim(),
          price: parseFloat(formData.price),
          image: formData.image.trim(),
          rating: parseFloat(formData.rating),
          exclusive: false,
          email: formData.email.trim(),
          password: formData.password.trim()
        })
      })

      const data = await response.json()
      if (data.success) {
        fetchHotels()
        setFormData({ name: '', location: '', price: '', image: '', rating: '', email: '', password: '' })
        setShowAddForm(false)
        showToast('Hotel added successfully!', 'success')
      } else {
        showToast(data.message || 'Error adding hotel', 'error')
      }
    } catch (error) {
      console.error('Error adding hotel:', error)
      showToast('Error adding hotel', 'error')
    }
  }

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      location: hotel.location,
      price: hotel.price.toString(),
      image: hotel.image,
      rating: hotel.rating.toString(),
      email: '',
      password: ''
    })
    setShowAddForm(true)
  }

  const handleUpdateHotel = async () => {
    if (!editingHotel) return

    if (!formData.name || !formData.location || !formData.price || !formData.image || !formData.rating || !formData.email || !formData.password) {
      showToast('Please fill all fields including email and password', 'error')
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/hotels/${editingHotel._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          location: formData.location.trim(),
          price: parseFloat(formData.price),
          image: formData.image.trim(),
          rating: parseFloat(formData.rating),
          email: formData.email.trim(),
          password: formData.password.trim()
        })
      })

      const data = await response.json()
      if (data.success) {
        fetchHotels()
        setFormData({ name: '', location: '', price: '', image: '', rating: '', email: '', password: '' })
        setShowAddForm(false)
        setEditingHotel(null)
        showToast('Hotel updated successfully!', 'success')
      } else {
        showToast(data.message || 'Error updating hotel', 'error')
      }
    } catch (error) {
      console.error('Error updating hotel:', error)
      showToast('Error updating hotel', 'error')
    }
  }

  const handleDeleteHotel = async (id: string) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/hotels/${id}`, {
          method: 'DELETE'
        })
        
        const data = await response.json()
        if (data.success) {
          fetchHotels()
          showToast('Hotel deleted successfully!', 'success')
        } else {
          showToast(data.message || 'Error deleting hotel', 'error')
        }
      } catch (error) {
        console.error('Error deleting hotel:', error)
        showToast('Error deleting hotel', 'error')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
          <button onClick={() => navigate('/admin-dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {sidebarOpen && <span>Hotels</span>}
          </button>

          <button onClick={() => navigate('/admin-dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {sidebarOpen && <span>Users</span>}
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {sidebarOpen && <span>Transactions</span>}
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200">
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
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">🏨 Hotels Management</h1>
              <p className="text-sm text-gray-500">Manage your hotel listings</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                + Add Hotel
              </button>
              <button onClick={() => navigate('/admin-dashboard')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200">
                ← Back
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-sm font-medium">Total Hotels</h3>
                <span className="text-2xl">🏨</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{hotels.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-sm font-medium">Avg Rating</h3>
                <span className="text-2xl">⭐</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {hotels.length > 0 ? (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1) : '0.0'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-sm font-medium">Avg Price</h3>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ${hotels.length > 0 ? Math.round(hotels.reduce((sum, h) => sum + h.price, 0) / hotels.length) : '0'}
              </p>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{editingHotel ? '✏️ Edit Hotel' : '✨ Add New Hotel'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter hotel name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter location" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter price" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter rating" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter image URL" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter hotel email" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Password *</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter hotel password" required />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={editingHotel ? handleUpdateHotel : handleAddHotel} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  {editingHotel ? '✔️ Update' : '✨ Add'}
                </button>
                <button onClick={() => { setShowAddForm(false); setEditingHotel(null); setFormData({ name: '', location: '', price: '', image: '', rating: '', email: '', password: '' }); }} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200">
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group">
                <div className="relative overflow-hidden h-48">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="text-sm font-semibold text-gray-900">{hotel.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{hotel.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {hotel.location}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-purple-600">${hotel.price}</span>
                      <span className="text-xs text-gray-500 ml-1">/night</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditHotel(hotel)} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteHotel(hotel._id)} className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hotels.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Hotels Found</h3>
              <p className="text-gray-500 mb-6">Start by adding your first hotel</p>
              <button onClick={() => setShowAddForm(true)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                + Add Hotel
              </button>
            </div>
          )}
        </main>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
