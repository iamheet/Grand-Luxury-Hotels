import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const { pathname } = useLocation()
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
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-[var(--color-brand-navy)] text-white/80">
        <div className="mx-auto max-w-7xl px-6 py-10 text-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div>
            <div className="font-semibold text-white">The Grand Stay</div>
            <div className="text-white/60">Luxury stays, curated for you.</div>
          </div>
          <div className="flex gap-4 text-white/60">
            <a href="#" className="hover:text-[var(--color-brand-gold)]">Privacy</a>
            <a href="#" className="hover:text-[var(--color-brand-gold)]">Terms</a>
            <a href="#" className="hover:text-[var(--color-brand-gold)]">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}


