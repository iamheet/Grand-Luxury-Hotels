import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RedCarpetStyling() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: '',
    eventType: '',
    eventVenue: '',
    stylingPreference: '',
    budgetRange: '',
    specialRequests: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('memberCheckout', JSON.stringify({
      type: 'styling',
      styling: { name: 'Red Carpet Styling', price: 1500 },
      stylingDetails: formData
    }))
    navigate('/member-checkout')
  }

  const inputStyle = {
    width: '100%',
    padding: '15px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: '2px solid #d4af37',
    borderRadius: '10px',
    color: 'white',
    fontSize: '16px',
    outline: 'none'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#d4af37',
    fontSize: '18px',
    fontWeight: 'bold'
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #000000, #1a0033, #330066, #4d0080)',
      minHeight: '100vh',
      padding: '40px 20px',
      color: 'white'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            background: 'linear-gradient(45deg, #d4af37, #ffd700, #ffed4e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.5)'
          }}>
            👗 Royal Red Carpet Styling
          </h1>
          <p style={{ fontSize: '20px', color: '#cccccc' }}>
            Exclusive celebrity-level styling for prestigious events
          </p>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '40px',
          borderRadius: '20px',
          border: '3px solid #d4af37',
          boxShadow: '0 0 50px rgba(212, 175, 55, 0.3)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '30px' }}>
              <div>
                <label style={labelStyle}>👤 Full Name</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  required
                  style={inputStyle}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label style={labelStyle}>📧 Email Address</label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                  required
                  style={inputStyle}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '30px' }}>
              <div>
                <label style={labelStyle}>📱 Phone Number</label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                  required
                  style={inputStyle}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label style={labelStyle}>📅 Event Date</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '30px' }}>
              <div>
                <label style={labelStyle}>🎭 Event Type</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                  required
                  style={inputStyle}
                >
                  <option value="" style={{color: 'black'}}>Select Event Type</option>
                  <option value="gala" style={{color: 'black'}}>Royal Gala Dinner</option>
                  <option value="awards" style={{color: 'black'}}>Awards Ceremony</option>
                  <option value="premiere" style={{color: 'black'}}>Movie Premiere</option>
                  <option value="wedding" style={{color: 'black'}}>Luxury Wedding</option>
                  <option value="charity" style={{color: 'black'}}>Charity Gala</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>🏛️ Event Venue</label>
                <select
                  value={formData.eventVenue}
                  onChange={(e) => setFormData({...formData, eventVenue: e.target.value})}
                  required
                  style={inputStyle}
                >
                  <option value="" style={{color: 'black'}}>Select Event Venue</option>
                  <option value="Beverly Hills Hotel" style={{color: 'black'}}>Beverly Hills Hotel</option>
                  <option value="The Plaza New York" style={{color: 'black'}}>The Plaza New York</option>
                  <option value="Ritz Carlton Paris" style={{color: 'black'}}>Ritz Carlton Paris</option>
                  <option value="Four Seasons London" style={{color: 'black'}}>Four Seasons London</option>
                  <option value="Burj Al Arab Dubai" style={{color: 'black'}}>Burj Al Arab Dubai</option>
                  <option value="The Savoy London" style={{color: 'black'}}>The Savoy London</option>
                  <option value="Hotel de Crillon Paris" style={{color: 'black'}}>Hotel de Crillon Paris</option>
                  <option value="The St. Regis Rome" style={{color: 'black'}}>The St. Regis Rome</option>
                  <option value="Mandarin Oriental Tokyo" style={{color: 'black'}}>Mandarin Oriental Tokyo</option>
                  <option value="Custom Venue" style={{color: 'black'}}>Custom Venue</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '30px' }}>
              <div>
                <label style={labelStyle}>💄 Styling Preference</label>
                <select
                  value={formData.stylingPreference}
                  onChange={(e) => setFormData({...formData, stylingPreference: e.target.value})}
                  required
                  style={inputStyle}
                >
                  <option value="" style={{color: 'black'}}>Select Styling Preference</option>
                  <option value="classic" style={{color: 'black'}}>Classic Royal Elegance</option>
                  <option value="modern" style={{color: 'black'}}>Modern Luxury Chic</option>
                  <option value="glamorous" style={{color: 'black'}}>Hollywood Glamour</option>
                  <option value="avant-garde" style={{color: 'black'}}>Avant-Garde Couture</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>💰 Investment Range</label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
                  required
                  style={inputStyle}
                >
                  <option value="" style={{color: 'black'}}>Select Investment Range</option>
                  <option value="1500-3000" style={{color: 'black'}}>Royal Package: $1,500 - $3,000</option>
                  <option value="3000-5000" style={{color: 'black'}}>Imperial Package: $3,000 - $5,000</option>
                  <option value="5000-10000" style={{color: 'black'}}>Platinum Package: $5,000 - $10,000</option>
                  <option value="10000+" style={{color: 'black'}}>Diamond Elite: $10,000+</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={labelStyle}>✨ Special Requirements & Designer Preferences</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                style={{
                  ...inputStyle,
                  height: '120px',
                  resize: 'vertical'
                }}
                placeholder="Share any special requirements, designer preferences, or styling notes..."
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(45deg, #d4af37, #ffd700, #ffed4e)',
                color: 'black',
                padding: '20px',
                border: 'none',
                borderRadius: '15px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)',
                transition: 'all 0.3s ease',
                marginBottom: '30px'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              👑 Reserve Royal Red Carpet Styling - $1,500 👑
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={() => navigate('/personal-shopping')}
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
            ← Back to Personal Shopping
          </button>
        </div>
      </div>
    </div>
  )
}