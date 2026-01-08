import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ImageWithFallback from '../components/ImageWithFallback'

export default function BookingSuccess() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [booking, setBooking] = useState((state as any)?.booking)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for PayPal return parameters
    const urlParams = new URLSearchParams(window.location.search)
    const paypalOrderId = urlParams.get('token') || urlParams.get('paymentId')
    const payerId = urlParams.get('PayerID')
    
    if (paypalOrderId && payerId && !booking) {
      // Handle PayPal return
      handlePayPalReturn(paypalOrderId, payerId)
    } else if (booking) {
      // Save booking to localStorage when we reach success page
      console.log('BookingSuccess - Full booking object:', booking)
      console.log('BookingSuccess - hotelName:', booking.hotelName)
      console.log('BookingSuccess - roomTitle:', booking.roomTitle)
      
      const existingBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
      
      // Check if this booking already exists
      const bookingExists = existingBookings.find((b: any) => b.id === booking.id)
      
      if (!bookingExists) {
        existingBookings.push(booking)
        localStorage.setItem('memberBookings', JSON.stringify(existingBookings))
        console.log('Booking saved:', booking)
        console.log('All bookings:', existingBookings)
      }
    }
  }, [booking])

  const handlePayPalReturn = async (orderId: string, payerId: string) => {
    setLoading(true)
    try {
      const userToken = localStorage.getItem('token') || localStorage.getItem('authToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`
      }

      // Get booking data from localStorage (saved during checkout)
      const pendingBooking = localStorage.getItem('pendingPayPalBooking')
      if (!pendingBooking) {
        throw new Error('No pending booking data found')
      }
      
      const bookingData = JSON.parse(pendingBooking)

      // Capture PayPal payment
      const response = await fetch('http://localhost:5000/api/payment/capture-paypal-payment', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          orderId: orderId,
          bookingData: bookingData
        })
      })

      if (!response.ok) {
        throw new Error('Payment capture failed')
      }

      const result = await response.json()
      
      if (result.success) {
        // Set the booking data
        setBooking(result.booking)
        // Clean up pending booking
        localStorage.removeItem('pendingPayPalBooking')
      } else {
        throw new Error(result.message || 'Payment capture failed')
      }
    } catch (error) {
      console.error('PayPal return handling error:', error)
      // Don't redirect, just show error state
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
          <p className="text-gray-600 mb-6">Please wait while we confirm your PayPal payment...</p>
        </div>
      </div>
    )
  }

  if (!booking && !loading) {
    // Check if we have PayPal parameters but no booking yet
    const urlParams = new URLSearchParams(window.location.search)
    const paypalOrderId = urlParams.get('token') || urlParams.get('paymentId')
    const payerId = urlParams.get('PayerID')
    
    if (paypalOrderId && payerId) {
      // PayPal return detected but processing failed
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Processing Failed</h1>
            <p className="text-gray-600 mb-6">There was an issue processing your PayPal payment. Please try booking again.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate('/')} 
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Go Home
              </button>
              <button 
                onClick={() => navigate('/checkout')} 
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    // No booking and no PayPal parameters
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">No booking information was found. If you just completed a booking, please return to the site and try again.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-pulse">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">Your reservation has been successfully processed</p>
        </div>

        {/* Main Booking Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{booking.hotelName}</h2>
                <p className="text-blue-100 mt-1">Booking Reference: #{booking.id?.slice(-8) || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Total Amount</p>
                <p className="text-3xl font-bold">${booking.amount ?? booking.total ?? '0'}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Room Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Room Details
                  </h3>
                  
                  <div className="bg-gray-50 rounded-2xl p-6">
                    {booking.roomImage && (
                      <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                        <ImageWithFallback 
                          src={booking.roomImage} 
                          alt={booking.roomTitle || 'Room'} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">{booking.roomTitle || booking.roomName || 'Room'}</h4>
                    
                    <div className="space-y-3">
                      {booking.checkIn && booking.checkOut && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Check-in:</span>
                          <span className="ml-2">{new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      )}
                      
                      {booking.checkOut && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Check-out:</span>
                          <span className="ml-2">{new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      )}
                      
                      {booking.guests && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <span className="font-medium">Guests:</span>
                          <span className="ml-2">{booking.guests}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Guest Information
                  </h3>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-semibold text-gray-900">{booking.guest?.name ?? booking.guestName ?? 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-semibold text-gray-900">{booking.guest?.email ?? 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-semibold text-gray-900">{booking.guest?.phone ?? 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payment Details
                  </h3>
                  
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-800 font-medium">Payment Status</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Confirmed</span>
                    </div>
                    {booking.paymentId && (
                      <div className="text-sm text-green-700">
                        Payment ID: {booking.paymentId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {booking.member ? (
            <button 
              onClick={() => {
                const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
                if (memberData) {
                  const parsedMember = JSON.parse(memberData)
                  localStorage.setItem('member', JSON.stringify(parsedMember))
                  localStorage.setItem('memberCheckout', JSON.stringify(parsedMember))
                }
                navigate('/member-dashboard', { replace: true })
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Dashboard
            </button>
          ) : (
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </button>
          )}
          
          <button 
            onClick={() => window.print()} 
            className="flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  )
}