import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HotelBookingForm = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [bookingData, setBookingData] = useState({
    hotelName: '',
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    price: '',
    // User details (auto-filled)
    guestName: '',
    guestEmail: '',
    guestPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const user = response.data.user;
      setUserProfile(user);
      
      // Auto-fill user details
      setBookingData(prev => ({
        ...prev,
        guestName: user.name || '',
        guestEmail: user.email || '',
        guestPhone: user.phone || ''
      }));
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Please login to make a booking');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        hotelName: bookingData.hotelName,
        location: bookingData.location,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: parseInt(bookingData.guests),
        price: parseFloat(bookingData.price)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('Booking created successfully!');
      
      // Reset form
      setBookingData(prev => ({
        hotelName: '',
        location: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        price: '',
        guestName: prev.guestName, // Keep user details
        guestEmail: prev.guestEmail,
        guestPhone: prev.guestPhone
      }));
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Please Login</h2>
        <p>You need to login to make a hotel booking.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Book Your Hotel</h2>
      
      {userProfile && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Booking for:</h4>
          <p style={{ margin: '5px 0', color: '#555' }}>
            <strong>{userProfile.name}</strong> 
            {userProfile.isExclusive && (
              <span style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '12px', 
                marginLeft: '10px' 
              }}>
                {userProfile.membershipTier} Member
              </span>
            )}
          </p>
          <p style={{ margin: '5px 0', color: '#555' }}>{userProfile.email}</p>
          {userProfile.phone && <p style={{ margin: '5px 0', color: '#555' }}>{userProfile.phone}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Hotel Details */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Hotel Name *
          </label>
          <input
            type="text"
            name="hotelName"
            value={bookingData.hotelName}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
            placeholder="Enter hotel name"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={bookingData.location}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
            placeholder="Enter location"
          />
        </div>

        {/* Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Check-in Date *
            </label>
            <input
              type="date"
              name="checkIn"
              value={bookingData.checkIn}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Check-out Date *
            </label>
            <input
              type="date"
              name="checkOut"
              value={bookingData.checkOut}
              onChange={handleInputChange}
              required
              min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        {/* Guests and Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Number of Guests *
            </label>
            <select
              name="guests"
              value={bookingData.guests}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            >
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Total Price ($) *
            </label>
            <input
              type="number"
              name="price"
              value={bookingData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Guest Details (Auto-filled, Read-only) */}
        <div style={{ 
          backgroundColor: '#e9ecef', 
          padding: '15px', 
          borderRadius: '8px',
          border: '1px solid #ced4da'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>Guest Information (Auto-filled)</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            <input
              type="text"
              value={bookingData.guestName}
              readOnly
              style={{
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                color: '#6c757d'
              }}
              placeholder="Guest Name"
            />
            
            <input
              type="email"
              value={bookingData.guestEmail}
              readOnly
              style={{
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                color: '#6c757d'
              }}
              placeholder="Guest Email"
            />
            
            <input
              type="tel"
              value={bookingData.guestPhone}
              readOnly
              style={{
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                color: '#6c757d'
              }}
              placeholder="Guest Phone"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '15px',
            backgroundColor: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {loading ? 'Creating Booking...' : 'Book Now'}
        </button>
      </form>

      {/* Message */}
      {message && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '8px',
          backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
          color: message.includes('success') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('success') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default HotelBookingForm;