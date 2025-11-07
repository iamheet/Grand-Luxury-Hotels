import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Get users from localStorage
      const usersJSON = localStorage.getItem('users')
      const users = usersJSON ? JSON.parse(usersJSON) : []

      // Check if email exists
      const userFound = users.some((user: any) => user.email === email)

      if (!userFound) {
        throw new Error('No account found with this email address.')
      }

      // Success — simulate email sent
      setStatus('success')
      setMessage('Password reset instructions have been sent to your email.')
    } catch (err: any) {
      console.error('Forgot password error:', err)
      setStatus('error')
      setMessage(err?.message || 'Something went wrong. Please try again.')
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
