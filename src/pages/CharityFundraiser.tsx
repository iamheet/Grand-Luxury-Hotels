import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CharityFundraiser() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    organizationName: '',
    causeName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    eventDate: '',
    guestCount: 100,
    fundraisingGoal: '',
    eventType: '',
    venue: '',
    auctionItems: false,
    budget: 9000,
    specialRequests: ''
  })

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const charityService = {
      id: `charity-${Date.now()}`,
      name: `Charity Fundraiser - ${formData.causeName}`,
      event: {
        ...formData,
        price: formData.budget,
        type: 'Charity'
      },
      type: 'event'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: charityService } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-amber-900 pt-20 relative overflow-hidden">
      {/* Gala Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating Stars */}
        <div className="absolute top-1/4 left-1/4 w-6 h-6 text-yellow-400 animate-pulse">
          ⭐
        </div>
        <div className="absolute top-3/4 right-1/4 w-8 h-8 text-amber-400 animate-pulse delay-700">
          ✨
        </div>
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 text-yellow-300 animate-pulse delay-300">
          💫
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/50 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-2">💝 Charity Fundraiser</h1>
              <div className="flex items-center gap-2 justify-center">
                <span className="bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border border-amber-400/50 text-amber-300 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">🤝 Community Impact</span>
                <span className="bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border border-yellow-400/50 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold animate-pulse delay-200">🌟 Making a Difference</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-lg">Elegant fundraising event with auction and entertainment</p>
        </div>

        <div className="bg-gradient-to-br from-black/90 to-amber-900/40 backdrop-blur-xl border-2 border-amber-500/40 rounded-3xl p-8 shadow-2xl shadow-amber-600/30">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Organization Information */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Organization & Cause Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Organization Name *</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Your organization name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cause/Campaign Name *</label>
                  <input
                    type="text"
                    name="causeName"
                    value={formData.causeName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Name of the cause or campaign"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Fundraising Goal</label>
                  <input
                    type="text"
                    name="fundraisingGoal"
                    value={formData.fundraisingGoal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., $50,000 for education programs"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact Name *</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="contact@organization.org"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                Event Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Date *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expected Attendees</label>
                  <select
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={100} className="bg-slate-800">100 Attendees</option>
                    <option value={200} className="bg-slate-800">200 Attendees</option>
                    <option value={300} className="bg-slate-800">300 Attendees</option>
                    <option value={400} className="bg-slate-800">400 Attendees</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="" className="bg-slate-800">Select event type</option>
                    <option value="gala-dinner" className="bg-slate-800">Charity Gala Dinner</option>
                    <option value="auction-night" className="bg-slate-800">Auction Night</option>
                    <option value="benefit-concert" className="bg-slate-800">Benefit Concert</option>
                    <option value="walkathon" className="bg-slate-800">Charity Walk/Run</option>
                    <option value="awareness-event" className="bg-slate-800">Awareness Event</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Venue Preference</label>
                  <select
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="" className="bg-slate-800">Select venue</option>
                    <option value="hotel-ballroom" className="bg-slate-800">Hotel Ballroom</option>
                    <option value="community-center" className="bg-slate-800">Community Center</option>
                    <option value="outdoor-pavilion" className="bg-slate-800">Outdoor Pavilion</option>
                    <option value="museum-gallery" className="bg-slate-800">Museum/Gallery</option>
                    <option value="convention-center" className="bg-slate-800">Convention Center</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="auctionItems"
                      checked={formData.auctionItems}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500"
                    />
                    <label className="text-sm font-medium text-gray-300">Include silent auction with donated items</label>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={9000} className="bg-slate-800">$9,000 - $20,000</option>
                    <option value={25000} className="bg-slate-800">$20,000 - $40,000</option>
                    <option value={60000} className="bg-slate-800">$40,000 - $80,000</option>
                    <option value={120000} className="bg-slate-800">$80,000+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                Mission & Special Requirements
              </h3>
              
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Describe your mission, target beneficiaries, special speakers needed, entertainment preferences, or any other details..."
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
                disabled={!formData.organizationName || !formData.causeName || !formData.eventDate}
                className="flex-1 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-black py-4 rounded-xl font-bold hover:brightness-95 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-amber-600/50 border border-amber-500/50 animate-pulse"
              >
                Plan Charity Fundraiser 💚
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}