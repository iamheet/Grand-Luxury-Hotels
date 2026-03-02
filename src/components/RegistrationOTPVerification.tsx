import { useState } from 'react'
import { OTPService } from '../utils/otpService'

interface RegistrationOTPVerificationProps {
  email: string
  phone: string
  onVerified: (emailVerified: boolean, phoneVerified: boolean) => void
  onCancel: () => void
  requirePhoneVerification?: boolean
}

export default function RegistrationOTPVerification({ 
  email, 
  phone, 
  onVerified, 
  onCancel,
  requirePhoneVerification = true
}: RegistrationOTPVerificationProps) {
  const [step, setStep] = useState<'choose' | 'email-otp' | 'phone-otp'>('choose')
  const [emailOtp, setEmailOtp] = useState('')
  const [phoneOtp, setPhoneOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendEmailOTP = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost:5000/api/otp/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setStep('email-otp')
        startCountdown()
      } else {
        setError(result.message || 'Failed to send email OTP')
      }
    } catch (error) {
      setError('Failed to send email OTP')
    }
    
    setLoading(false)
  }

  const handleSendPhoneOTP = async () => {
    if (!phone) {
      setError('Phone number is required')
      return
    }
    
    setLoading(true)
    setError('')
    
    const formattedPhone = OTPService.formatPhoneNumber(phone)
    const result = await OTPService.sendOTP(formattedPhone)
    
    if (result.success) {
      setStep('phone-otp')
      startCountdown()
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  const handleVerifyEmailOTP = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/otp/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: emailOtp })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setEmailVerified(true)
        setStep('choose')
        setEmailOtp('')
      } else {
        setError(result.message || 'Invalid OTP')
      }
    } catch (error) {
      setError('Failed to verify email OTP')
    }
    
    setLoading(false)
  }

  const handleVerifyPhoneOTP = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    const formattedPhone = OTPService.formatPhoneNumber(phone)
    const result = await OTPService.verifyOTP(formattedPhone, phoneOtp)

    if (result.success) {
      setPhoneVerified(true)
      setStep('choose')
      setPhoneOtp('')
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  const handleComplete = () => {
    onVerified(emailVerified, phoneVerified)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Account</h2>
          <p className="text-gray-600 mt-2">
            {step === 'choose' && 'Choose verification method'}
            {step === 'email-otp' && `Enter OTP sent to ${email}`}
            {step === 'phone-otp' && `Enter OTP sent to ${phone}`}
          </p>
        </div>

        {step === 'choose' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className={`p-4 border rounded-lg ${emailVerified ? 'bg-green-50 border-green-200' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Verification</h3>
                    <p className="text-sm text-gray-600">{email}</p>
                  </div>
                  {emailVerified ? (
                    <span className="text-green-600 font-medium">✓ Verified</span>
                  ) : (
                    <button
                      onClick={handleSendEmailOTP}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Verify'}
                    </button>
                  )}
                </div>
              </div>

              {phone && (
                <div className={`p-4 border rounded-lg ${phoneVerified ? 'bg-green-50 border-green-200' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Phone Verification</h3>
                      <p className="text-sm text-gray-600">{phone}</p>
                    </div>
                    {phoneVerified ? (
                      <span className="text-green-600 font-medium">✓ Verified</span>
                    ) : (
                      <button
                        onClick={handleSendPhoneOTP}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Sending...' : 'Verify'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                disabled={!emailVerified || (requirePhoneVerification && phone && !phoneVerified)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {(!emailVerified || (requirePhoneVerification && phone && !phoneVerified)) 
                  ? 'Verify Required Fields' 
                  : 'Complete Registration'
                }
              </button>
              <button
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 'email-otp' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Email OTP
              </label>
              <input
                type="text"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handleSendEmailOTP}
                disabled={countdown > 0 || loading}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerifyEmailOTP}
                disabled={loading || emailOtp.length !== 6}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
              <button
                onClick={() => setStep('choose')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === 'phone-otp' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Phone OTP
              </label>
              <input
                type="text"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handleSendPhoneOTP}
                disabled={countdown > 0 || loading}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerifyPhoneOTP}
                disabled={loading || phoneOtp.length !== 6}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Phone'}
              </button>
              <button
                onClick={() => setStep('choose')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}