import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BirthdayCelebration() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    celebrantName: '',
    celebrantAge: '',
    celebrantEmail: '',
    celebrantPhone: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    partyDate: '',
    guestCount: 20,
    theme: '',
    venue: '',
    budget: 8000,
    specialRequests: ''
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const birthdayService = {
      id: `birthday-${Date.now()}`,
      name: `Birthday Celebration - ${formData.celebrantName}`,
      event: {
        ...formData,
        price: formData.budget,
        type: 'Birthday'
      },
      type: 'event'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: birthdayService } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-yellow-900 to-[var(--color-brand-navy)] pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🎂 Birthday Celebration Planning</h1>
          <p className="text-gray-300 text-lg">Create an unforgettable birthday experience</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Celebrant Information */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm">🎉</span>
                Celebrant Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Celebrant's Full Name *</label>
                  <input
                    type="text"
                    name="celebrantName"
                    value={formData.celebrantName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Birthday person's name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age Turning *</label>
                  <input
                    type="number"
                    name="celebrantAge"
                    value={formData.celebrantAge}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="120"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Age"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Celebrant's Email</label>
                  <input
                    type="email"
                    name="celebrantEmail"
                    value={formData.celebrantEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="celebrant@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Celebrant's Phone</label>
                  <input
                    type="tel"
                    name="celebrantPhone"
                    value={formData.celebrantPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Organizer Information */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm">👤</span>
                Organizer Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Organizer Name *</label>
                  <input
                    type="text"
                    name="organizerName"
                    value={formData.organizerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Organizer Email *</label>
                  <input
                    type="email"
                    name="organizerEmail"
                    value={formData.organizerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="your@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Organizer Phone *</label>
                  <input
                    type="tel"
                    name="organizerPhone"
                    value={formData.organizerPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your phone"
                  />
                </div>
              </div>
            </div>

            {/* Party Details */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm">🎈</span>
                Party Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Party Date *</label>
                  <input
                    type="date"
                    name="partyDate"
                    value={formData.partyDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Number of Guests *</label>
                  <select
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={20} className="bg-slate-800">20 Guests</option>
                    <option value={30} className="bg-slate-800">30 Guests</option>
                    <option value={50} className="bg-slate-800">50 Guests</option>
                    <option value={75} className="bg-slate-800">75 Guests</option>
                    <option value={100} className="bg-slate-800">100 Guests</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Party Theme</label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="" className="bg-slate-800">Select theme</option>
                    <option value="elegant" className="bg-slate-800">Elegant & Sophisticated</option>
                    <option value="tropical" className="bg-slate-800">Tropical Paradise</option>
                    <option value="vintage" className="bg-slate-800">Vintage Glamour</option>
                    <option value="hollywood" className="bg-slate-800">Hollywood Red Carpet</option>
                    <option value="masquerade" className="bg-slate-800">Masquerade Ball</option>
                    <option value="custom" className="bg-slate-800">Custom Theme</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Venue Preference</label>
                  <select
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="" className="bg-slate-800">Select venue type</option>
                    <option value="rooftop" className="bg-slate-800">Rooftop Terrace</option>
                    <option value="ballroom" className="bg-slate-800">Grand Ballroom</option>
                    <option value="garden" className="bg-slate-800">Garden Party</option>
                    <option value="yacht" className="bg-slate-800">Private Yacht</option>
                    <option value="villa" className="bg-slate-800">Luxury Villa</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={8000} className="bg-slate-800">$8,000 - $15,000</option>
                    <option value={20000} className="bg-slate-800">$15,000 - $30,000</option>
                    <option value={50000} className="bg-slate-800">$30,000 - $75,000</option>
                    <option value={100000} className="bg-slate-800">$75,000+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm">🎁</span>
                Special Requests
              </h3>
              
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Tell us about special entertainment, dietary requirements, surprise elements, or any other details for the perfect birthday celebration..."
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
                disabled={!formData.celebrantName || !formData.organizerName || !formData.partyDate}
                className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-xl font-bold hover:brightness-95 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Plan Birthday Celebration 🎂
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}