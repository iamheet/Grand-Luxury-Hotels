import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [avatarClicked, setAvatarClicked] = useState(false)
  const userRaw = localStorage.getItem('user')
  const isLoggedIn = !!userRaw
  let initials = 'GU'
  if (userRaw) {
    try {
      const u = JSON.parse(userRaw) as { name?: string; email?: string }
      const display = (u.name && u.name.trim()) || (u.email ? u.email.split('@')[0] : '')
      const parts = display.split(/\s+/).filter(Boolean)
      const first = parts[0]?.[0] || display[0] || 'G'
      const secondSource = parts.length > 1 ? parts[parts.length - 1] : display
      const second = secondSource?.slice(-1) || 'U'
      initials = `${first}${second}`.toUpperCase()
    } catch {}
  }
  const transparent = pathname === '/'

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className={`${transparent ? 'absolute top-0 left-0 right-0 bg-transparent' : 'sticky top-0 bg-[var(--color-brand-navy)]'} z-30 text-white/95`}>
        <div className={`mx-auto max-w-7xl px-6 py-4 flex items-center justify-between ${transparent ? 'mix-blend-normal' : ''}`}>
          <Link to="/" className="font-semibold tracking-wide text-lg">
            The <span className="text-[var(--color-brand-gold)]">Grand</span> Stay
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link to="/" className="group relative px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
              <span className="flex items-center gap-2 text-white font-medium">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
            </Link>
            <Link to="/search" className="text-sm font-medium px-3 py-1.5 rounded-md shadow-sm bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] hover:brightness-95 transition">
              Search
            </Link>
            {!isLoggedIn && (
              <Link to="/register" className="hover:text-[var(--color-brand-gold)]">Register</Link>
            )}
            {isLoggedIn && (
              <div className="ml-2 group relative">
                <div className="relative">
                  <button 
                    onClick={() => {
                      setAvatarClicked(true)
                      setTimeout(() => setAvatarClicked(false), 2000)
                    }}
                    className={`w-9 h-9 rounded-none backdrop-blur-sm border-2 flex items-center justify-center text-xs font-semibold transition-all duration-700 hover:scale-105 shadow-lg hover:shadow-xl relative overflow-visible ${
                      avatarClicked 
                        ? 'bg-gradient-to-br from-black via-gray-900 to-black border-cyan-400 animate-pulse scale-100 shadow-2xl shadow-cyan-500/80 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50' 
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                    }`}
                  >
                    {avatarClicked && (
                      <>
                        <div className="absolute -inset-2 bg-gradient-conic from-cyan-500 via-purple-500 via-pink-500 via-green-500 to-cyan-500 animate-spin opacity-60 blur-sm"></div>
                        <div className="absolute -inset-3 border-2 border-cyan-400 animate-ping opacity-40"></div>
                        <div className="absolute -inset-4 border border-purple-500 animate-ping opacity-30" style={{animationDelay: '0.5s'}}></div>
                        <div className="absolute -inset-5 border border-pink-500 animate-ping opacity-20" style={{animationDelay: '1s'}}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 animate-pulse"></div>
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md border border-cyan-300"></div>
                        <div className="absolute -top-2 left-1/2 w-0.5 h-4 bg-gradient-to-t from-cyan-400 to-transparent animate-pulse"></div>
                        <div className="absolute -bottom-2 left-1/2 w-0.5 h-4 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse"></div>
                        <div className="absolute -left-2 top-1/2 h-0.5 w-4 bg-gradient-to-l from-cyan-400 to-transparent animate-pulse"></div>
                        <div className="absolute -right-2 top-1/2 h-0.5 w-4 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse"></div>
                      </>
                    )}
                    <span className={`relative z-20 transition-all duration-1000 font-mono tracking-wider ${
                      avatarClicked 
                        ? 'text-cyan-300 scale-150 animate-bounce font-black drop-shadow-[0_0_20px_rgba(34,211,238,1)] filter brightness-150 transform rotate-[360deg]' 
                        : 'text-white'
                    }`}>
                      {avatarClicked ? '★' : initials}
                    </span>
                  </button>
                  {avatarClicked && (
                    <>
                      <div className="absolute -top-3 -left-3 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-90"></div>
                      <div className="absolute -top-3 -right-3 w-1 h-1 bg-purple-500 rounded-full animate-ping opacity-90" style={{animationDelay: '0.2s'}}></div>
                      <div className="absolute -bottom-3 -left-3 w-1 h-1 bg-pink-500 rounded-full animate-ping opacity-90" style={{animationDelay: '0.4s'}}></div>
                      <div className="absolute -bottom-3 -right-3 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-90" style={{animationDelay: '0.6s'}}></div>
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs font-mono text-cyan-300 animate-pulse opacity-80">SYS</div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-mono text-cyan-300 animate-pulse opacity-80">ON</div>
                      <div className="absolute top-0 left-0 w-full h-full border border-dashed border-cyan-300 animate-spin opacity-60"></div>
                      <div className="absolute -inset-2 border border-dotted border-purple-400 animate-spin opacity-40" style={{animationDirection: 'reverse', animationDelay: '0.3s'}}></div>
                    </>
                  )}
                </div>
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-500 ${
                  avatarClicked 
                    ? 'bg-rainbow animate-spin scale-200 shadow-lg' 
                    : 'bg-green-500'
                }`}></div>
              </div>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('user')
                navigate('/login')
              }}
              className="group ml-4 flex items-center gap-2 rounded-lg border border-slate-500/30 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 px-4 py-2 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
            <Link to="/help" className="group relative px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <span className="flex items-center gap-2 text-white font-medium">
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-[var(--color-brand-navy)] text-white/80">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="text-white font-semibold text-xl">The <span className="text-[var(--color-brand-gold)]">Grand</span> Stay</div>
              <p className="text-white/70 text-sm leading-relaxed">A curated collection of exceptional hotels and bespoke experiences around the world.</p>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-[var(--color-brand-gold)]/10 to-transparent border border-[var(--color-brand-gold)]/20">
                <div className="flex items-center gap-3 text-[var(--color-brand-gold)] text-sm font-medium">
                  <div className="w-8 h-8 bg-[var(--color-brand-gold)]/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">Premium Quality</div>
                    <div className="text-white/60 text-xs">Luxury • Comfort • Service</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explore Section */}
            <div className="space-y-4">
              <div className="text-white font-semibold text-lg mb-4">Explore</div>
              <div className="space-y-3">
                <a href="/" className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--color-brand-gold)]/20 transition-colors">
                    <svg className="w-4 h-4 text-white/70 group-hover:text-[var(--color-brand-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-white/70 group-hover:text-[var(--color-brand-gold)] text-sm font-medium">Home</span>
                </a>
                <a href="/search" className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--color-brand-gold)]/20 transition-colors">
                    <svg className="w-4 h-4 text-white/70 group-hover:text-[var(--color-brand-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-white/70 group-hover:text-[var(--color-brand-gold)] text-sm font-medium">Search Hotels</span>
                </a>
                <Link to="/membership" className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--color-brand-gold)]/20 transition-colors">
                    <svg className="w-4 h-4 text-white/70 group-hover:text-[var(--color-brand-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-white/70 group-hover:text-[var(--color-brand-gold)] text-sm font-medium">Join Membership</span>
                </Link>
                <a href="/login" className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--color-brand-gold)]/20 transition-colors">
                    <svg className="w-4 h-4 text-white/70 group-hover:text-[var(--color-brand-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="text-white/70 group-hover:text-[var(--color-brand-gold)] text-sm font-medium">Member Login</span>
                </a>
              </div>
            </div>

            {/* Contact & Support Section */}
            <div>
              <div className="text-white font-semibold mb-5">Contact & Support</div>
              <div className="space-y-4">
                <div className="group cursor-pointer">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-brand-gold)]/80 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm">Email Support</div>
                      <div className="text-white/70 text-xs mt-0.5 truncate">concierge@grandstay.example</div>
                      <div className="text-[var(--color-brand-gold)] text-xs mt-1">Response within 2 hours</div>
                    </div>
                  </div>
                </div>

                <div className="group cursor-pointer">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-brand-gold)]/80 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm">Phone Support</div>
                      <div className="text-white/70 text-xs mt-0.5">+1 (212) 555‑0199</div>
                      <div className="text-[var(--color-brand-gold)] text-xs mt-1">Mon-Fri 9AM-6PM EST</div>
                    </div>
                  </div>
                </div>

                <div className="group cursor-pointer">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-[var(--color-brand-gold)]/10 to-[var(--color-brand-gold)]/5 border border-[var(--color-brand-gold)]/20 hover:border-[var(--color-brand-gold)]/40 transition-all duration-200">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[var(--color-brand-gold)] to-[var(--color-brand-gold)]/80 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm flex items-center gap-2">
                        24/7 Concierge
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)]">
                          LIVE
                        </span>
                      </div>
                      <div className="text-white/80 text-xs mt-0.5">Premium assistance anytime</div>
                      <div className="text-[var(--color-brand-gold)] text-xs mt-1 font-medium">Always Available • Instant Response</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-white/60 text-xs mb-3">Follow us</div>
                <div className="flex items-center gap-2">
                  <a aria-label="Instagram" href="#" className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/></svg>
                  </a>
                  <a aria-label="Twitter" href="#" className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M22 5.8c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.8.5-1.6.8-2.5 1a3.9 3.9 0 0 0-6.7 3.6A11.2 11.2 0 0 1 3 4.9a3.9 3.9 0 0 0 1.2 5.2c-.6 0-1.2-.2-1.7-.5 0 1.9 1.3 3.5 3.1 3.9-.5.1-1 .2-1.6.1.5 1.6 2 2.8 3.8 2.9A7.9 7.9 0 0 1 2 19.5 11.2 11.2 0 0 0 8.1 21c7.4 0 11.5-6.1 11.5-11.5v-.5c.8-.5 1.4-1.2 1.9-2.0z"/></svg>
                  </a>
                  <a aria-label="Facebook" href="#" className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M13.5 9H16l.5-3h-3V4.5c0-.9.2-1.5 1.5-1.5H16V0s-1.1-.2-2.1-.2C11.7-.2 10 1.3 10 4.2V6H7v3h3v9h3.5V9z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="space-y-4">
              <div className="text-white font-semibold text-lg">Stay Connected</div>
              <p className="text-white/70 text-sm leading-relaxed">Get exclusive member deals, luxury travel inspiration, and insider access to our finest properties.</p>
              
              <div className="p-4 rounded-lg bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                {subscribed ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-white font-medium text-sm">Thank you!</div>
                    <div className="text-[var(--color-brand-gold)] text-xs mt-1">Your email has been registered for our newsletter</div>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <div className="relative">
                      <input 
                        aria-label="Email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address" 
                        className="w-full rounded-lg px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] transition-all" 
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-brand-gold)]/90 text-[var(--color-brand-navy)] font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-sm"
                    >
                      Subscribe to Newsletter
                    </button>
                  </form>
                )}
                
                <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                  <svg className="w-3 h-3 text-[var(--color-brand-gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Your privacy is protected. Unsubscribe anytime.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/15">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-xs text-white/60">
                © {new Date().getFullYear()} The Grand Stay. All rights reserved. | Luxury hospitality redefined.
              </div>
              <div className="flex items-center gap-6 text-xs">
                <a href="#" className="text-white/60 hover:text-[var(--color-brand-gold)] transition-colors">Privacy Policy</a>
                <a href="#" className="text-white/60 hover:text-[var(--color-brand-gold)] transition-colors">Terms of Service</a>
                <a href="#" className="text-white/60 hover:text-[var(--color-brand-gold)] transition-colors">Cookie Settings</a>
                <a href="#" className="text-white/60 hover:text-[var(--color-brand-gold)] transition-colors">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}