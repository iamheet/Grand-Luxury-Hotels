import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function ForgotPassword() {
  const [resetType, setResetType] = useState<'email' | 'membership'>('email')
  const [email, setEmail] = useState('')
  const [membershipId, setMembershipId] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        ...(resetType === 'email' 
          ? { email: email.trim() } 
          : { membershipId: membershipId.trim(), isExclusive: true }
        )
      })

      setStatus('success')
      setMessage(response.data.message || 'Password reset instructions have been sent.')
    } catch (err: any) {
      console.error('Forgot password error:', err)
      setStatus('error')
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-16">
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://cf.bstatic.com/xdata/images/hotel/max1024x768/763590431.jpg?k=f87898a89d4364be4a52fdadf9c8775f801ac2cca5e74c536c21aea1bf61ee83&o=')",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-black/50" />

      <div className="w-full max-w-md">
        <div className="backdrop-blur-md bg-white/90 rounded-2xl shadow-2xl border border-white/40 p-6 md:p-7">
          <h2 className="text-xl font-semibold text-center mb-4 text-[var(--color-brand-navy)]">
            Reset Password
          </h2>

          {status === 'success' ? (
            <div className="text-center">
              <div className="text-green-600 mb-4">{message}</div>
              <Link
                to="/login"
                className="inline-block w-full text-center bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] font-medium rounded-lg py-2 hover:brightness-95 transition shadow-md"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  type="button"
                  onClick={() => setResetType('email')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    resetType === 'email'
                      ? 'bg-white text-[var(--color-brand-navy)] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setResetType('membership')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    resetType === 'membership'
                      ? 'bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  ✨ Membership ID
                </button>
              </div>

              {resetType === 'email' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                    placeholder="you@example.com"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Membership ID
                  </label>
                  <input
                    type="text"
                    required
                    value={membershipId}
                    onChange={(e) => setMembershipId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                    placeholder="Enter your membership ID"
                  />
                </div>
              )}

              {status === 'error' && <div className="text-red-600 text-sm">{message}</div>}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] font-medium rounded-lg py-2 hover:brightness-95 transition shadow-md disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-sm text-[var(--color-brand-gold)] hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
