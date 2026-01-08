import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function MembershipPayment() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedPlan = location.state?.plan || 'platinum'
  
  // Check if user is logged in
  const token = localStorage.getItem('token') || localStorage.getItem('authToken')
  const storedUser = localStorage.getItem('user') || localStorage.getItem('member')
  const parsedUser = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null
  const isLoggedIn = !!(token && parsedUser)
  
  // All useState hooks must be at the top level
  const [isExistingMember, setIsExistingMember] = useState(false)
  const [checkingMembership, setCheckingMembership] = useState(true)
  const [formData, setFormData] = useState({
    name: parsedUser?.name || '',
    email: parsedUser?.email || '',
    phone: parsedUser?.phone || '',
    password: '',
    confirmPassword: ''
  })
  const [processing, setProcessing] = useState(false)
  const [showPlanSelector, setShowPlanSelector] = useState(false)
  const [currentSelectedPlan, setCurrentSelectedPlan] = useState(selectedPlan)
  const [paymentGateway, setPaymentGateway] = useState<'razorpay' | 'paypal'>('razorpay')
  
  // Check if user is already a member
  useEffect(() => {
    const checkExistingMembership = async () => {
      if (isLoggedIn && parsedUser?.email) {
        try {
          const response = await fetch(`http://localhost:5000/api/members?email=${parsedUser.email}`)
          const data = await response.json()
          
          if (data.success && data.members && data.members.length > 0) {
            setIsExistingMember(true)
          }
        } catch (error) {
          console.error('Error checking membership:', error)
        }
      }
      setCheckingMembership(false)
    }
    
    checkExistingMembership()
  }, [isLoggedIn, parsedUser?.email])
  
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])
  
  // Show loading while checking membership
  if (checkingMembership) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-brand-gold)] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking membership status...</p>
        </div>
      </div>
    )
  }
  
  // Show message if user is already a member
  if (isExistingMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">You're Already a Member!</h1>
          <p className="text-gray-600 mb-6">You already have an active membership with The Grand Stay. You cannot register for another membership.</p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/profile')}
              className="w-full bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              View My Profile
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  console.log('Selected plan:', selectedPlan)
  console.log('User logged in:', isLoggedIn)

  const plans = {
    platinum: { name: 'Platinum', price: 599, benefits: ['25% discount', 'Priority booking', 'Concierge service'] },
    gold: { name: 'Gold', price: 299, benefits: ['15% discount', 'Early access', 'Premium support'] },
    silver: { name: 'Silver', price: 99, benefits: ['10% discount', 'Member rates', 'Special offers'] },
    bronze: { name: 'Bronze', price: 49, benefits: ['3% discount', 'Basic support', 'Free Wi-Fi'] },
    diamond: { name: 'Diamond', price: 1299, benefits: ['35% discount', 'Lifestyle manager', 'Presidential suite'] }
  }

  const currentPlan = plans[currentSelectedPlan as keyof typeof plans] || plans.platinum

  const handlePlanChange = (newPlan: string) => {
    setCurrentSelectedPlan(newPlan)
    setShowPlanSelector(false)
  }
  
  console.log('Current plan:', currentPlan)
  
  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan Not Found</h1>
          <p className="text-gray-600 mb-6">The selected membership plan could not be found.</p>
          <button 
            onClick={() => navigate('/membership')}
            className="bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-6 py-3 rounded-lg font-medium"
          >
            Back to Membership Plans
          </button>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateMembershipId = () => {
    const prefix = currentPlan.name.substring(0, 2).toUpperCase()
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}${timestamp}${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Validation for guest users
    if (!isLoggedIn) {
      if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields')
        setProcessing(false)
        return
      }
      if (!formData.password || formData.password.length < 6) {
        alert('Password must be at least 6 characters')
        setProcessing(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match')
        setProcessing(false)
        return
      }
    }

    try {
      if (paymentGateway === 'paypal') {
        await handlePayPalPayment()
      } else {
        await handleRazorpayPayment()
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment processing failed')
      setProcessing(false)
    }
  }

  const handleRazorpayPayment = async () => {
    try {
      // Get auth token (optional for membership payments)
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
          amount: (currentPlan.price + 9) * 100, // Convert to paise
          currency: 'INR',
          bookingData: {
            hotelName: `Membership - ${currentPlan.name}`,
            roomTitle: `${currentPlan.name} Membership`,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone
          }
        })
      })
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order')
      }
      
      const orderData = await orderResponse.json()
      
      if (!orderData.success) {
        throw new Error('Payment order creation failed')
      }

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_S0tJBd3NSaEud8', // Replace with your actual Razorpay key
        amount: (currentPlan.price + 9) * 100,
        currency: 'INR',
        name: 'The Grand Stay',
        description: `${currentPlan.name} Membership`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Payment successful, verify and create membership
          await verifyPaymentAndCreateMembership(response)
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`)
        setProcessing(false)
      })
      rzp.open()
      
    } catch (error: any) {
      console.error('Razorpay error:', error)
      alert('Payment initialization failed')
      setProcessing(false)
    }
  }

  const verifyPaymentAndCreateMembership = async (paymentResponse: any) => {
    try {
      console.log('Payment successful, creating membership...', paymentResponse)
      
      // If user is not logged in, register them first
      if (!isLoggedIn) {
        console.log('Registering new user...')
        const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone
          })
        })

        const registerData = await registerResponse.json()
        console.log('Registration response:', registerData)
        
        if (registerResponse.ok && registerData.token) {
          localStorage.setItem('token', registerData.token)
          localStorage.setItem('user', JSON.stringify(registerData.user))
          console.log('User registered successfully')
        } else {
          console.error('Registration failed:', registerData)
        }
      }

      // Create membership after successful payment
      const membershipId = generateMembershipId()
      const memberPassword = isLoggedIn ? Math.random().toString(36).slice(-8) : formData.password
      console.log('Creating membership with ID:', membershipId)
      
      const memberResponse = await fetch('http://localhost:5000/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: memberPassword,
          phone: formData.phone,
          tier: currentPlan.name,
          membershipId,
          paymentId: paymentResponse.razorpay_payment_id,
          paymentMethod: 'razorpay'
        })
      })

      console.log('Membership API response status:', memberResponse.status)
      const memberData = await memberResponse.json()
      console.log('Membership API response data:', memberData)
      
      if (memberResponse.ok) {
        const finalMemberData = {
          email: formData.email,
          name: formData.name,
          membershipId,
          tier: currentPlan.name,
          joinDate: new Date().toISOString().split('T')[0],
          paymentAmount: currentPlan.price + 9,
          paymentId: paymentResponse.razorpay_payment_id,
          password: memberPassword // Always include password for display
        }
        
        localStorage.setItem('member', JSON.stringify(finalMemberData))
        console.log('Membership created successfully, redirecting...')
        navigate('/membership-success', { state: { memberData: finalMemberData } })
      } else {
        console.error('Membership creation failed:', memberResponse.status, memberData)
        throw new Error(memberData.message || `Membership creation failed (${memberResponse.status})`)
      }
      
    } catch (error: any) {
      console.error('Membership creation error:', error)
      alert(`Membership creation failed: ${error.message}. Please contact support with payment ID: ${paymentResponse?.razorpay_payment_id}`)
    } finally {
      setProcessing(false)
    }
  }

  const handlePayPalPayment = async () => {
    const tempPassword = Math.random().toString(36).slice(-8) // Generate password for PayPal
    const membershipData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      tier: currentPlan.name,
      membershipId: generateMembershipId(),
      amount: currentPlan.price + 9,
      paymentMethod: 'paypal',
      password: tempPassword // Store password for success page
    }
    
    localStorage.setItem('pendingMembershipPayment', JSON.stringify(membershipData))

    const response = await fetch('http://localhost:5000/api/payment/create-paypal-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: (currentPlan.price + 9) * 100,
        currency: 'USD',
        isMembership: true,
        bookingData: {
          hotelName: `Membership - ${currentPlan.name}`,
          roomTitle: `${currentPlan.name} Membership`,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone
        }
      })
    })
    
    const orderData = await response.json()
    
    if (orderData.success && orderData.approvalUrl) {
      window.location.href = orderData.approvalUrl
    } else {
      throw new Error('PayPal order creation failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Membership</h1>
          <p className="text-gray-600">Join The Grand Stay exclusive member program</p>
          <p className="text-sm text-gray-500 mt-2">Selected Plan: {currentPlan.name} - ${currentPlan.price}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="bg-gradient-to-r from-[var(--color-brand-navy)] to-blue-700 rounded-xl p-6 text-white mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--color-brand-gold)] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{currentPlan.name} Membership</h3>
                    <p className="text-blue-200 text-sm">Annual subscription</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPlanSelector(!showPlanSelector)}
                  className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-white/30"
                >
                  Change Plan
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                {currentPlan.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--color-brand-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Selector */}
            {showPlanSelector && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border">
                <h4 className="font-medium text-gray-900 mb-3">Select Different Plan:</h4>
                <div className="space-y-2">
                  {Object.entries(plans).map(([key, plan]) => (
                    <button
                      key={key}
                      onClick={() => handlePlanChange(key)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        currentSelectedPlan === key
                          ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10'
                          : 'border-gray-200 hover:border-[var(--color-brand-gold)] hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-900">{plan.name}</span>
                          <p className="text-sm text-gray-600">{plan.benefits[0]}</p>
                        </div>
                        <span className="font-semibold text-[var(--color-brand-navy)]">${plan.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Membership fee</span>
                <span className="font-medium">${currentPlan.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing fee</span>
                <span className="font-medium">$9</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-3">
                <span>Total</span>
                <span className="text-[var(--color-brand-navy)]">${currentPlan.price + 9}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Choose Payment Method</h2>
                <p className="text-sm text-gray-600">Select your preferred payment option</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`group relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                paymentGateway === 'razorpay' 
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentGateway"
                  value="razorpay"
                  checked={paymentGateway === 'razorpay'}
                  onChange={(e) => setPaymentGateway(e.target.value as 'razorpay')}
                  className="sr-only"
                />
                <div className="flex items-center gap-4 w-full">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    paymentGateway === 'razorpay' ? 'border-purple-500 bg-purple-500' : 'border-gray-300 group-hover:border-purple-400'
                  }`}>
                    {paymentGateway === 'razorpay' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.436 0H1.564C.7 0 0 .7 0 1.564v20.872C0 23.3.7 24 1.564 24h20.872c.864 0 1.564-.7 1.564-1.564V1.564C24 .7 23.3 0 22.436 0zM7.735 18.259L5.667 8.297h3.274l1.026 6.202L12.5 8.297h3.274L7.735 18.259zm9.53-6.202c0 2.16-1.728 3.888-3.888 3.888s-3.888-1.728-3.888-3.888 1.728-3.888 3.888-3.888 3.888 1.728 3.888 3.888z" fill="#072654"/>
                      </svg>
                      <span className="font-semibold text-gray-900">Razorpay</span>
                    </div>
                    <p className="text-sm text-gray-600">UPI • Cards • Wallets • Net Banking</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Instant</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Secure</span>
                    </div>
                  </div>
                </div>
                {paymentGateway === 'razorpay' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </label>

              <label className={`group relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                paymentGateway === 'paypal' 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="paymentGateway"
                  value="paypal"
                  checked={paymentGateway === 'paypal'}
                  onChange={(e) => setPaymentGateway(e.target.value as 'paypal')}
                  className="sr-only"
                />
                <div className="flex items-center gap-4 w-full">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    paymentGateway === 'paypal' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {paymentGateway === 'paypal' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.016 19.625h-4.375a.469.469 0 0 1-.469-.469V4.844c0-.259.21-.469.469-.469h4.375c3.727 0 6.75 3.023 6.75 6.75s-3.023 6.75-6.75 6.75zm0 0h4.969c3.727 0 6.75-3.023 6.75-6.75S15.712 6.125 11.985 6.125H7.016m0 13.5V6.125m0 13.5c-3.727 0-6.75-3.023-6.75-6.75S3.289 6.125 7.016 6.125" fill="#003087"/>
                        <path d="M7.016 19.625h4.969c3.727 0 6.75-3.023 6.75-6.75S15.712 6.125 11.985 6.125H7.016c3.727 0 6.75 3.023 6.75 6.75s-3.023 6.75-6.75 6.75z" fill="#0070ba"/>
                      </svg>
                      <span className="font-semibold text-gray-900">PayPal</span>
                    </div>
                    <p className="text-sm text-gray-600">International • Credit Cards • Bank Transfer</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Global</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Trusted</span>
                    </div>
                  </div>
                </div>
                {paymentGateway === 'paypal' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* User Details Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isLoggedIn ? 'Confirm Your Details' : 'Create Account & Join'}
                </h2>
                <p className="text-sm text-gray-600">
                  {isLoggedIn ? 'Review your information before payment' : 'Fill in your details to create account and membership'}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)] focus:border-transparent"
                  placeholder="John Doe"
                  required
                  disabled={isLoggedIn}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)] focus:border-transparent"
                  placeholder="member@example.com"
                  required
                  disabled={isLoggedIn}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)] focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                  required
                  disabled={isLoggedIn}
                />
              </div>

              {!isLoggedIn && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)] focus:border-transparent"
                      placeholder="Minimum 6 characters"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)] focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </>
              )}

              {isLoggedIn && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-700">You're logged in! Your membership will be linked to this account.</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] font-semibold py-4 px-6 rounded-xl hover:from-yellow-400 hover:to-[var(--color-brand-gold)] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[var(--color-brand-navy)] border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `${isLoggedIn ? 'Pay' : 'Create Account & Pay'} with ${paymentGateway === 'razorpay' ? 'Razorpay' : 'PayPal'} - $${currentPlan.price + 9}`
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21c.55 0 1.003-.45 1.003-1s-.453-1-1.003-1H5.073c-.55 0-1.003.45-1.003 1s.453 1 1.003 1h2.003zm8.847 0c.55 0 1.003-.45 1.003-1s-.453-1-1.003-1h-2.003c-.55 0-1.003.45-1.003 1s.453 1 1.003 1h2.003z"/>
              </svg>
              <span className="text-sm">Secure payment powered by SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}