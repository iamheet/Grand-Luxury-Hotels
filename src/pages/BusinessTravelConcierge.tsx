import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BusinessTravelConcierge() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    companyName: '',
    travelerName: '',
    contactEmail: '',
    contactPhone: '',
    travelType: '',
    departure: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    travelers: '',
    accommodation: '',
    transportation: '',
    specialRequests: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('memberCheckout', JSON.stringify({
      type: 'business',
      business: { name: 'Business Travel Concierge', price: 800 },
      travelDetails: formData
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
            background: 'linear-gradient(45deg, #10b981, #059669)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            ✈️ Business Travel Concierge
          </h1>
          <p style={{ fontSize: '20px', color: '#cccccc' }}>
            Complete travel arrangements for executives and teams
          </p>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '40px',
          borderRadius: '20px',
          border: '3px solid #10b981'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <input
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
              <input
                type="text"
                placeholder="Traveler Name"
                value={formData.travelerName}
                onChange={(e) => setFormData({...formData, travelerName: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.contactPhone}
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <select
                value={formData.travelType}
                onChange={(e) => setFormData({...formData, travelType: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              >
                <option value="" style={{color: 'black'}}>Travel Type</option>
                <option value="business-meeting" style={{color: 'black'}}>Business Meeting</option>
                <option value="conference" style={{color: 'black'}}>Conference/Event</option>
                <option value="client-visit" style={{color: 'black'}}>Client Visit</option>
                <option value="team-retreat" style={{color: 'black'}}>Team Retreat</option>
                <option value="executive-travel" style={{color: 'black'}}>Executive Travel</option>
              </select>
              <select
                value={formData.travelers}
                onChange={(e) => setFormData({...formData, travelers: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              >
                <option value="" style={{color: 'black'}}>Number of Travelers</option>
                <option value="1" style={{color: 'black'}}>1 Person</option>
                <option value="2-5" style={{color: 'black'}}>2-5 People</option>
                <option value="6-10" style={{color: 'black'}}>6-10 People</option>
                <option value="11+" style={{color: 'black'}}>11+ People</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <input
                type="text"
                placeholder="Departure City"
                value={formData.departure}
                onChange={(e) => setFormData({...formData, departure: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
              <input
                type="text"
                placeholder="Destination City"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <input
                type="date"
                placeholder="Departure Date"
                value={formData.departureDate}
                onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
              <input
                type="date"
                placeholder="Return Date"
                value={formData.returnDate}
                onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <select
                value={formData.accommodation}
                onChange={(e) => setFormData({...formData, accommodation: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              >
                <option value="" style={{color: 'black'}}>Accommodation Preference</option>
                <option value="luxury-hotel" style={{color: 'black'}}>Luxury Hotel</option>
                <option value="business-hotel" style={{color: 'black'}}>Business Hotel</option>
                <option value="executive-suite" style={{color: 'black'}}>Executive Suite</option>
                <option value="corporate-housing" style={{color: 'black'}}>Corporate Housing</option>
              </select>
              <select
                value={formData.transportation}
                onChange={(e) => setFormData({...formData, transportation: e.target.value})}
                required
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px' }}
              >
                <option value="" style={{color: 'black'}}>Transportation Needs</option>
                <option value="airport-transfer" style={{color: 'black'}}>Airport Transfer Only</option>
                <option value="chauffeur-service" style={{color: 'black'}}>Full Chauffeur Service</option>
                <option value="rental-car" style={{color: 'black'}}>Luxury Rental Car</option>
                <option value="private-jet" style={{color: 'black'}}>Private Jet Charter</option>
              </select>
            </div>

            <textarea
              placeholder="Special Requirements (dietary restrictions, accessibility needs, meeting arrangements, etc.)"
              value={formData.specialRequests}
              onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
              style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', border: '2px solid #10b981', borderRadius: '10px', color: 'white', fontSize: '16px', height: '100px', marginBottom: '30px' }}
            />

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(45deg, #10b981, #059669)',
                color: 'white',
                padding: '20px',
                border: 'none',
                borderRadius: '15px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ✈️ Request Business Travel Concierge - $800
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