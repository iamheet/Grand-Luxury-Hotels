import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-600">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2"
        style={{ backgroundColor: 'var(--color-brand-gold)', color: '#0A1931' }}>
        Go home
      </Link>
    </div>
  )
}


