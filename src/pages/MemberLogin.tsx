import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function MemberLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [membershipId, setMembershipId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate member validation
    if (membershipId === 'GRAND2024' && email && password === '1234') {
      const memberData = {
        email,
        name: 'Premium Member',
        membershipId,
        tier: 'Platinum',
        joinDate: '2024-01-01'
      }
      localStorage.setItem('member', JSON.stringify(memberData))
      navigate('/member-dashboard')
    } else {
      setError('Invalid membership credentials. Please check your membership ID and login details.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Exclusive Member Access</h1>
          <p className="text-blue-200">Premium members only</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Membership ID
              </label>
              <input
                type="text"
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
                placeholder="Enter your membership ID"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] font-semibold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-[var(--color-brand-gold)] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Verifying...' : 'Access Member Portal'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm mb-4">
              Demo Credentials: ID: GRAND2024 | Password: 1234
            </p>
            <Link
              to="/membership"
              className="text-[var(--color-brand-gold)] hover:text-yellow-300 text-sm font-medium transition-colors"
            >
              Not a member? Join our exclusive program →
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}