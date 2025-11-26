import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const CorporateGala: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    companyName: '',
    eventTitle: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    eventDate: '',
    attendeeCount: '',
    eventType: '',
    venue: '',
    budget: '',
    specialRequests: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = () => {
    alert('Button clicked!')
    console.log('Form submitted:', formData)
    
    localStorage.setItem('memberCheckout', JSON.stringify({
      type: 'event',
      event: { name: `Corporate Gala - ${formData.eventTitle}`, price: 50000 }
    }))
    
    navigate('/member-checkout')
  }

  return (
    <Layout>
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

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/50 animate-pulse mx-auto mb-4">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-2">🏆 Corporate Gala Event</h1>
              <div className="flex items-center gap-2 justify-center">
                <span className="bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border border-amber-400/50 text-amber-300 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">🥂 Black Tie</span>
                <span className="bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border border-yellow-400/50 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold animate-pulse delay-200">🎩 Executive</span>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-black/90 to-amber-900/40 backdrop-blur-xl border-2 border-amber-500/40 rounded-3xl p-8 shadow-2xl shadow-amber-600/30">
              <div className="space-y-6">
                {/* Company Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 2h6v4H7V6zm8 8v2a1 1 0 001-1v-1h-1zm-2-2H7v4h6v-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-amber-300">Company Information</h3>
                    </div>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:border-amber-400/50"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-amber-300">Event Details</h3>
                    </div>
                    <input
                      type="text"
                      name="eventTitle"
                      placeholder="Event Title"
                      value={formData.eventTitle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:border-amber-400/50"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-3 gap-6">
                  <input
                    type="text"
                    name="contactName"
                    placeholder="Contact Name"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:border-amber-400/50"
                  />
                  <input
                    type="email"
                    name="contactEmail"
                    placeholder="Contact Email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:border-amber-400/50"
                  />
                  <input
                    type="tel"
                    name="contactPhone"
                    placeholder="Contact Phone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:border-amber-400/50"
                  />
                </div>

                {/* Event Specifications */}
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:border-amber-400/50"
                  />
                  <input
                    type="number"
                    name="attendeeCount"
                    placeholder="Number of Attendees"
                    value={formData.attendeeCount}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:border-amber-400/50"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:border-amber-400/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select Event Type</option>
                    <option value="awards" style={{ backgroundColor: '#1f2937', color: 'white' }}>Awards Ceremony</option>
                    <option value="annual" style={{ backgroundColor: '#1f2937', color: 'white' }}>Annual Gala</option>
                    <option value="fundraising" style={{ backgroundColor: '#1f2937', color: 'white' }}>Corporate Fundraising</option>
                    <option value="milestone" style={{ backgroundColor: '#1f2937', color: 'white' }}>Company Milestone</option>
                    <option value="networking" style={{ backgroundColor: '#1f2937', color: 'white' }}>Executive Networking</option>
                    <option value="product" style={{ backgroundColor: '#1f2937', color: 'white' }}>Product Launch Gala</option>
                  </select>
                  
                  <select
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:border-amber-400/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select Venue Preference</option>
                    <option value="ballroom" style={{ backgroundColor: '#1f2937', color: 'white' }}>Grand Ballroom</option>
                    <option value="rooftop" style={{ backgroundColor: '#1f2937', color: 'white' }}>Luxury Rooftop</option>
                    <option value="mansion" style={{ backgroundColor: '#1f2937', color: 'white' }}>Private Mansion</option>
                    <option value="yacht" style={{ backgroundColor: '#1f2937', color: 'white' }}>Luxury Yacht</option>
                    <option value="museum" style={{ backgroundColor: '#1f2937', color: 'white' }}>Premium Museum</option>
                    <option value="custom" style={{ backgroundColor: '#1f2937', color: 'white' }}>Custom Location</option>
                  </select>
                </div>

                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:border-amber-400/50"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select Budget Range</option>
                  <option value="50000-100000" style={{ backgroundColor: '#1f2937', color: 'white' }}>$50,000 - $100,000</option>
                  <option value="100000-250000" style={{ backgroundColor: '#1f2937', color: 'white' }}>$100,000 - $250,000</option>
                  <option value="250000-500000" style={{ backgroundColor: '#1f2937', color: 'white' }}>$250,000 - $500,000</option>
                  <option value="500000-1000000" style={{ backgroundColor: '#1f2937', color: 'white' }}>$500,000 - $1,000,000</option>
                  <option value="1000000+" style={{ backgroundColor: '#1f2937', color: 'white' }}>$1,000,000+</option>
                </select>

                <textarea
                  name="specialRequests"
                  placeholder="Special Requirements & Additional Services"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all hover:border-amber-400/50"
                />

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-black py-4 rounded-xl font-bold hover:brightness-95 transition-all transform hover:scale-105 shadow-2xl shadow-amber-600/50 border border-amber-500/50 animate-pulse"
                >
                  Plan Corporate Gala Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CorporateGala