import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ImageWithFallback from '../components/ImageWithFallback'

export default function BookingSuccess() {
  const { state } = useLocation()
  const booking = (state as any)?.booking
  const navigate = useNavigate()

  useEffect(() => {
    // if user lands here directly without booking data, keep page usable
    // you may redirect home after a timeout if you prefer
  }, [])

  if (!booking) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">Booking confirmation</h1>
        <p className="mb-6">No booking information was found. If you just completed a booking, please return to the site and try again.</p>
        <div className="flex justify-center gap-3">
          <button onClick={() => navigate('/')} className="px-4 py-2 rounded bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)]">Go home</button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded border">Back</button>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="rounded-lg border p-6 text-center">
        <div className="text-3xl mb-3">✅</div>
        <h1 className="text-2xl font-semibold mb-2">Booking confirmed</h1>
        <p className="text-sm text-gray-600 mb-4">Reference: <span className="font-medium">{booking.id || booking.reference || '—'}</span></p>

        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start mb-4">
          {booking.roomImage && (
            <div className="w-full md:w-28 h-20 rounded overflow-hidden">
              <ImageWithFallback src={booking.roomImage} alt={booking.roomTitle || 'Room'} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="text-left">
            <div className="font-semibold">{booking.roomTitle || booking.roomName || 'Room'}</div>
            <div className="text-sm text-gray-600">{booking.hotelName ?? ''}</div>
            <div className="mt-2 text-sm">
              Guest: <span className="font-medium">{booking.guest?.name ?? booking.guestName ?? '—'}</span>
            </div>
            <div className="text-sm">Email: {booking.guest?.email ?? '—'}</div>
            <div className="text-sm">Phone: {booking.guest?.phone ?? '—'}</div>
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span>Amount paid</span>
            <span className="font-semibold">${booking.amount ?? booking.total ?? '0'}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => navigate('/')} className="px-4 py-2 rounded bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)]">Back to home</button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded border">View previous</button>
        </div>
      </div>
    </main>
  )
}