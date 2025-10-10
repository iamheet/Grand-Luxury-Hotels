import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = { variant?: 'card' | 'bar' }

export default function BookingForm({ variant = 'card' }: Props) {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2 Adults, 0 Children')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams({ destination, checkIn, checkOut, guests })
    navigate(`/search?${params.toString()}`)
  }

  const wrapClass =
    variant === 'bar'
      ? 'rounded-xl p-4 md:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] max-w-6xl mx-auto bg-transparent'
      : 'backdrop-blur-md bg-white/90 rounded-2xl p-4 md:p-6 shadow-2xl max-w-4xl mx-auto'

  const fieldClass =
    variant === 'bar'
      ? 'w-full rounded-md bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] text-gray-900 placeholder-gray-500'
      : 'w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] text-gray-900 placeholder-gray-500'

  return (
    <form onSubmit={onSubmit} className={wrapClass}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5 items-end">
        <div className="md:col-span-2">
          <label className={`block text-[10px] tracking-wider uppercase ${variant === 'bar' ? 'text-[\#0A1931]' : 'text-gray-700'} mb-1`}>Destination</label>
          <input
            type="text"
            placeholder="City or hotel name"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={fieldClass}
            required
          />
        </div>
        <div>
          <label className={`block text-[10px] tracking-wider uppercase ${variant === 'bar' ? 'text-[\#0A1931]' : 'text-gray-700'} mb-1`}>Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={fieldClass}
            required
          />
        </div>
        <div>
          <label className={`block text-[10px] tracking-wider uppercase ${variant === 'bar' ? 'text-[\#0A1931]' : 'text-gray-700'} mb-1`}>Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={fieldClass}
            required
          />
        </div>
        <div>
          <label className={`block text-[10px] tracking-wider uppercase ${variant === 'bar' ? 'text-[\#0A1931]' : 'text-gray-700'} mb-1`}>Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className={fieldClass}
          >
            <option>1 Adult</option>
            <option>2 Adults</option>
            <option>2 Adults, 1 Child</option>
            <option>2 Adults, 2 Children</option>
            <option>3 Adults</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className={`inline-flex items-center justify-center rounded-lg px-7 py-3.5 font-medium ${variant === 'bar' ? 'text-[#0A1931]' : ''}`}
          style={variant === 'bar' ? { backgroundColor: 'var(--color-brand-gold)' } : { backgroundColor: 'var(--color-brand-gold)', color: '#0A1931' }}
        >
          {variant === 'bar' ? 'Check Availability' : 'Search'}
        </button>
      </div>
    </form>
  )
}


