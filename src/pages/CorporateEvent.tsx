import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CorporateEvent() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    eventType: '',
    eventDate: '',
    eventDuration: '',
    attendeeCount: '',
    venue: '',
    budget: '',
    catering: '',
    techRequirements: '',
    specialRequests: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('memberCheckout', JSON.stringify({
      type: 'business',
      business: { name: 'Corporate Event Planning', price: 2500 },
      corporateDetails: formData
    }))
    navigate('/member-checkout')
  }

  const inputStyle = {
    width: '100%',
    padding: '15px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '2px solid #3b82f6',
    borderRadius: '10px',
    color: 'white',
    fontSize: '16px',
    outline: 'none'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#3b82f6',
    fontSize: '18px',
    fontWeight: 'bold'
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1e293b, #334155, #475569)',
      minHeight: '100vh',
      padding: '40px 20px',
      color: 'white'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            background: 'linear-gradient(45deg, #3b82f6, #1d4ed8, #1e40af)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            textShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
          }}>
            💼 Corporate Event Planning
          </h1>
          <p style={{ fontSize: '20px', color: '#cccccc' }}>
            Professional event management for executive-level corporate gatherings
          </p>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '40px',
          borderRadius: '20px',
          border: '3px solid #3b82f6',
          boxShadow: '0 0 50px rgba(59, 130, 246, 0.3)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '24px', color: '#3b82f6', marginBottom: '20px' }}>🏢 Company Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    required
                    style={inputStyle}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    required
                    style={inputStyle}
                    placeholder="Primary contact name"
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    required
                    style={inputStyle}
                    placeholder="business@company.com"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    required
                    style={inputStyle}
                    placeholder="Business contact number"
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '24px', color: '#10b981', marginBottom: '20px' }}>📅 Event Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                    required
                    style={inputStyle}
                  >
                    <option value="" style={{color: 'black'}}>Select Event Type</option>
                    <option value="conference" style={{color: 'black'}}>Corporate Conference</option>
                    <option value="seminar" style={{color: 'black'}}>Executive Seminar</option>
                    <option value="product-launch" style={{color: 'black'}}>Product Launch</option>
                    <option value="board-meeting" style={{color: 'black'}}>Board Meeting</option>
                    <option value="team-building" style={{color: 'black'}}>Team Building</option>
                    <option value="awards-ceremony" style={{color: 'black'}}>Awards Ceremony</option>
                    <option value="networking" style={{color: 'black'}}>Networking Event</option>
                    <option value="training" style={{color: 'black'}}>Corporate Training</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Event Date</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div>
                  <label style={labelStyle}>Duration</label>
                  <select
                    value={formData.eventDuration}
                    onChange={(e) => setFormData({...formData, eventDuration: e.target.value})}
                    required
                    style={inputStyle}
                  >
                    <option value="" style={{color: 'black'}}>Select Duration</option>
                    <option value="half-day" style={{color: 'black'}}>Half Day (4 hours)</option>
                    <option value="full-day" style={{color: 'black'}}>Full Day (8 hours)</option>
                    <option value="multi-day" style={{color: 'black'}}>Multi-Day Event</option>
                    <option value="evening" style={{color: 'black'}}>Evening Event (3-4 hours)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Expected Attendees</label>
                  <select
                    value={formData.attendeeCount}
                    onChange={(e) => setFormData({...formData, attendeeCount: e.target.value})}
                    required
                    style={inputStyle}
                  >
                    <option value="" style={{color: 'black'}}>Select Attendee Count</option>
                    <option value="10-25" style={{color: 'black'}}>10-25 People</option>
                    <option value="25-50" style={{color: 'black'}}>25-50 People</option>
                    <option value="50-100" style={{color: 'black'}}>50-100 People</option>
                    <option value="100-200" style={{color: 'black'}}>100-200 People</option>
                    <option value="200+" style={{color: 'black'}}>200+ People</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '24px', color: '#f59e0b', marginBottom: '20px' }}>🏛️ Venue & Services</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Preferred Venue</label>
                  <select
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    required
                    style={inputStyle}
                  >
                    <option value="" style={{color: 'black'}}>Select Venue Type</option>
                    <option value="hotel-ballroom" style={{color: 'black'}}>Luxury Hotel Ballroom</option>
                    <option value="conference-center" style={{color: 'black'}}>Executive Conference Center</option>
                    <option value="private-club" style={{color: 'black'}}>Private Members Club</option>
                    <option value="rooftop-venue" style={{color: 'black'}}>Premium Rooftop Venue</option>
                    <option value="yacht-charter" style={{color: 'black'}}>Private Yacht Charter</option>
                    <option value="custom-location" style={{color: 'black'}}>Custom Location</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Catering Requirements</label>
                  <select
                    value={formData.catering}
                    onChange={(e) => setFormData({...formData, catering: e.target.value})}
                    required
                    style={inputStyle}
                  >
                    <option value="" style={{color: 'black'}}>Select Catering</option>
                    <option value="breakfast" style={{color: 'black'}}>Executive Breakfast</option>
                    <option value="lunch" style={{color: 'black'}}>Business Lunch</option>
                    <option value="dinner" style={{color: 'black'}}>Formal Dinner</option>
                    <option value="cocktail" style={{color: 'black'}}>Cocktail Reception</option>
                    <option value="coffee-breaks" style={{color: 'black'}}>Coffee Breaks Only</option>
                    <option value="full-service" style={{color: 'black'}}>Full Service Catering</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '24px', color: '#8b5cf6', marginBottom: '20px' }}>💰 Budget & Technology</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Budget Range</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    required
                    style={inputStyle}
                  >
                    <option value="" style={{color: 'black'}}>Select Budget Range</option>
                    <option value="5000-10000" style={{color: 'black'}}>$5,000 - $10,000</option>
                    <option value="10000-25000" style={{color: 'black'}}>$10,000 - $25,000</option>
                    <option value="25000-50000" style={{color: 'black'}}>$25,000 - $50,000</option>
                    <option value="50000-100000" style={{color: 'black'}}>$50,000 - $100,000</option>
                    <option value="100000+" style={{color: 'black'}}>$100,000+</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Technology Requirements</label>
                  <select
                    value={formData.techRequirements}
                    onChange={(e) => setFormData({...formData, techRequirements: e.target.value})}
                    required
                    style={inputStyle}
                  >
                    <option value="" style={{color: 'black'}}>Select Tech Needs</option>
                    <option value="basic-av" style={{color: 'black'}}>Basic Audio/Visual</option>
                    <option value="presentation-setup" style={{color: 'black'}}>Presentation Setup</option>
                    <option value="video-conferencing" style={{color: 'black'}}>Video Conferencing</option>
                    <option value="live-streaming" style={{color: 'black'}}>Live Streaming</option>
                    <option value="full-production" style={{color: 'black'}}>Full Production Setup</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={labelStyle}>✨ Special Requirements & Additional Services</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                style={{
                  ...inputStyle,
                  height: '120px',
                  resize: 'vertical'
                }}
                placeholder="Transportation arrangements, VIP services, entertainment, branding requirements, security needs, special dietary requirements, etc."
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                color: 'white',
                padding: '20px',
                border: 'none',
                borderRadius: '15px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.3s ease',
                marginBottom: '30px'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              💼 Request Corporate Event Planning - Starting at $2,500
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={() => navigate('/business-services')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              padding: '15px 30px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            ← Back to Business Services
          </button>
        </div>
      </div>
    </div>
  )
}