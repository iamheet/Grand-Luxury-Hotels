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

export default function AdminDashboard() {
  const [exclusiveHotels, setExclusiveHotels] = useState<ExclusiveHotel[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHotel, setEditingHotel] = useState<ExclusiveHotel | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    image: '',
    rating: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true'
    if (!isAuthenticated) {
      navigate('/admin-login')
      return
    }
  }, [navigate])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('exclusiveHotels')
      if (saved) {
        const parsedHotels = JSON.parse(saved)
        if (Array.isArray(parsedHotels)) {
          setExclusiveHotels(parsedHotels)
        } else {
          throw new Error('Invalid hotel data format')
        }
      } else {
        const defaultHotels = [
          { id: 'exc-1', name: 'Grand Palace Resort', location: 'Maldives', price: 850, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', rating: 4.9, exclusive: true },
          { id: 'exc-2', name: 'Royal Mountain Lodge', location: 'Swiss Alps', price: 720, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', rating: 4.8, exclusive: true },
          { id: 'exc-3', name: 'Ocean View Villa', location: 'Santorini', price: 650, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', rating: 4.7, exclusive: true }
        ]
        setExclusiveHotels(defaultHotels)
        localStorage.setItem('exclusiveHotels', JSON.stringify(defaultHotels))
      }
    } catch (err) {
      console.error('Error loading hotels:', err)
      setError('Failed to load hotels')
      setExclusiveHotels([])
    } finally {
      setLoading(false)
    }
  }, [])

  const saveHotels = (hotels: ExclusiveHotel[]) => {
    try {
      setExclusiveHotels(hotels)
      localStorage.setItem('exclusiveHotels', JSON.stringify(hotels))
    } catch (err) {
      console.error('Error saving hotels:', err)
      setError('Failed to save hotels')
    }
  }

  const handleAddHotel = () => {
    try {
      if (!formData.name || !formData.location || !formData.price || !formData.image || !formData.rating) {
        alert('Please fill all fields')
        return
      }

      const price = parseFloat(formData.price)
      const rating = parseFloat(formData.rating)

      if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price')
        return
      }

      if (isNaN(rating) || rating < 1 || rating > 5) {
        alert('Please enter a valid rating between 1 and 5')
        return
      }

      const newHotel: ExclusiveHotel = {
        id: `exc-${Date.now()}`,
        name: formData.name.trim(),
        location: formData.location.trim(),
        price: price,
        image: formData.image.trim(),
        rating: rating,
        exclusive: true
      }

      const updatedHotels = [...exclusiveHotels, newHotel]
      saveHotels(updatedHotels)
      setFormData({ name: '', location: '', price: '', image: '', rating: '' })
      setShowAddForm(false)
      setError('')
    } catch (err) {
      console.error('Error adding hotel:', err)
      setError('Failed to add hotel')
    }
  }

  const handleEditHotel = (hotel: ExclusiveHotel) => {
    try {
      setEditingHotel(hotel)
      setFormData({
        name: hotel.name || '',
        location: hotel.location || '',
        price: hotel.price?.toString() || '',
        image: hotel.image || '',
        rating: hotel.rating?.toString() || ''
      })
      setShowAddForm(true)
      setError('')
    } catch (err) {
      console.error('Error editing hotel:', err)
      setError('Failed to edit hotel')
    }
  }

  const handleUpdateHotel = () => {
    try {
      if (!editingHotel || !formData.name || !formData.location || !formData.price || !formData.image || !formData.rating) {
        alert('Please fill all fields')
        return
      }

      const price = parseFloat(formData.price)
      const rating = parseFloat(formData.rating)

      if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price')
        return
      }

      if (isNaN(rating) || rating < 1 || rating > 5) {
        alert('Please enter a valid rating between 1 and 5')
        return
      }

      const updatedHotel: ExclusiveHotel = {
        ...editingHotel,
        name: formData.name.trim(),
        location: formData.location.trim(),
        price: price,
        image: formData.image.trim(),
        rating: rating
      }

      const updatedHotels = exclusiveHotels.map(h => h.id === editingHotel.id ? updatedHotel : h)
      saveHotels(updatedHotels)
      setFormData({ name: '', location: '', price: '', image: '', rating: '' })
      setShowAddForm(false)
      setEditingHotel(null)
      setError('')
    } catch (err) {
      console.error('Error updating hotel:', err)
      setError('Failed to update hotel')
    }
  }

  const handleDeleteHotel = (id: string) => {
    try {
      if (confirm('Are you sure you want to delete this hotel?')) {
        const updatedHotels = exclusiveHotels.filter(h => h.id !== id)
        saveHotels(updatedHotels)
        setError('')
      }
    } catch (err) {
      console.error('Error deleting hotel:', err)
      setError('Failed to delete hotel')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', location: '', price: '', image: '', rating: '' })
    setShowAddForm(false)
    setEditingHotel(null)
    setError('')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/admin-login')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading Admin Dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-xl border border-red-400/50 text-red-300 px-6 py-4 rounded-2xl mb-6 text-center shadow-xl flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button 
              onClick={() => setError('')}
              className="text-red-300 hover:text-red-100 transition-colors text-2xl font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">🏨 Exclusive Hotels Dashboard</h1>
              <p className="text-gray-300">Manage Exclusive Royal Member Hotels</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/normal-hotels-dashboard')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🏨 Normal Hotels
              </button>
              <button
                onClick={() => navigate('/member-dashboard')}
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                ← Back
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl p-8 rounded-2xl border border-emerald-400/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-emerald-400 font-semibold">Total Hotels</h3>
              <span className="text-3xl">🏨</span>
            </div>
            <p className="text-5xl font-bold text-white">{exclusiveHotels?.length || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl p-8 rounded-2xl border border-blue-400/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-blue-400 font-semibold">Avg Rating</h3>
              <span className="text-3xl">⭐</span>
            </div>
            <p className="text-5xl font-bold text-white">
              {exclusiveHotels?.length > 0 ? (exclusiveHotels.reduce((sum, h) => sum + (h.rating || 0), 0) / exclusiveHotels.length).toFixed(1) : '0.0'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl p-8 rounded-2xl border border-purple-400/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-purple-400 font-semibold">Avg Price</h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-5xl font-bold text-white">
              ${exclusiveHotels?.length > 0 ? Math.round(exclusiveHotels.reduce((sum, h) => sum + (h.price || 0), 0) / exclusiveHotels.length) : '0'}
            </p>
          </div>
        </div>

        {/* Add Hotel Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/50"
          >
            + Add New Exclusive Hotel
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">
              {editingHotel ? '✏️ Edit Hotel' : '✨ Add New Exclusive Hotel'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Hotel Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Enter hotel name"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Price per Night ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Rating (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Enter rating"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-gray-300 font-medium">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Enter image URL"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={editingHotel ? handleUpdateHotel : handleAddHotel}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {editingHotel ? '✔️ Update Hotel' : '✨ Add Hotel'}
              </button>
              <button
                onClick={resetForm}
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        {/* Hotels List */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-8">🏛️ Exclusive Hotels Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exclusiveHotels && exclusiveHotels.length > 0 ? exclusiveHotels.map((hotel) => (
              <div key={hotel.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={hotel.image || 'https://via.placeholder.com/400x200?text=No+Image'} 
                    alt={hotel.name || 'Hotel'} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image+Error'
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    👑 EXCLUSIVE
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white mb-2 text-lg">{hotel.name || 'Unnamed Hotel'}</h3>
                  <p className="text-gray-300 text-sm mb-3 flex items-center gap-1">
                    📍 {hotel.location || 'Unknown Location'}
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: Math.floor(hotel.rating || 0) }).map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                    <span className="text-sm text-gray-300 ml-1">{hotel.rating || 0}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-white">${hotel.price || 0}</span>
                    <span className="text-xs text-gray-400">per night</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditHotel(hotel)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteHotel(hotel.id)}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-300 text-xl mb-2">No exclusive hotels found</p>
                <p className="text-gray-500">Click "Add New Exclusive Hotel" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}