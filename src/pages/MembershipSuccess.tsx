import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function MembershipSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const [memberData, setMemberData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for PayPal return parameters
    const urlParams = new URLSearchParams(window.location.search)
    const paypalOrderId = urlParams.get('token') || urlParams.get('paymentId')
    const payerId = urlParams.get('PayerID')
    
    if (paypalOrderId && payerId && !memberData) {
      // Handle PayPal return for membership
      handlePayPalMembershipReturn(paypalOrderId, payerId)
    } else {
      const data = location.state?.memberData
      if (data) {
        setMemberData(data)
      }
      // Don't redirect if no data - let PayPal processing complete
    }
  }, [location.state, memberData])

  const handlePayPalMembershipReturn = async (orderId: string, payerId: string) => {
    setLoading(true)
    try {
      // Add 5 second delay like Razorpay
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // Get membership data from localStorage (saved during checkout)
      const pendingMembership = localStorage.getItem('pendingMembershipPayment')
      if (!pendingMembership) {
        throw new Error('No pending membership data found')
      }
      
      const membershipData = JSON.parse(pendingMembership)

      // Create membership after PayPal payment (skip existence check)
      const memberResponse = await fetch('http://localhost:5000/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: membershipData.name,
          email: membershipData.email,
          password: membershipData.password, // Use stored password
          phone: membershipData.phone || '',
          tier: membershipData.tier || 'Bronze',
          paymentMethod: 'paypal'
        })
      })

      if (memberResponse.ok) {
        const memberResult = await memberResponse.json()
        const finalMemberData = {
          email: membershipData.email,
          name: membershipData.name,
          membershipId: memberResult.member.membershipId,
          tier: memberResult.member.tier,
          joinDate: new Date().toISOString().split('T')[0],
          paymentAmount: membershipData.amount,
          paymentId: orderId,
          password: membershipData.password // Use password from localStorage
        }
        
        setMemberData(finalMemberData)
        localStorage.setItem('member', JSON.stringify(finalMemberData))
        localStorage.removeItem('pendingMembershipPayment')
      } else {
        const errorData = await memberResponse.json()
        console.error('Membership creation failed:', errorData)
        throw new Error(errorData.message || 'Membership creation failed')
      }
    } catch (error) {
      console.error('PayPal membership return error:', error)
      // Don't redirect on error, show fallback message
      const membershipData = JSON.parse(localStorage.getItem('pendingMembershipPayment') || '{}')
      const fallbackData = {
        email: membershipData.email || 'your-email@example.com',
        name: membershipData.name || 'Member',
        membershipId: 'PENDING',
        tier: membershipData.tier || 'Bronze',
        joinDate: new Date().toISOString().split('T')[0],
        paymentAmount: membershipData.amount || 0,
        paymentId: orderId
      }
      setMemberData(fallbackData)
      localStorage.removeItem('pendingMembershipPayment')
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Membership</h1>
          <p className="text-gray-600 mb-6">Please wait while we activate your membership...</p>
        </div>
      </div>
    )
  }

  if (!memberData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to The Grand Stay!</h1>
          <p className="text-gray-600">Your membership has been activated successfully</p>
        </div>

        {/* Membership Card */}
        <div className="bg-gradient-to-r from-[var(--color-brand-navy)] to-blue-700 rounded-2xl p-8 text-white mb-8 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">The Grand Stay</h2>
              <p className="text-blue-200 text-sm">Exclusive Member</p>
            </div>
            <div className="w-12 h-12 bg-[var(--color-brand-gold)] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-blue-200 text-sm">Member Name</p>
              <p className="text-lg font-semibold">{memberData.name}</p>
            </div>
            
            <div>
              <p className="text-blue-200 text-sm">Membership ID</p>
              <p className="text-2xl font-bold tracking-wider bg-white/10 rounded-lg px-4 py-2 inline-block">
                {memberData.membershipId}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-200 text-sm">Tier</p>
                <p className="font-semibold">{memberData.tier}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Member Since</p>
                <p className="font-semibold">{memberData.joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Important: Save Your Login Credentials</h3>
              {memberData.password ? (
                <>
                  <p className="text-yellow-700 text-sm mb-2">
                    <strong>Membership ID:</strong> {memberData.membershipId}
                  </p>
                  <p className="text-yellow-700 text-sm">
                    <strong>Temporary Password:</strong> {memberData.password}
                  </p>
                  <p className="text-yellow-700 text-sm mt-2">
                    Please save these credentials. Use them to login to your exclusive member portal.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-yellow-700 text-sm mb-2">
                    <strong>Membership ID:</strong> {memberData.membershipId}
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Your membership credentials have been sent to <strong>{memberData.email}</strong>
                  </p>
                  <p className="text-yellow-700 text-sm mt-2">
                    Please check your email for login details. If you don't receive it within 10 minutes, contact support.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/member-dashboard"
            className="w-full bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] font-semibold py-4 px-6 rounded-xl hover:from-yellow-400 hover:to-[var(--color-brand-gold)] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center block"
          >
            Access Member Dashboard
          </Link>
          
          <Link
            to="/"
            className="w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-4 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 text-center block"
          >
            Return to Home
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Need help? Contact us at <span className="text-[var(--color-brand-navy)] font-medium">support@grandstay.com</span></p>
        </div>
      </div>
    </div>
  )
}