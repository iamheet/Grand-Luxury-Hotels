import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ExecutiveMeetingRooms() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    meetingDate: '',
    duration: '',
    attendees: '',
    roomType: '',
    catering: '',
    techNeeds: '',
    specialRequests: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('memberCheckout', JSON.stringify({
      type: 'business',
      business: { name: 'Executive Meeting Rooms', price: 500 },
      meetingDetails: formData
    }))
    navigate('/member-checkout')
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1e293b, #334155, #475569)',
      minHeight: '100vh',
      padding: '40px 20px',
      color: 'white'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            🏢 Executive Meeting Rooms
          </h1>
          <p style={{ fontSize: '20px', color: '#cccccc' }}>
            Premium boardrooms with state-of-the-art technology and catering
          </p>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '40px',
          borderRadius: '20px',
          border: '3px solid #3b82f6'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <input
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #3b82f6', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
              <input
                type="text"
                placeholder="Contact Name"
                value={formData.contactName}
                onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #3b82f6', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #3b82f6', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.contactPhone}
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #3b82f6', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <input
                type="date"
                value={formData.meetingDate}
                onChange={(e) => setFormData({...formData, meetingDate: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #3b82f6', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #3b82f6', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              >
                <option value="" style={{color: 'black'}}>Meeting Duration</option>
                <option value="2-hours" style={{color: 'black'}}>2 Hours</option>
                <option value="4-hours" style={{color: 'black'}}>4 Hours</option>
                <option value="full-day" style={{color: 'black'}}>Full Day</option>
                <option value="multi-day" style={{color: 'black'}}>Multi-Day</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <select
                value={formData.attendees}
                onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #3b82f6', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              >
                <option value="" style={{color: 'black'}}>Number of Attendees</option>
                <option value="2-5" style={{color: 'black'}}>2-5 People</option>
                <option value="6-10" style={{color: 'black'}}>6-10 People</option>
                <option value="11-20" style={{color: 'black'}}>11-20 People</option>
                <option value="21-50" style={{color: 'black'}}>21-50 People</option>
              </select>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #3b82f6', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              >
                <option value="" style={{color: 'black'}}>Room Type</option>
                <option value="executive-boardroom" style={{color: 'black'}}>Executive Boardroom</option>
                <option value="conference-room" style={{color: 'black'}}>Conference Room</option>
                <option value="presentation-theater" style={{color: 'black'}}>Presentation Theater</option>
                <option value="private-office" style={{color: 'black'}}>Private Office Suite</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <select
                value={formData.catering}
                onChange={(e) => setFormData({...formData, catering: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #3b82f6', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              >
                <option value="" style={{color: 'black'}}>Catering Options</option>
                <option value="coffee-tea" style={{color: 'black'}}>Coffee & Tea Service</option>
                <option value="continental-breakfast" style={{color: 'black'}}>Continental Breakfast</option>
                <option value="working-lunch" style={{color: 'black'}}>Working Lunch</option>
                <option value="full-catering" style={{color: 'black'}}>Full Catering Service</option>
              </select>
              <select
                value={formData.techNeeds}
                onChange={(e) => setFormData({...formData, techNeeds: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #3b82f6', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              >
                <option value="" style={{color: 'black'}}>Technology Requirements</option>
                <option value="basic-av" style={{color: 'black'}}>Basic Audio/Visual</option>
                <option value="video-conferencing" style={{color: 'black'}}>Video Conferencing</option>
                <option value="presentation-setup" style={{color: 'black'}}>Full Presentation Setup</option>
                <option value="live-streaming" style={{color: 'black'}}>Live Streaming Capability</option>
              </select>
            </div>

            <textarea
              placeholder="Special Requirements (IT support, security, accessibility needs, etc.)"
              value={formData.specialRequests}
              onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
              style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #3b82f6', borderRadius: '10px', color: 'white', fontSize: '16px', height: '100px', marginBottom: '30px' }}
            />

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
                cursor: 'pointer'
              }}
            >
              🏢 Reserve Executive Meeting Room - $500
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
              cursor: 'pointer'
            }}
          >
            ← Back to Business Services
          </button>
        </div>
      </div>
    </div>
  )
}