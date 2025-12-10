import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Hotel {
  id: string
  name: string
  location: string
  price: number
  image: string
  rating: number
  exclusive: boolean
}

export default function NormalHotelsDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
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
      const saved = localStorage.getItem('normalHotels')
      if (saved) {
        setHotels(JSON.parse(saved))
      } else {
        const defaultHotels = [
          { id: 'paris-1', name: 'Hôtel Étoile Royale', location: 'Paris', price: 520, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
          { id: 'paris-2', name: 'Le Jardin Suites', location: 'Paris', price: 360, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/549415122.jpg?k=6aa38e1d6d970b5756c6e0bd4297a603ce8618ffec17a5e8c2332ac20ab1bc2e&o=', rating: 4, exclusive: false },
          { id: 'paris-3', name: 'Montmartre Inn', location: 'Paris', price: 180, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/269945146.jpg?k=705f092a0e86ab775de93f8e2013b12ae5981739f5a513bcecead2c0db4e109d&o=', rating: 3, exclusive: false },
          { id: 'nyc-1', name: 'The Skyline Tower', location: 'New York', price: 480, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763346606.jpg?k=6ec8469c977fbd5e6867bd1da4f454db5914ccf5c962cd9b9ae74a5c2c766ca4&o=', rating: 5, exclusive: false },
          { id: 'nyc-2', name: 'Central Grand', location: 'New York', price: 340, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/674961168.jpg?k=478bea50dd93b61a34be446f180c1b079e08ed9ce425d2680b87f91afea36272&o=', rating: 4, exclusive: false },
          { id: 'nyc-3', name: 'Hudson Pods', location: 'New York', price: 150, image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false },
          { id: 'tokyo-1', name: 'Shinjuku Imperial', location: 'Tokyo', price: 450, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082763.jpg?k=1e0efd2d22e212697c98ff09502775672c39f4b38dc54b729c3a76f800173d12&o=', rating: 5, exclusive: false },
          { id: 'tokyo-2', name: 'Ginza Artisan Hotel', location: 'Tokyo', price: 310, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/622864288.jpg?k=6709fc69eab0ae881792007d3d099fb03e92be6f6a925e19dce4f212b0664971&o=', rating: 4, exclusive: false },
          { id: 'tokyo-3', name: 'Asakusa Capsule', location: 'Tokyo', price: 90, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/488327823.jpg?k=ff6638640efe474a5079fc280b26ba9e3ea4e1a4cfc0dbfaef69d29b3d3cb821&o=', rating: 3, exclusive: false },
          { id: 'dubai-1', name: 'Palm Marina Resort', location: 'Dubai', price: 530, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/727476358.jpg?k=aec126bb04f23b6b833361fd74d87bd9512216d5bc27827f96554dbe59602a31&o=', rating: 5, exclusive: false },
          { id: 'dubai-2', name: 'Desert Pearl', location: 'Dubai', price: 330, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/598095554.jpg?k=a6feffaab51bf2d7bdbdb6eb5ea1ef8f9e7800524f7f7cfc093519c50f28fd48&o=', rating: 4, exclusive: false },
          { id: 'dubai-3', name: 'Old Town Lodge', location: 'Dubai', price: 160, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/567316864.jpg?k=5a093e3d899bc5afd867cd1db35ee8eeb8c7ececdf92067eeb7ee0981fb4bbd0&o=', rating: 3, exclusive: false },
          { id: 'rome-1', name: 'Palazzo Aurelia', location: 'Rome', price: 400, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
          { id: 'rome-2', name: 'Via Condotti House', location: 'Rome', price: 290, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/435714928.jpg?k=bbf01bc66b9366bb644a3910b74e29a7da359a2c70f450de03bc37275d91c005&o=', rating: 4, exclusive: false },
          { id: 'rome-3', name: 'Trastevere Rooms', location: 'Rome', price: 140, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false },
          { id: 'sg-1', name: 'The Fullerton Hotel', location: 'Singapore', price: 470, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/106988145.jpg?k=4dc750be5829df9afb3485ee7555b8d4697c151d3a403062908c4a5a1fd87112&o=', rating: 5, exclusive: false },
          { id: 'sg-2', name: 'Orchard Grove', location: 'Singapore', price: 320, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/721154462.jpg?k=12932700b7c14aaeb157ec0bf77bbb0cf9cfac9f88c4fdb93100a16b91b31196&o=', rating: 4, exclusive: false },
          { id: 'sg-3', name: 'Bugis Budget Inn', location: 'Singapore', price: 120, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false },
          { id: 'my-1', name: 'Kuala Vista Residences', location: 'Malaysia', price: 380, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/624148627.jpg?k=f1f6ef6b9ef5a4a1a952ad5d47ad8bfdf0e2dba2c286e028bc1b628968fd6e5c&o=', rating: 5, exclusive: false },
          { id: 'my-2', name: 'Penang Heritage Hotel', location: 'Malaysia', price: 220, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/326893205.jpg?k=977021538d51e8e7d1ee65fd16d26db58547c263f681d78ad6f3f8bb41837865&o=', rating: 4, exclusive: false },
          { id: 'bkk-1', name: 'Chao Phraya Riverside', location: 'Bangkok', price: 390, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/593370627.jpg?k=c91650aace08fef98582558db6adb9a1332327278c3727ee89b59fa41cb4dde5&o=', rating: 5, exclusive: false },
          { id: 'bkk-2', name: 'Sukhumvit Urban Hotel', location: 'Bangkok', price: 240, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/555924063.jpg?k=6b3a9b6d6c3f1d5e2a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f&o=', rating: 4, exclusive: false },
          { id: 'bkk-3', name: 'Old Town Guesthouse', location: 'Bangkok', price: 120, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false },
          { id: 'seoul-1', name: 'Gangnam Heights', location: 'Seoul', price: 410, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/225664341.jpg?k=0f8d1d1cce6e784a6c9589e46a112f9f2193c96867c2e44dcac670ccd7b7d6c2&o=', rating: 5, exclusive: false },
          { id: 'seoul-2', name: 'Myeongdong Boutique', location: 'Seoul', price: 260, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763709548.jpg?k=8f4711a661ffe9156cc27298b7972526f7c2638ec9aab6d4cbc5a2c9fd6390c2&o=', rating: 4, exclusive: false },
          { id: 'seoul-3', name: 'Hanok House', location: 'Seoul', price: 130, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/409143054.jpg?k=2e65ea2a4bd321768e91741df75162d8ae60256c808a36fd1521c53ebe79ab89&o=', rating: 3, exclusive: false }
        ]
        setHotels(defaultHotels)
        localStorage.setItem('normalHotels', JSON.stringify(defaultHotels))
      }
    } catch (err) {
      setError('Failed to load hotels')
    } finally {
      setLoading(false)
    }
  }, [])

  const saveHotels = (updatedHotels: Hotel[]) => {
    setHotels(updatedHotels)
    localStorage.setItem('normalHotels', JSON.stringify(updatedHotels))
  }

  const handleAddHotel = () => {
    if (!formData.name || !formData.location || !formData.price || !formData.image || !formData.rating) {
      alert('Please fill all fields')
      return
    }

    const newHotel: Hotel = {
      id: `norm-${Date.now()}`,
      name: formData.name.trim(),
      location: formData.location.trim(),
      price: parseFloat(formData.price),
      image: formData.image.trim(),
      rating: parseFloat(formData.rating),
      exclusive: false
    }

    saveHotels([...hotels, newHotel])
    setFormData({ name: '', location: '', price: '', image: '', rating: '' })
    setShowAddForm(false)
  }

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setFormData({
      name: hotel.name,
      location: hotel.location,
      price: hotel.price.toString(),
      image: hotel.image,
      rating: hotel.rating.toString()
    })
    setShowAddForm(true)
  }

  const handleUpdateHotel = () => {
    if (!editingHotel) return

    const updatedHotel: Hotel = {
      ...editingHotel,
      name: formData.name.trim(),
      location: formData.location.trim(),
      price: parseFloat(formData.price),
      image: formData.image.trim(),
      rating: parseFloat(formData.rating)
    }

    saveHotels(hotels.map(h => h.id === editingHotel.id ? updatedHotel : h))
    setFormData({ name: '', location: '', price: '', image: '', rating: '' })
    setShowAddForm(false)
    setEditingHotel(null)
  }

  const handleDeleteHotel = (id: string) => {
    if (confirm('Are you sure?')) {
      saveHotels(hotels.filter(h => h.id !== id))
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {error && (
          <div className="bg-red-500/20 backdrop-blur-xl border border-red-400/50 text-red-300 px-6 py-4 rounded-2xl mb-6 flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} className="text-2xl">×</button>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">🏨 Normal Hotels Dashboard</h1>
              <p className="text-gray-300">Manage Regular Hotels</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { localStorage.removeItem('normalHotels'); window.location.reload(); }} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                🔄 Reset All Hotels
              </button>
              <button onClick={() => navigate('/admin-dashboard')} className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                ← Back to Exclusive
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl p-8 rounded-2xl border border-blue-400/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-blue-400 font-semibold">Total Hotels</h3>
              <span className="text-3xl">🏨</span>
            </div>
            <p className="text-5xl font-bold text-white">{hotels.length}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 backdrop-blur-xl p-8 rounded-2xl border border-cyan-400/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-cyan-400 font-semibold">Avg Rating</h3>
              <span className="text-3xl">⭐</span>
            </div>
            <p className="text-5xl font-bold text-white">
              {hotels.length > 0 ? (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1) : '0.0'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-teal-500/20 to-green-500/20 backdrop-blur-xl p-8 rounded-2xl border border-teal-400/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-teal-400 font-semibold">Avg Price</h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-5xl font-bold text-white">
              ${hotels.length > 0 ? Math.round(hotels.reduce((sum, h) => sum + h.price, 0) / hotels.length) : '0'}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105">
            + Add New Hotel
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">{editingHotel ? '✏️ Edit Hotel' : '✨ Add New Hotel'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Hotel Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter hotel name" />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Location</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter location" />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Price per Night ($)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter price" />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Rating (1-5)</label>
                <input type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter rating" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-gray-300 font-medium">Image URL</label>
                <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter image URL" />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={editingHotel ? handleUpdateHotel : handleAddHotel} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                {editingHotel ? '✔️ Update' : '✨ Add'}
              </button>
              <button onClick={() => { setShowAddForm(false); setEditingHotel(null); setFormData({ name: '', location: '', price: '', image: '', rating: '' }); }} className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-8">🏨 Hotels Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="relative overflow-hidden">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white mb-2 text-lg">{hotel.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">📍 {hotel.location}</p>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                    <span className="text-sm text-gray-300 ml-1">{hotel.rating}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-white">${hotel.price}</span>
                    <span className="text-xs text-gray-400">per night</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditHotel(hotel)} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteHotel(hotel.id)} className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
