import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ImageWithFallback from '../components/ImageWithFallback'
import { API_ENDPOINTS } from '../config/api'
import { WhatsAppService } from '../utils/whatsappService'
import { EmailService } from '../utils/emailService'
import { getRazorpayOptions } from '../config/payment'

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
    Stripe: any;
  }
}

type RoomProp = {
  id: string
  title?: string
  name?: string
  image: string
  features?: string[]
  price: number
  guests?: number
  beds?: number
}

export default function Checkout() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const roomFromState = (state as any)?.room as RoomProp | undefined
  
  // Try to get room from state first, then from localStorage
  const storedRoom = typeof window !== 'undefined' ? localStorage.getItem('selectedRoom') : null
  const roomFromStorage = storedRoom ? JSON.parse(storedRoom) : null
  const room = roomFromState || roomFromStorage

  // If no room supplied, send user back to home or search
  useEffect(() => {
    if (!room) navigate('/', { replace: true })
    
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      document.body.removeChild(script)
    }
    
    // Check if user token is valid
    const checkTokenValidity = async () => {
      const userToken = localStorage.getItem('token') || localStorage.getItem('authToken')
      if (userToken) {
        try {
          const response = await fetch('http://localhost:5000/api/bookings', {
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token')
            localStorage.removeItem('authToken')
            localStorage.removeItem('user')
            localStorage.removeItem('member')
            navigate('/login', { replace: true })
            return
          }
        } catch (error) {
          console.error('Token validation error:', error)
        }
      }
    }
    
    checkTokenValidity()
    
    // Save pending booking when user leaves page
    const handleBeforeUnload = () => {
      if (room && (name || email || phone)) {
        const pendingBooking = {
          id: Date.now().toString(),
          room: room,
          guest: { name: name.trim(), email: email.trim(), phone: phone.trim() },
          checkIn: new Date().toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          guests: 1,
          nights: 1,
          total: room.price,
          bookingDate: new Date().toISOString(),
          status: 'pending',
          roomTitle: room.title || room.name,
          roomImage: room.image
        }
        
        const existingBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
        const alreadyExists = existingBookings.find((b: any) => 
          b.room?.id === room.id && b.status === 'pending' && b.guest?.email === email.trim()
        )
        
        if (!alreadyExists) {
          existingBookings.push(pendingBooking)
          localStorage.setItem('memberBookings', JSON.stringify(existingBookings))
        }
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [room, navigate])

  // auth / stored user detection
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') || localStorage.getItem('token') : null
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') || localStorage.getItem('member') || localStorage.getItem('memberCheckout') : null
  const parsedUser = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null

  // form fields
  const [name, setName] = useState(parsedUser?.name || '')
  const [email, setEmail] = useState(parsedUser?.email || '')
  const [phone, setPhone] = useState(parsedUser?.phone || '')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [createAccount, setCreateAccount] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [paymentGateway, setPaymentGateway] = useState<'razorpay' | 'paypal'>('razorpay')

  // simple price calculation
  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1
  const subtotal = room ? room.price * nights : 0
  const tax = Math.round(subtotal * 0.03) // 3% tax - rounded to integer
  const serviceCharge = Math.round(subtotal * 0.01) // 1% service charge - rounded to integer
  const total = subtotal + tax + serviceCharge

  async function doRegisterIfNeeded(): Promise<string | null> {
    // returns token or null
    if (!createAccount) return null
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      })

      const body = await res.json().catch(() => null)
      if (res.status === 201) {
        if (body?.token) {
          localStorage.setItem('authToken', body.token)
          return body.token
        }
        return null
      }

      if (res.status === 409) {
        throw new Error(body?.message || 'An account with this email already exists. Please log in.')
      }

      throw new Error(body?.message || `Registration failed (${res.status})`)
    } catch (err: any) {
      console.error('Registration error:', err)
      throw new Error(err?.message || 'Registration network error')
    }
  }

  async function handleConfirm(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    setSuccess(null)

    if (!room) {
      setError('No room selected.')
      return
    }

    if (!name || !email || !phone) {
      setError('Please provide name, email and phone number.')
      return
    }

    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates.')
      return
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError('Check-out date must be after check-in date.')
      return
    }

    if (new Date(checkIn) < new Date()) {
      setError('Check-in date cannot be in the past.')
      return
    }

    if (createAccount && password.length < 6) {
      setError('Password must be at least 6 characters to create an account.')
      return
    }

    setLoading(true)
    try {
      if (paymentGateway === 'paypal') {
        // Handle PayPal payment
        await handlePayPalPayment()
      } else {
        // Handle Razorpay payment
        await handleRazorpayPayment()
      }
    } catch (err: any) {
      console.error('Payment initialization error:', err)
      setError(err?.message || 'Payment initialization failed')
      setLoading(false)
    }
  }

  async function handleRazorpayPayment() {
    try {
      // Get auth token
      const userToken = localStorage.getItem('token') || localStorage.getItem('authToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`
      }

      // Create Razorpay order first
      const orderResponse = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: total * 100,
          currency: 'INR',
          bookingData: {
            hotelName: room.hotelName || room.hotel || room.title || room.name,
            roomTitle: room.title || room.name,
            customerName: name.trim(),
            customerEmail: email.trim().toLowerCase(),
            customerPhone: phone.trim()
          }
        })
      })
      
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text()
        console.error('Order creation failed:', orderResponse.status, errorText)
        throw new Error(`Payment order creation failed: ${orderResponse.status}`)
      }
      
      const orderData = await orderResponse.json()
      
      if (!orderData.success) {
        throw new Error('Failed to create payment order')
      }

      // Initialize Razorpay with centralized config
      const options = getRazorpayOptions(
        {
          amount: total * 100,
          currency: 'INR',
          orderId: orderData.orderId,
          description: `Booking for ${room.title || room.name} (${nights} night${nights > 1 ? 's' : ''})`,
          prefill: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            contact: phone.trim()
          }
        },
        {
          onSuccess: async (response: any) => {
            await verifyPaymentAndCreateBooking(response)
          },
          onCancel: () => {
            recordFailedPayment(orderData.orderId, null, 'Payment cancelled by user')
            setLoading(false)
          }
        }
      )

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        // Payment failed - record in database and show error
        recordFailedPayment(orderData.orderId, response.error.metadata.payment_id, response.error.description)
        setError(`Payment failed: ${response.error.description}. Please try again.`)
        setLoading(false)
      })
      rzp.open()
      
    } catch (err: any) {
      console.error('Razorpay initialization error:', err)
      setError(err?.message || 'Razorpay initialization failed')
      setLoading(false)
    }
  }

  async function handlePayPalPayment() {
    try {
      // Get auth token
      const userToken = localStorage.getItem('token') || localStorage.getItem('authToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`
      }

      // Save booking data for PayPal return
      const bookingData = {
        hotelName: room.hotelName || room.hotel || room.title || room.name,
        roomTitle: room.title || room.name,
        customerName: name.trim(),
        customerEmail: email.trim().toLowerCase(),
        customerPhone: phone.trim(),
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests,
        nights: nights,
        total: total,
        room: {
          title: room.title || room.name,
          ...room
        },
        guest: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim()
        }
      }
      
      // Save to localStorage for PayPal return
      localStorage.setItem('pendingPayPalBooking', JSON.stringify(bookingData))

      // Create PayPal order
      const orderResponse = await fetch('http://localhost:5000/api/payment/create-paypal-order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: total * 100, // Convert to cents
          currency: 'USD',
          bookingData: bookingData
        })
      })
      
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text()
        console.error('PayPal order creation failed:', orderResponse.status, errorText)
        throw new Error(`PayPal order creation failed: ${orderResponse.status}`)
      }
      
      const orderData = await orderResponse.json()
      
      if (!orderData.success || !orderData.approvalUrl) {
        throw new Error('Failed to create PayPal order')
      }

      // Redirect to PayPal for approval
      window.location.href = orderData.approvalUrl
      
    } catch (err: any) {
      console.error('PayPal initialization error:', err)
      setError(err?.message || 'PayPal initialization failed')
      setLoading(false)
    }
  }

  async function recordFailedPayment(orderId: string, paymentId: string | null, errorReason: string) {
    try {
      const userToken = localStorage.getItem('token') || localStorage.getItem('authToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`
      }

      await fetch('http://localhost:5000/api/payment/payment-failed', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          error: errorReason,
          bookingData: {
            hotelName: room.hotelName || room.hotel || room.title || room.name,
            roomTitle: room.title || room.name,
            customerName: name.trim(),
            customerEmail: email.trim().toLowerCase(),
            customerPhone: phone.trim(),
            total: room.price,
            guest: {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim()
            }
          }
        })
      })
    } catch (error) {
      console.error('Failed to record payment failure:', error)
    }
  }

  async function verifyPaymentAndCreateBooking(paymentResponse: any) {
    try {
      // Get auth token with better debugging
      const userToken = localStorage.getItem('token') || localStorage.getItem('authToken')
      console.log('Token found:', userToken ? 'Yes' : 'No')
      
      if (!userToken) {
        console.warn('No token found - user may not be logged in')
      }
      
      const authHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (userToken) {
        authHeaders['Authorization'] = `Bearer ${userToken}`
      }

      // Verify payment
      const verifyResponse = await fetch('http://localhost:5000/api/payment/verify-payment', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          bookingData: {
            userId: userToken ? 'authenticated_user' : 'guest_user',
            hotelName: room.hotelName || room.hotel || room.title || room.name,
            roomTitle: room.title || room.name,
            customerName: name.trim(),
            customerEmail: email.trim().toLowerCase(),
            customerPhone: phone.trim(),
            checkIn: checkIn,
            checkOut: checkOut,
            guests: guests,
            nights: nights,
            total: total,
            room: {
              title: room.title || room.name,
              ...room
            },
            guest: {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim()
            }
          }
        })
      })
      
      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text()
        console.error('Payment verification failed:', verifyResponse.status, errorText)
        throw new Error(`Payment verification failed: ${verifyResponse.status}`)
      }
      
      const verifyData = await verifyResponse.json()
      
      if (!verifyData.success) {
        throw new Error('Payment verification failed')
      }

      // Register user if needed
      let usedToken = token
      if (!usedToken && createAccount) {
        usedToken = await doRegisterIfNeeded()
      }

      // Create booking
      const backendData = {
        hotelName: room.hotelName || room.hotel || room.title || room.name || 'Hotel',
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests,
        nights: nights,
        status: 'confirmed',
        customerName: name.trim(),
        customerEmail: email.trim().toLowerCase(),
        customerPhone: phone.trim(),
        guestName: name.trim(),
        guestEmail: email.trim().toLowerCase(),
        guestPhone: phone.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        guest: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim()
        },
        room: {
          ...room,
          customerName: name.trim(),
          customerEmail: email.trim().toLowerCase(),
          customerPhone: phone.trim()
        },
        total: total,
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id
      }

      // NOTE: Booking is already created by verify-payment endpoint
      // No need to create another booking here
      
      // Send WhatsApp notifications
      try {
        const formattedPhone = WhatsAppService.formatPhoneNumber(phone.trim())
        
        // Send booking confirmation with all required fields
        await WhatsAppService.sendBookingConfirmation(formattedPhone, {
          hotelName: room.hotelName || room.hotel || room.title || room.name,
          roomType: room.title || room.name,
          checkIn: new Date(checkIn).toLocaleDateString(),
          checkOut: new Date(checkOut).toLocaleDateString(),
          guestName: name.trim(),
          bookingId: verifyData.booking._id,
          nights: nights,
          total: total
        })
        
        // Send payment confirmation
        await WhatsAppService.sendPaymentConfirmation(formattedPhone, {
          amount: total,
          paymentId: paymentResponse.razorpay_payment_id,
          guestName: name.trim()
        })
      } catch (whatsappError) {
        console.error('WhatsApp notification failed:', whatsappError)
        // Don't fail the booking if WhatsApp fails
      }

      // Send Email confirmation
      try {
        await EmailService.sendBookingConfirmation({
          guestName: name.trim(),
          guestEmail: email.trim().toLowerCase(),
          hotelName: room.hotelName || room.hotel || room.title || room.name,
          roomType: room.title || room.name,
          checkIn: new Date(checkIn).toLocaleDateString(),
          checkOut: new Date(checkOut).toLocaleDateString(),
          nights: nights,
          guests: guests,
          total: total,
          bookingId: verifyData.booking._id,
          paymentId: paymentResponse.razorpay_payment_id
        })
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
        // Don't fail the booking if Email fails
      }
      
      const booking = {
        id: verifyData.booking._id,
        hotelName: room.hotelName || room.hotel || room.title || room.name,
        roomTitle: room.title || room.name,
        roomImage: room.image,
        guest: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim()
        },
        total: total,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests,
        nights: nights,
        status: 'confirmed',
        paymentId: paymentResponse.razorpay_payment_id
      }
      
      localStorage.setItem('user', JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() }))
      navigate('/booking-success', { state: { booking } })
      
    } catch (err: any) {
      console.error('Booking creation error:', err)
      setError(err?.message || 'Booking failed after payment')
    } finally {
      setLoading(false)
    }
  }

  if (!room) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">You're just one step away from your perfect stay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleConfirm} className="space-y-6">
              {/* Booking Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date *
                    </label>
                    <input 
                      type="date"
                      value={checkIn} 
                      onChange={(e) => setCheckIn(e.target.value)} 
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Date *
                    </label>
                    <input 
                      type="date"
                      value={checkOut} 
                      onChange={(e) => setCheckOut(e.target.value)} 
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guests
                    </label>
                    <select 
                      value={guests} 
                      onChange={(e) => setGuests(Number(e.target.value))} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {checkIn && checkOut && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>{nights}</strong> night{nights > 1 ? 's' : ''} • <strong>{guests}</strong> guest{guests > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Gateway Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentGateway === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentGateway"
                      value="razorpay"
                      checked={paymentGateway === 'razorpay'}
                      onChange={(e) => setPaymentGateway(e.target.value as 'razorpay')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentGateway === 'razorpay' ? 'border-blue-500' : 'border-gray-300'
                      }`}>
                        {paymentGateway === 'razorpay' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Razorpay</div>
                        <div className="text-sm text-gray-500">UPI, Cards, Wallets & More</div>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentGateway === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentGateway"
                      value="paypal"
                      checked={paymentGateway === 'paypal'}
                      onChange={(e) => setPaymentGateway(e.target.value as 'paypal')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentGateway === 'paypal' ? 'border-blue-500' : 'border-gray-300'
                      }`}>
                        {paymentGateway === 'paypal' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">PayPal</div>
                        <div className="text-sm text-gray-500">Secure International Payments</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Guest Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {!token && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={createAccount} 
                        onChange={(e) => setCreateAccount(e.target.checked)} 
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Create an account</span>
                        <p className="text-xs text-gray-600 mt-1">Save your details for faster bookings in the future</p>
                      </div>
                    </label>

                    {createAccount && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password *
                        </label>
                        <input 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                          placeholder="Minimum 6 characters"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-700">{success}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24" width="20" height="20">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    `Pay with ${paymentGateway === 'razorpay' ? 'Razorpay' : 'PayPal'} • ₹${total}`
                  )}
                </button>

                <button 
                  type="button" 
                  onClick={() => navigate(-1)}
                  className="px-6 py-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              {/* Room Details */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <ImageWithFallback 
                      src={room.image} 
                      alt={room.title || room.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{room.title || room.name}</h4>
                    <p className="text-sm text-gray-600">{room.hotelName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-gray-500">{room.bedInfo}</span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {room.amenities && room.amenities.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Included amenities</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room rate ({nights} night{nights > 1 ? 's' : ''})</span>
                    <span className="text-gray-900">₹{room.price} × {nights}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes (3%)</span>
                    <span className="text-gray-900">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service charge (1%)</span>
                    <span className="text-gray-900">₹{serviceCharge}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-blue-600">₹{total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure SSL encrypted booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}