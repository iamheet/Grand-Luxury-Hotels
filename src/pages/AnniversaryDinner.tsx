import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AnniversaryDinner() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    coupleName: '',
    anniversaryYear: '',
    contactEmail: '',
    contactPhone: '',
    dinnerDate: '',
    guestCount: 10,
    venue: '',
    cuisine: '',
    budget: 5000,
    specialRequests: ''
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const anniversaryService = {
      id: `anniversary-${Date.now()}`,
      name: `Anniversary Dinner - ${formData.coupleName}`,
      event: {
        ...formData,
        price: formData.budget,
        type: 'Anniversary'
      },
      type: 'event'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: anniversaryService } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-red-900 to-[var(--color-brand-navy)] pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">💕 Anniversary Dinner Planning</h1>
          <p className="text-gray-300 text-lg">Celebrate your love with an intimate anniversary experience</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Anniversary Information */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-gradient-to-r from-purple-500 to-red-500 text-white px-4 py-2 rounded-full text-sm">💖</span>
                Anniversary Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Couple Names *</label>
                  <input
                    type="text"
                    name="coupleName"
                    value={formData.coupleName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="John & Jane Smith"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Anniversary Year *</label>
                  <select
                    name="anniversaryYear"
                    value={formData.anniversaryYear}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" className="bg-slate-800">Select anniversary</option>
                    <option value="1st" className="bg-slate-800">1st Anniversary</option>
                    <option value="5th" className="bg-slate-800">5th Anniversary</option>
                    <option value="10th" className="bg-slate-800">10th Anniversary</option>
                    <option value="25th" className="bg-slate-800">25th Anniversary (Silver)</option>
                    <option value="50th" className="bg-slate-800">50th Anniversary (Golden)</option>
                    <option value="other" className="bg-slate-800">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email *</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="contact@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Dinner Details */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-gradient-to-r from-purple-500 to-red-500 text-white px-4 py-2 rounded-full text-sm">🍽️</span>
                Dinner Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dinner Date *</label>
                  <input
                    type="date"
                    name="dinnerDate"
                    value={formData.dinnerDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Number of Guests</label>
                  <select
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={2} className="bg-slate-800">Just the Couple</option>
                    <option value={10} className="bg-slate-800">10 Guests</option>
                    <option value={20} className="bg-slate-800">20 Guests</option>
                    <option value={30} className="bg-slate-800">30 Guests</option>
                    <option value={50} className="bg-slate-800">50 Guests</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Venue Preference</label>
                  <select
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" className="bg-slate-800">Select venue</option>
                    <option value="private-dining" className="bg-slate-800">Private Dining Room</option>
                    <option value="rooftop" className="bg-slate-800">Romantic Rooftop</option>
                    <option value="beachside" className="bg-slate-800">Beachside Setting</option>
                    <option value="home" className="bg-slate-800">In-Home Experience</option>
                    <option value="yacht" className="bg-slate-800">Private Yacht</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cuisine Style</label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" className="bg-slate-800">Select cuisine</option>
                    <option value="french" className="bg-slate-800">French Fine Dining</option>
                    <option value="italian" className="bg-slate-800">Italian Romance</option>
                    <option value="japanese" className="bg-slate-800">Japanese Omakase</option>
                    <option value="mediterranean" className="bg-slate-800">Mediterranean</option>
                    <option value="fusion" className="bg-slate-800">Modern Fusion</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={5000} className="bg-slate-800">$5,000 - $10,000</option>
                    <option value={15000} className="bg-slate-800">$10,000 - $20,000</option>
                    <option value={30000} className="bg-slate-800">$20,000 - $50,000</option>
                    <option value={75000} className="bg-slate-800">$50,000+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-gradient-to-r from-purple-500 to-red-500 text-white px-4 py-2 rounded-full text-sm">🌹</span>
                Special Touches
              </h3>
              
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Share your romantic vision, special memories to recreate, dietary preferences, or any surprise elements..."
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
                disabled={!formData.coupleName || !formData.dinnerDate}
                className="flex-1 bg-gradient-to-r from-purple-500 to-red-500 text-white py-4 rounded-xl font-bold hover:brightness-95 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Plan Anniversary Dinner 💕
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}