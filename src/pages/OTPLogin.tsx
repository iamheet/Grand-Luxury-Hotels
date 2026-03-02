import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OTPVerification from '../components/OTPVerification'

export default function OTPLogin() {
  const navigate = useNavigate()
  const [showOTP, setShowOTP] = useState(false)

  const handleOTPVerified = (phoneNumber: string, token: string) => {
    // Save user data
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify({ 
      phone: phoneNumber,
      verified: true 
    }))
    
    // Redirect to home or dashboard
    navigate('/')
  }

  const handleCancel = () => {
    setShowOTP(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in with your phone number</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => setShowOTP(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Continue with Phone Number
            </button>

            <div className="text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Use Email & Password instead
              </button>
            </div>
          </div>
        </div>
      </div>

      {showOTP && (
        <OTPVerification
          onVerified={handleOTPVerified}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}