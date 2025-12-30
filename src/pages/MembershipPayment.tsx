import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function MembershipPayment() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedPlan = location.state?.plan || 'platinum'
  
  console.log('Selected plan:', selectedPlan)
  console.log('Location state:', location.state)
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    phone: ''
  })
  const [processing, setProcessing] = useState(false)
  const [showPlanSelector, setShowPlanSelector] = useState(false)
  const [currentSelectedPlan, setCurrentSelectedPlan] = useState(selectedPlan)

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

    try {
      const membershipId = generateMembershipId()
      const password = Math.random().toString(36).slice(-8)
      
      const response = await fetch('http://localhost:5000/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.cardName,
          email: formData.email,
          password,
          phone: formData.phone,
          tier: currentPlan.name,
          membershipId
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        const memberData = {
          email: formData.email,
          name: formData.cardName,
          membershipId,
          tier: currentPlan.name,
          joinDate: new Date().toISOString().split('T')[0],
          paymentAmount: currentPlan.price,
          password
        }
        
        localStorage.setItem('member', JSON.stringify(memberData))
        navigate('/membership-success', { state: { memberData } })
      } else {
        alert(data.message || 'Registration failed')
        setProcessing(false)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Payment processing failed')
      setProcessing(false)
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

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)] focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)] focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)] focus:border-transparent"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)] focus:border-transparent"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

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
                  `Complete Payment - $${currentPlan.price + 9}`
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