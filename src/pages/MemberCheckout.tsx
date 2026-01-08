import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../config/api'

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
    Stripe: any;
  }
}

export default function MemberCheckout() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const room = (state as any)?.room
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [guests, setGuests] = useState(1)
  const [nights, setNights] = useState(1)
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [selectedServices, setSelectedServices] = useState<any[]>([])
  const [showAddServices, setShowAddServices] = useState(false)
  const [paymentGateway, setPaymentGateway] = useState<'razorpay' | 'stripe'>('razorpay')

  useEffect(() => {
    // Check if member data exists first
    const memberData = localStorage.getItem('memberCheckout') || localStorage.getItem('member')
    if (!memberData) {
      navigate('/member-login', { replace: true })
      return
    }
    
    const parsedMember = JSON.parse(memberData)
    
    // Validate member data structure
    if (!parsedMember.name || !parsedMember.membershipId || !parsedMember.tier) {
      localStorage.removeItem('member')
      localStorage.removeItem('memberCheckout')
      navigate('/member-login', { replace: true })
      return
    }
    
    if (!room) {
      navigate('/member-dashboard', { replace: true })
      return
    }
    
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    
    setMember(parsedMember)
    setGuestEmail(parsedMember.email || '')
    setGuestPhone(parsedMember.phone || '')

    // Load cart from localStorage or initialize with room
    const savedCart = localStorage.getItem('memberCart')
    if (savedCart) {
      setSelectedServices(JSON.parse(savedCart))
    } else if (room) {
      const initialCart = [room]
      setSelectedServices(initialCart)
      localStorage.setItem('memberCart', JSON.stringify(initialCart))
    }

    // Set default dates
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    setCheckInDate(today.toISOString().split('T')[0])
    setCheckOutDate(tomorrow.toISOString().split('T')[0])

    // Save pending booking when user leaves page
    const handleBeforeUnload = () => {
      if (room && member && (guestEmail || guestPhone)) {
        const pendingBooking = room?.type === 'aircraft' ? {
          id: Date.now().toString(),
          type: 'aircraft',
          aircraft: room.aircraft,
          room: room,
          member: member,
          guest: {
            name: member.name,
            email: guestEmail,
            phone: guestPhone
          },
          total: room.aircraft.price,
          bookingDate: new Date().toISOString(),
          status: 'pending'
        } : {
          id: Date.now().toString(),
          type: 'hotel',
          room: room,
          member: member,
          guest: {
            name: member.name,
            email: guestEmail,
            phone: guestPhone
          },
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: guests,
          nights: nights,
          total: room.price * nights,
          bookingDate: new Date().toISOString(),
          status: 'pending'
        }

        const existingBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
        const alreadyExists = existingBookings.find((b: any) =>
          b.room?.id === room.id && b.status === 'pending' && b.member?.membershipId === member.membershipId
        )

        if (!alreadyExists) {
          existingBookings.push(pendingBooking)
          localStorage.setItem('memberBookings', JSON.stringify(existingBookings))
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (script.parentNode) {
        document.body.removeChild(script)
      }
    }
  }, [room, navigate])

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate)
      const end = new Date(checkOutDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNights(diffDays > 0 ? diffDays : 1)
    }
  }, [checkInDate, checkOutDate])

  const handleConfirm = async () => {
    setLoading(true)

    try {
      if (paymentGateway === 'stripe') {
        // Handle Stripe payment
        await handleStripePayment()
      } else {
        // Handle Razorpay payment
        await handleRazorpayPayment()
      }
    } catch (error) {
      console.error('Payment initialization error:', error)
      alert('Payment initialization failed. Please try again.')
      setLoading(false)
    }
  }

  async function handleRazorpayPayment() {
    try {
      // Get auth token
      const userToken = localStorage.getItem('token')
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
            hotelName: selectedServices[0]?.hotelName || selectedServices[0]?.name || 'Service',
            roomTitle: selectedServices[0]?.title || selectedServices[0]?.name,
            customerName: member.name,
            customerEmail: guestEmail || member.email,
            customerPhone: guestPhone || member.phone
          }
        })
      })
      
      if (!orderResponse.ok) {
        throw new Error(`Payment order creation failed: ${orderResponse.status}`)
      }
      
      const orderData = await orderResponse.json()
      
      if (!orderData.success) {
        throw new Error('Failed to create payment order')
      }

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_S0tJBd3NSaEud8',
        amount: total * 100,
        currency: 'INR',
        name: 'The Grand Stay - Exclusive Member',
        description: `Exclusive booking for ${selectedServices[0]?.name || 'services'}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          await verifyPaymentAndCreateBooking(response)
        },
        prefill: {
          name: member.name,
          email: guestEmail || member.email,
          contact: guestPhone || member.phone
        },
        theme: {
          color: '#D4AF37'
        },
        modal: {
          ondismiss: function() {
            recordFailedPayment(orderData.orderId, null, 'Payment cancelled by user')
            setLoading(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        recordFailedPayment(orderData.orderId, response.error.metadata.payment_id, response.error.description)
        alert(`Payment failed: ${response.error.description}. Please try again.`)
        setLoading(false)
      })
      rzp.open()
      
    } catch (error) {
      console.error('Razorpay initialization error:', error)
      alert('Razorpay initialization failed. Please try again.')
      setLoading(false)
    }
  }

  async function handleStripePayment() {
    try {
      // Load Stripe script if not already loaded
      if (!window.Stripe) {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/'
        script.async = true
        document.head.appendChild(script)
        
        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
      
      // Create payment intent on backend
      const userToken = localStorage.getItem('token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`
      }

      const response = await fetch('http://localhost:5000/api/payment/create-stripe-session', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: total * 100, // Convert to cents
          currency: 'usd',
          bookingData: {
            hotelName: selectedServices[0]?.hotelName || selectedServices[0]?.name || 'Service',
            roomTitle: selectedServices[0]?.title || selectedServices[0]?.name,
            customerName: member.name,
            customerEmail: guestEmail || member.email,
            customerPhone: guestPhone || member.phone,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: guests,
            nights: nights,
            total: total
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success || !data.sessionId) {
        throw new Error('Failed to create Stripe session')
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      })

      if (error) {
        alert(error.message || 'Stripe payment failed')
        setLoading(false)
      }
      
    } catch (err: any) {
      console.error('Stripe payment error:', err)
      alert('Stripe payment initialization failed')
      setLoading(false)
    }
  }

  async function recordFailedPayment(orderId: string, paymentId: string | null, errorReason: string) {
    try {
      const userToken = localStorage.getItem('token')
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
            hotelName: selectedServices[0]?.hotelName || selectedServices[0]?.name || 'Service',
            roomTitle: selectedServices[0]?.title || selectedServices[0]?.name,
            customerName: member.name,
            customerEmail: guestEmail || member.email,
            customerPhone: guestPhone || member.phone,
            total: total,
            member: member,
            guest: {
              name: member.name,
              email: guestEmail || member.email,
              phone: guestPhone || member.phone
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
      const userToken = localStorage.getItem('token')
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
            hotelName: selectedServices[0]?.hotelName || selectedServices[0]?.name || 'Service',
            roomTitle: selectedServices[0]?.title || selectedServices[0]?.name,
            customerName: member.name,
            customerEmail: guestEmail || member.email,
            customerPhone: guestPhone || member.phone,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: guests,
            nights: nights,
            total: total,
            services: selectedServices,
            member: member,
            room: {
              title: selectedServices[0]?.title || selectedServices[0]?.name,
              ...selectedServices[0]
            },
            guest: {
              name: member.name,
              email: guestEmail || member.email,
              phone: guestPhone || member.phone
            }
          }
        })
      })
      
      if (!verifyResponse.ok) {
        throw new Error(`Payment verification failed: ${verifyResponse.status}`)
      }
      
      const verifyData = await verifyResponse.json()
      
      if (!verifyData.success) {
        throw new Error('Payment verification failed')
      }

      // Clear cart after successful booking
      localStorage.removeItem('memberCart')
      
      const booking = {
        id: verifyData.booking._id,
        hotelName: selectedServices[0]?.hotelName || selectedServices[0]?.name,
        roomTitle: selectedServices[0]?.title || selectedServices[0]?.name,
        roomImage: selectedServices[0]?.image,
        guest: {
          name: member.name,
          email: guestEmail || member.email,
          phone: guestPhone || member.phone
        },
        member: member,
        total: total,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guests,
        nights: nights,
        status: 'confirmed',
        paymentId: paymentResponse.razorpay_payment_id
      }
      
      // Also save to localStorage for backward compatibility
      const existingBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
      existingBookings.push(booking)
      localStorage.setItem('memberBookings', JSON.stringify(existingBookings))

      navigate('/booking-success', { state: { booking } })
      
    } catch (err: any) {
      console.error('Booking creation error:', err)
      alert(err?.message || 'Booking failed after payment')
    } finally {
      setLoading(false)
    }
  }

  const addService = (service: any) => {
    const updated = [...selectedServices, service]
    setSelectedServices(updated)
    localStorage.setItem('memberCart', JSON.stringify(updated))
    setShowAddServices(false)
  }

  const removeService = (index: number) => {
    const updated = selectedServices.filter((_, i) => i !== index)
    setSelectedServices(updated)
    localStorage.setItem('memberCart', JSON.stringify(updated))
  }

  if (!room || !member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-brand-gold)] mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  const hotelServices = selectedServices.filter(s => s.type !== 'aircraft' && s.type !== 'car' && s.type !== 'travel' && s.type !== 'dining' && s.type !== 'entertainment' && s.type !== 'chef' && s.type !== 'wine' && s.type !== 'ticket' && s.type !== 'event')
  const aircraftServices = selectedServices.filter(s => s.type === 'aircraft')
  const carServices = selectedServices.filter(s => s.type === 'car')
  const travelServices = selectedServices.filter(s => s.type === 'travel')
  const diningServices = selectedServices.filter(s => s.type === 'dining')
  const entertainmentServices = selectedServices.filter(s => s.type === 'entertainment')
  const chefServices = selectedServices.filter(s => s.type === 'chef')
  const wineServices = selectedServices.filter(s => s.type === 'wine')
  const ticketServices = selectedServices.filter(s => s.type === 'ticket')
  const eventServices = selectedServices.filter(s => s.type === 'event')
  const hotelTotal = hotelServices.reduce((sum, s) => sum + (s.price * nights), 0)
  const aircraftTotal = aircraftServices.reduce((sum, s) => sum + s.aircraft.price, 0)
  const carTotal = carServices.reduce((sum, s) => sum + s.car.price, 0)
  const travelTotal = travelServices.reduce((sum, s) => sum + s.travel.price, 0)
  const diningTotal = diningServices.reduce((sum, s) => {
    const price = s.dining?.price || s.price || 0
    return sum + (isNaN(price) ? 0 : Number(price))
  }, 0)
  const entertainmentTotal = entertainmentServices.reduce((sum, s) => sum + (s.entertainment?.price || 0), 0)
  const chefTotal = chefServices.reduce((sum, s) => sum + (s.chef?.price || 0), 0)
  const wineTotal = wineServices.reduce((sum, s) => sum + (s.wine?.price || 0), 0)
  const ticketTotal = ticketServices.reduce((sum, s) => sum + (s.ticket?.price || 0), 0)
  const eventTotal = eventServices.reduce((sum, s) => sum + (s.event?.price || 0), 0)
  const grandTotal = hotelTotal + aircraftTotal + carTotal + travelTotal + diningTotal + entertainmentTotal + chefTotal + wineTotal + ticketTotal + eventTotal

  const total = hotelTotal + aircraftTotal + carTotal + travelTotal + diningTotal + entertainmentTotal + chefTotal + wineTotal + ticketTotal + eventTotal
  const savings = hotelServices.reduce((sum, s) => sum + ((s.originalPrice - s.price) * nights), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] pt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              navigate('/member-dashboard', { replace: true })
            }}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white">Exclusive Member Checkout</h1>
            </div>
            <p className="text-gray-300">Complete your luxury reservation</p>
          </div>

          <div className="w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Member Info */}
            <div className="bg-gradient-to-r from-[var(--color-brand-gold)]/10 to-yellow-400/10 backdrop-blur-sm border border-[var(--color-brand-gold)]/20 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    <span className="text-[var(--color-brand-gold)]">{member.tier} Member</span> • ID: {member.membershipId}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Payment Method</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  paymentGateway === 'razorpay' ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10' : 'border-white/20 hover:border-white/30'
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
                      paymentGateway === 'razorpay' ? 'border-[var(--color-brand-gold)]' : 'border-white/40'
                    }`}>
                      {paymentGateway === 'razorpay' && <div className="w-2 h-2 bg-[var(--color-brand-gold)] rounded-full"></div>}
                    </div>
                    <div>
                      <div className="font-medium text-white">Razorpay</div>
                      <div className="text-sm text-gray-300">UPI, Cards, Wallets & More</div>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  paymentGateway === 'stripe' ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10' : 'border-white/20 hover:border-white/30'
                }`}>
                  <input
                    type="radio"
                    name="paymentGateway"
                    value="stripe"
                    checked={paymentGateway === 'stripe'}
                    onChange={(e) => setPaymentGateway(e.target.value as 'stripe')}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentGateway === 'stripe' ? 'border-[var(--color-brand-gold)]' : 'border-white/40'
                    }`}>
                      {paymentGateway === 'stripe' && <div className="w-2 h-2 bg-[var(--color-brand-gold)] rounded-full"></div>}
                    </div>
                    <div>
                      <div className="font-medium text-white">Stripe</div>
                      <div className="text-sm text-gray-300">International Cards & Payments</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Guest Details */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Guest Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent"
                    placeholder="Enter phone number (required)"
                  />
                </div>
              </div>
            </div>

            {/* Booking Details - Only for hotels */}
            {room?.type !== 'aircraft' && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Booking Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Check-in Date</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num} className="bg-slate-800">{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nights</label>
                    <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white">
                      {nights} Night{nights > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={loading || !guestPhone.trim()}
              className="w-full bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] py-4 rounded-2xl font-bold text-lg hover:brightness-95 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-[var(--color-brand-navy)]/30 border-t-[var(--color-brand-navy)] rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                `Pay with ${paymentGateway === 'razorpay' ? 'Razorpay' : 'Stripe'} • ₹${total}`
              )}
            </button>
          </div>

          {/* Sidebar */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-fit">
            <h3 className="text-xl font-semibold text-white mb-6">Reservation Summary</h3>

            {/* Selected Services */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white text-lg">Selected Services</h4>
                <button
                  onClick={() => setShowAddServices(true)}
                  className="text-[var(--color-brand-gold)] text-sm hover:underline"
                >
                  + Add Service
                </button>
              </div>

              <div className="space-y-4">
                {selectedServices.map((service, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <img src={service.image} alt={service.name} className="w-16 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-white font-medium">{service.name}</h5>
                          <button
                            onClick={() => removeService(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {service.type === 'aircraft' ? `✈️ ${service.aircraft.type}` : '🏨 Hotel Room'}
                        </p>
                        <p className="text-[var(--color-brand-gold)] font-semibold">
                          ${service.type === 'aircraft' ? service.aircraft.price : service.price}{service.type !== 'aircraft' ? '/night' : '/flight'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Services Modal */}
            {showAddServices && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-bold text-white mb-4">Add Service</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        localStorage.setItem('returnToCheckout', 'true')
                        navigate('/member-dashboard')
                      }}
                      className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <div className="text-white font-medium">🏨 Add Hotel</div>
                      <div className="text-gray-400 text-sm">Browse exclusive hotels</div>
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem('returnToCheckout', 'true')
                        navigate('/aircraft-booking')
                      }}
                      className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <div className="text-white font-medium">✈️ Add Aircraft</div>
                      <div className="text-gray-400 text-sm">Private jets & helicopters</div>
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem('returnToCheckout', 'true')
                        navigate('/car-rental')
                      }}
                      className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <div className="text-white font-medium">🚗 Add Car Rental</div>
                      <div className="text-gray-400 text-sm">Luxury vehicles & chauffeurs</div>
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem('returnToCheckout', 'true')
                        navigate('/royal-concierge')
                      }}
                      className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <div className="text-white font-medium">👑 Add Concierge Service</div>
                      <div className="text-gray-400 text-sm">Personal assistance & planning</div>
                    </button>
                  </div>
                  <button
                    onClick={() => setShowAddServices(false)}
                    className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Points Payment Option */}
            {(() => {
              const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
              if (!memberData) return null
              const parsedMember = JSON.parse(memberData)
              const bookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
              const spentPoints = parseInt(localStorage.getItem('spentPoints') || '0')
              const tierMultiplier = { Bronze: 1, Silver: 1.2, Gold: 1.5, Platinum: 2, Diamond: 2.5 }
              const earnedPoints = bookings.reduce((total, booking) => {
                if (booking.status === 'confirmed' && booking.total && !isNaN(booking.total)) {
                  const basePoints = Math.floor(Number(booking.total) / 10)
                  return total + Math.floor(basePoints * tierMultiplier[parsedMember.tier])
                }
                return total
              }, 0)
              const availablePoints = Math.max(0, earnedPoints - spentPoints)

              const canPayWithPoints = availablePoints >= 10 && availablePoints >= total * 100

              return (
                <div className={`mb-6 p-4 rounded-xl border transition-all ${availablePoints >= 10
                    ? 'bg-gradient-to-r from-[var(--color-brand-gold)]/20 to-yellow-400/20 border-[var(--color-brand-gold)]/30'
                    : 'bg-gray-800/40 border-gray-600/30'
                  }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${availablePoints >= 10 ? 'text-[var(--color-brand-gold)]' : 'text-gray-400'
                      }`}>👑 Pay with Rewards</h4>
                    <span className="text-white text-sm">{availablePoints} pts available</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    {availablePoints >= 10
                      ? 'Use your reward points to pay for this booking (100 points = $1)'
                      : 'Unlock points payment at 10 points (100 points = $1)'
                    }
                  </p>
                  <button
                    onClick={() => {
                      if (canPayWithPoints) {
                        const pointsNeeded = total * 100
                        const newSpentPoints = spentPoints + pointsNeeded
                        localStorage.setItem('spentPoints', newSpentPoints.toString())
                        handleConfirm()
                      }
                    }}
                    disabled={!canPayWithPoints}
                    className={`w-full py-2 rounded-lg font-medium transition-all ${canPayWithPoints
                        ? 'bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] hover:brightness-95'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {availablePoints < 10
                      ? `Need ${10 - availablePoints} more points to unlock`
                      : availablePoints >= total * 100
                        ? `Pay with ${total * 100} Points`
                        : `Need ${(total * 100) - availablePoints} more points`
                    }
                  </button>
                </div>
              )
            })()}

            {/* Pricing */}
            <div className="space-y-3 border-t border-white/20 pt-4">
              {hotelServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>🏨 Hotel Services</span>
                    <span>${hotelTotal}</span>
                  </div>
                  {hotelServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name} × {nights} nights</span>
                      <span>${service.price * nights}</span>
                    </div>
                  ))}
                </>
              )}

              {aircraftServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>✈️ Aircraft Services</span>
                    <span>${aircraftTotal}</span>
                  </div>
                  {aircraftServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.aircraft.price}</span>
                    </div>
                  ))}
                </>
              )}

              {carServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>🚗 Car Rental Services</span>
                    <span>${carTotal}</span>
                  </div>
                  {carServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.car.price}/day</span>
                    </div>
                  ))}
                </>
              )}

              {travelServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>🌍 Travel Services</span>
                    <span>${travelTotal}</span>
                  </div>
                  {travelServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.travel.price}</span>
                    </div>
                  ))}
                </>
              )}

              {diningServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>🍽️ Dining Services</span>
                    <span>${diningTotal}</span>
                  </div>
                  {diningServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.dining?.price || service.price || 0}</span>
                    </div>
                  ))}
                </>
              )}

              {entertainmentServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>🎭 Entertainment Services</span>
                    <span>${entertainmentTotal}</span>
                  </div>
                  {entertainmentServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.entertainment.price}</span>
                    </div>
                  ))}
                </>
              )}

              {chefServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>👨🍳 Chef Services</span>
                    <span>${chefTotal}</span>
                  </div>
                  {chefServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.chef.price}</span>
                    </div>
                  ))}
                </>
              )}

              {wineServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>🍷 Wine Services</span>
                    <span>${wineTotal}</span>
                  </div>
                  {wineServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.wine.price}</span>
                    </div>
                  ))}
                </>
              )}

              {ticketServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>🎭 Ticket Services</span>
                    <span>${ticketTotal}</span>
                  </div>
                  {ticketServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.ticket.price}</span>
                    </div>
                  ))}
                </>
              )}

              {eventServices.length > 0 && (
                <>
                  <div className="flex justify-between text-white font-medium">
                    <span>🎉 Event Services</span>
                    <span>${eventTotal}</span>
                  </div>
                  {eventServices.map((service, i) => (
                    <div key={i} className="flex justify-between text-gray-300 text-sm ml-4">
                      <span>{service.name}</span>
                      <span>${service.event.price}</span>
                    </div>
                  ))}
                </>
              )}

              {savings > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Member Savings</span>
                  <span>-${savings}</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-bold text-[var(--color-brand-gold)] border-t border-white/20 pt-3">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            {/* Member Benefits */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--color-brand-gold)]/10 to-yellow-400/10 rounded-xl border border-[var(--color-brand-gold)]/20">
              <h5 className="font-semibold text-[var(--color-brand-gold)] mb-2">Exclusive Benefits Included</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                {room?.type === 'aircraft' ? (
                  <>
                    <li>• Priority boarding & departure</li>
                    <li>• Luxury ground transportation</li>
                    <li>• 24/7 flight concierge service</li>
                    <li>• Premium catering & amenities</li>
                  </>
                ) : (
                  <>
                    <li>• Priority check-in & late checkout</li>
                    <li>• Complimentary room upgrade (subject to availability)</li>
                    <li>• 24/7 concierge service</li>
                    <li>• Welcome amenities</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}