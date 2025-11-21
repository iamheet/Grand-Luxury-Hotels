import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ImageWithFallback from '../components/ImageWithFallback'

type RoomProp = {
  id: string
  title?: string
  name?: string
  image: string
  features?: string[]
  price: number
  guests?: number
  beds?: number
}

export default function Checkout() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const room = (state as any)?.room as RoomProp | undefined

  // If no room supplied, send user back to home or search
  useEffect(() => {
    if (!room) navigate('/', { replace: true })
    
    // Save pending booking when user leaves page
    const handleBeforeUnload = () => {
      if (room && (name || email || phone)) {
        const pendingBooking = {
          id: Date.now().toString(),
          room: room,
          guest: { name: name.trim(), email: email.trim(), phone: phone.trim() },
          checkIn: new Date().toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          guests: 1,
          nights: 1,
          total: room.price,
          bookingDate: new Date().toISOString(),
          status: 'pending',
          roomTitle: room.title || room.name,
          roomImage: room.image
        }
        
        const existingBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
        const alreadyExists = existingBookings.find((b: any) => 
          b.room?.id === room.id && b.status === 'pending' && b.guest?.email === email.trim()
        )
        
        if (!alreadyExists) {
          existingBookings.push(pendingBooking)
          localStorage.setItem('memberBookings', JSON.stringify(existingBookings))
        }
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [room, navigate])

  // auth / stored user detection
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const parsedUser = storedUser ? JSON.parse(storedUser) : null

  // form fields
  const [name, setName] = useState(parsedUser?.name || '')
  const [email, setEmail] = useState(parsedUser?.email || '')
  const [phone, setPhone] = useState(parsedUser?.phone || '')
  const [createAccount, setCreateAccount] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // simple price calculation (can be expanded for taxes, nights, guests)
  const total = room ? room.price : 0

  async function doRegisterIfNeeded(): Promise<string | null> {
    // returns token or null
    if (!createAccount) return null
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      })

      const body = await res.json().catch(() => null)
      if (res.status === 201) {
        if (body?.token) {
          localStorage.setItem('authToken', body.token)
          return body.token
        }
        return null
      }

      if (res.status === 409) {
        throw new Error(body?.message || 'An account with this email already exists. Please log in.')
      }

      throw new Error(body?.message || `Registration failed (${res.status})`)
    } catch (err: any) {
      console.error('Registration error:', err)
      throw new Error(err?.message || 'Registration network error')
    }
  }

  async function handleConfirm(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    setSuccess(null)

    if (!room) {
      setError('No room selected.')
      return
    }

    if (!name || !email || !phone) {
      setError('Please provide name, email and phone number.')
      return
    }

    if (createAccount && password.length < 6) {
      setError('Password must be at least 6 characters to create an account.')
      return
    }

    setLoading(true)
    try {
      // If user wants to create account, register first
      let usedToken = token
      if (!usedToken && createAccount) {
        usedToken = await doRegisterIfNeeded()
      }

      // prepare booking payload
      const payload = {
        roomId: room.id,
        roomTitle: room.title || room.name,
        guest: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
        },
        // add dates, hotel id, extras here if available in state
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (usedToken) headers['Authorization'] = `Bearer ${usedToken}`

      // Create booking object
      const booking = {
        id: Date.now().toString(),
        room: room,
        guest: payload.guest,
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
        guests: 1,
        nights: 1,
        total: room.price,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        roomTitle: payload.roomTitle,
        roomImage: room.image
      }
      
      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
      existingBookings.push(booking)
      localStorage.setItem('memberBookings', JSON.stringify(existingBookings))
      localStorage.setItem('user', JSON.stringify(payload.guest))
      
      // Navigate to success page
      navigate('/booking-success', { state: { booking } })
    } catch (err: any) {
      console.error('Booking error:', err)
      setError(err?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  if (!room) return null

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <section>
          <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="rounded-lg border p-4">
              <h2 className="font-medium mb-2">Guest details</h2>

              <label className="block mb-2">
                <span className="text-sm">Full name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 rounded-md border px-2 py-1" />
              </label>

              <label className="block mb-2">
                <span className="text-sm">Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 rounded-md border px-2 py-1" />
              </label>

              <label className="block mb-2">
                <span className="text-sm">Phone</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 rounded-md border px-2 py-1" />
              </label>

              {!token && (
                <div className="mt-3">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} />
                    <span className="text-sm">Create an account with these details</span>
                  </label>

                  {createAccount && (
                    <label className="block mt-2">
                      <span className="text-sm">Password</span>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 rounded-md border px-2 py-1" />
                    </label>
                  )}
                </div>
              )}
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] font-medium"
              >
                {loading ? 'Processing…' : `Confirm & Pay $${total}`}
              </button>

              <button type="button" className="px-3 py-2 rounded border" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </form>
        </section>

        <aside className="rounded-lg border p-4">
          <h3 className="font-medium mb-3">Your selection</h3>
          <div className="flex gap-3 items-start">
            <div className="w-28 h-20 rounded overflow-hidden">
              <ImageWithFallback src={room.image} alt={room.title || room.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{room.title || room.name}</div>
              <div className="text-sm text-gray-600">{(room.features || []).slice(0, 2).join(' · ')}</div>
              <div className="mt-2 text-lg font-semibold" style={{ color: 'var(--color-brand-gold)' }}>
                ${room.price}
              </div>
            </div>
          </div>

          <div className="mt-4 border-t pt-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & fees</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}