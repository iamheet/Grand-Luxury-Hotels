import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchMyBookings();
    } else {
      setError('No authentication token found. Please login first.');
      setLoading(false);
    }
  }, [token]);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response:', response.data);
      setBookings(response.data.bookings || []);
      setLoading(false);
    } catch (error) {
      console.error('Fetch Error:', error);
      setError(error.response?.data?.message || 'Failed to fetch bookings');
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove cancelled booking from state
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Cancel Error:', error);
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#28a745';
      case 'cancelled': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getBadgeColor = (bookingType) => {
    return bookingType === 'Exclusive Member' ? '#007bff' : '#6c757d';
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Loading your bookings...</h2>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchMyBookings} style={{ padding: '10px 20px', marginTop: '10px' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>My Bookings</h2>
      
      <button 
        onClick={fetchMyBookings} 
        style={{ 
          padding: '10px 20px', 
          marginBottom: '20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Refresh Bookings
      </button>
      
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
          <p>You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                border: '1px solid #eee'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ margin: 0, color: '#333' }}>{booking.hotelName || 'Hotel Name'}</h3>
                <span 
                  style={{
                    backgroundColor: getBadgeColor(booking.bookingType),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {booking.bookingType || 'Regular User'}
                  {booking.memberTier && ` - ${booking.memberTier}`}
                </span>
              </div>
              
              <div style={{ margin: '15px 0' }}>
                <p style={{ margin: '8px 0', color: '#555', fontSize: '14px' }}>
                  <strong>Location:</strong> {booking.location || 'N/A'}
                </p>
                <p style={{ margin: '8px 0', color: '#555', fontSize: '14px' }}>
                  <strong>Check-in:</strong> {formatDate(booking.checkIn)}
                </p>
                <p style={{ margin: '8px 0', color: '#555', fontSize: '14px' }}>
                  <strong>Check-out:</strong> {formatDate(booking.checkOut)}
                </p>
                <p style={{ margin: '8px 0', color: '#555', fontSize: '14px' }}>
                  <strong>Guests:</strong> {booking.guests || 'N/A'}
                </p>
                <p style={{ margin: '8px 0', color: '#555', fontSize: '14px' }}>
                  <strong>Price:</strong> ${booking.price || 'N/A'}
                </p>
                <p style={{ margin: '8px 0', color: '#555', fontSize: '14px' }}>
                  <strong>Booked on:</strong> {formatDate(booking.createdAt)}
                </p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                <span 
                  style={{
                    backgroundColor: getStatusColor(booking.status),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {(booking.status || 'confirmed').toUpperCase()}
                </span>
                
                {(booking.status === 'confirmed' || !booking.status) && (
                  <button 
                    onClick={() => cancelBooking(booking._id)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;