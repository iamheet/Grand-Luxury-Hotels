import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'

export default function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
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
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className={`${transparent ? 'absolute top-0 left-0 right-0 bg-transparent' : 'sticky top-0 bg-[var(--color-brand-navy)]'} z-30 text-white/95`}>
        <div className={`mx-auto max-w-7xl px-6 py-4 flex items-center justify-between ${transparent ? 'mix-blend-normal' : ''}`}>
          <Link to="/" className="font-semibold tracking-wide text-lg">
            The <span className="text-[var(--color-brand-gold)]">Grand</span> Stay
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link to="/" className="hover:text-[var(--color-brand-gold)]">Home</Link>
            <Link to="/search" className="hover:text-[var(--color-brand-gold)]">Search</Link>
            {!isLoggedIn && (
              <Link to="/register" className="hover:text-[var(--color-brand-gold)]">Register</Link>
            )}
            {isLoggedIn && (
              <div className="ml-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 border border-white/25 text-xs font-semibold">
                {initials}
              </div>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('user')
                navigate('/login')
              }}
              className="ml-4 rounded-md border border-white/20 px-3 py-1.5 hover:text-[var(--color-brand-gold)] hover:border-[var(--color-brand-gold)] transition"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-[var(--color-brand-navy)] text-white/80">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-white font-semibold text-lg">The <span className="text-[var(--color-brand-gold)]">Grand</span> Stay</div>
              <p className="mt-2 text-white/70 text-sm">A curated collection of exceptional hotels and bespoke experiences around the world.</p>
              <div className="mt-4 inline-flex items-center gap-2 text-[var(--color-brand-gold)] text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-brand-gold)]"></span>
                Luxury • Comfort • Service
              </div>
            </div>

            <div>
              <div className="text-white font-semibold">Explore</div>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><a href="/" className="hover:text-[var(--color-brand-gold)]">Home</a></li>
                <li><a href="/search" className="hover:text-[var(--color-brand-gold)]">Search</a></li>
                <li><a href="/register" className="hover:text-[var(--color-brand-gold)]">Join Membership</a></li>
                <li><a href="/login" className="hover:text-[var(--color-brand-gold)]">Member Login</a></li>
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold">Contact</div>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>Email: concierge@grandstay.example</li>
                <li>Phone: +1 (212) 555‑0199</li>
                <li>Hours: 24/7 Concierge</li>
              </ul>
              <div className="mt-4 flex items-center gap-3">
                <a aria-label="Instagram" href="#" className="hover:text-[var(--color-brand-gold)]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/></svg>
                </a>
                <a aria-label="Twitter" href="#" className="hover:text-[var(--color-brand-gold)]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22 5.8c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.8.5-1.6.8-2.5 1a3.9 3.9 0 0 0-6.7 3.6A11.2 11.2 0 0 1 3 4.9a3.9 3.9 0 0 0 1.2 5.2c-.6 0-1.2-.2-1.7-.5 0 1.9 1.3 3.5 3.1 3.9-.5.1-1 .2-1.6.1.5 1.6 2 2.8 3.8 2.9A7.9 7.9 0 0 1 2 19.5 11.2 11.2 0 0 0 8.1 21c7.4 0 11.5-6.1 11.5-11.5v-.5c.8-.5 1.4-1.2 1.9-2.0z"/></svg>
                </a>
                <a aria-label="Facebook" href="#" className="hover:text-[var(--color-brand-gold)]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13.5 9H16l.5-3h-3V4.5c0-.9.2-1.5 1.5-1.5H16V0s-1.1-.2-2.1-.2C11.7-.2 10 1.3 10 4.2V6H7v3h3v9h3.5V9z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <div className="text-white font-semibold">Newsletter</div>
              <p className="mt-3 text-sm text-white/70">Get member‑only deals and inspiration straight to your inbox.</p>
              <form className="mt-4 flex items-center gap-2">
                <input aria-label="Email" type="email" placeholder="you@example.com" className="flex-1 rounded-md px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none" />
                <button type="button" className="rounded-md px-3 py-2 text-sm" style={{ backgroundColor: 'var(--color-brand-gold)', color: '#0A1931' }}>Subscribe</button>
              </form>
            </div>
          </div>

          <div className="mt-10 border-t border-white/15 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
            <div>© {new Date().getFullYear()} The Grand Stay. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-[var(--color-brand-gold)]">Privacy Policy</a>
              <a href="#" className="hover:text-[var(--color-brand-gold)]">Terms of Service</a>
              <a href="#" className="hover:text-[var(--color-brand-gold)]">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


