import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ImageWithFallback from '../components/ImageWithFallback'

export default function BookingSuccess() {
  const { state } = useLocation()
  const booking = (state as any)?.booking
  const navigate = useNavigate()

  useEffect(() => {
    // Save booking to localStorage when we reach success page
    if (booking) {
      const existingBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
      
      // Check if this booking already exists
      const bookingExists = existingBookings.find((b: any) => b.id === booking.id)
      
      if (!bookingExists) {
        existingBookings.push(booking)
        localStorage.setItem('memberBookings', JSON.stringify(existingBookings))
        console.log('Booking saved:', booking)
        console.log('All bookings:', existingBookings)
      }
    }
  }, [booking])

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
          {booking.member ? (
            <button 
              onClick={() => {
                const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
                if (memberData) {
                  const parsedMember = JSON.parse(memberData)
                  localStorage.setItem('member', JSON.stringify(parsedMember))
                  localStorage.setItem('memberCheckout', JSON.stringify(parsedMember))
                }
                navigate('/member-dashboard', { replace: true })
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-4 py-2 rounded font-semibold hover:brightness-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Home
            </button>
          ) : (
            <button onClick={() => navigate('/')} className="px-4 py-2 rounded bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)]">Back to home</button>
          )}
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded border">View previous</button>
        </div>
      </div>
    </main>
  )
}