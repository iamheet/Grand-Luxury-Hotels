import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type BookingFormProps = {
  variant?: 'bar' | 'card'
}

export default function BookingForm({ variant = 'bar' }: BookingFormProps) {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)
  const [focused, setFocused] = useState(false)
  const [showHint, setShowHint] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!destination.trim()) {
      setShowHint(true)
      return
    }

    const params = new URLSearchParams({
      destination: destination.trim(),
      checkIn,
      checkOut,
      adults: adults.toString(),
    })
    navigate(`/search?${params.toString()}`)
  }

  const inputClass = "w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-all duration-200 focus:border-[var(--color-brand-gold)] focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:ring-opacity-20 outline-none"
  const labelClass = "block text-sm font-medium mb-1.5 text-gray-700"

  return (
    <div className={`backdrop-blur-md bg-white/95 rounded-xl p-5 md:p-7 shadow-xl border border-white/40 transition-shadow duration-300 ${focused ? 'shadow-2xl' : ''}`}>
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-wrap gap-4"
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setFocused(false)
          }
        }}
      >
        <div className="flex-1 min-w-[240px] relative">
          <label className={labelClass}>
            Where would you like to stay?
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value)
              setShowHint(false)
            }}
            className={`${inputClass} ${showHint ? 'border-amber-500 focus:border-amber-500 focus:ring-amber-500' : ''}`}
            placeholder="Enter destination or hotel name"
          />
          {showHint && (
            <div className="absolute text-amber-600 text-sm mt-1 animate-fade-in">
              Please enter a destination to search
            </div>
          )}
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-end gap-4">
          <div>
            <label className={labelClass}>Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className={inputClass}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className={labelClass}>Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className={inputClass}
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex items-end space-x-3">
            <div>
              <label className={labelClass}>Guests</label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className={inputClass + " min-w-[80px]"}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="h-[46px] bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-6 rounded-lg font-medium whitespace-nowrap hover:brightness-95 active:brightness-90 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}


