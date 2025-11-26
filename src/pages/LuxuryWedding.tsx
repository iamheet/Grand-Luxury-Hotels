import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LuxuryWedding() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    brideEmail: '',
    groomEmail: '',
    bridePhone: '',
    groomPhone: '',
    weddingDate: '',
    guestCount: 50,
    venue: '',
    budget: 15000,
    specialRequests: ''
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const weddingService = {
      id: `wedding-${Date.now()}`,
      name: `Luxury Wedding - ${formData.brideName} & ${formData.groomName}`,
      event: {
        ...formData,
        price: formData.budget,
        type: 'Wedding'
      },
      type: 'event'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: weddingService } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-[var(--color-brand-navy)] pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">💍 Luxury Wedding Planning</h1>
          <p className="text-gray-300 text-lg">Create your perfect dream wedding with our expert planners</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Couple Information */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm">💕</span>
                Couple Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bride's Full Name *</label>
                  <input
                    type="text"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter bride's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Groom's Full Name *</label>
                  <input
                    type="text"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter groom's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bride's Email</label>
                  <input
                    type="email"
                    name="brideEmail"
                    value={formData.brideEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="bride@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Groom's Email</label>
                  <input
                    type="email"
                    name="groomEmail"
                    value={formData.groomEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="groom@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bride's Phone</label>
                  <input
                    type="tel"
                    name="bridePhone"
                    value={formData.bridePhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Groom's Phone</label>
                  <input
                    type="tel"
                    name="groomPhone"
                    value={formData.groomPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Wedding Details */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm">🎊</span>
                Wedding Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Wedding Date *</label>
                  <input
                    type="date"
                    name="weddingDate"
                    value={formData.weddingDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Number of Guests *</label>
                  <select
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value={50} className="bg-slate-800">50 Guests</option>
                    <option value={75} className="bg-slate-800">75 Guests</option>
                    <option value={100} className="bg-slate-800">100 Guests</option>
                    <option value={150} className="bg-slate-800">150 Guests</option>
                    <option value={200} className="bg-slate-800">200 Guests</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Venue Type</label>
                  <select
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="" className="bg-slate-800">Select venue type</option>
                    <option value="beach" className="bg-slate-800">Beach Resort</option>
                    <option value="castle" className="bg-slate-800">Historic Castle</option>
                    <option value="garden" className="bg-slate-800">Garden Estate</option>
                    <option value="ballroom" className="bg-slate-800">Grand Ballroom</option>
                    <option value="vineyard" className="bg-slate-800">Vineyard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value={15000} className="bg-slate-800">$15,000 - $25,000</option>
                    <option value={30000} className="bg-slate-800">$25,000 - $50,000</option>
                    <option value={75000} className="bg-slate-800">$50,000 - $100,000</option>
                    <option value={150000} className="bg-slate-800">$100,000+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm">✨</span>
                Special Requests
              </h3>
              
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Tell us about your dream wedding vision, special requirements, dietary restrictions, or any other details..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/private-events')}
                className="flex-1 bg-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20"
              >
                ← Back to Events
              </button>
              
              <button
                type="submit"
                disabled={!formData.brideName || !formData.groomName || !formData.weddingDate}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-xl font-bold hover:brightness-95 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Plan Our Dream Wedding 💍
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}