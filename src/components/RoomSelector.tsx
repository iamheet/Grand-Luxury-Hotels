type Room = {
  id: string
  name: string
  image: string
  features: string[]
  price: number
}

const rooms: Room[] = [
  {
    id: 'std',
    name: 'Standard Room',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2069&auto=format&fit=crop',
    features: ['King Bed', 'City View', 'Complimentary Wi‑Fi'],
    price: 220,
  },
  {
    id: 'dlx',
    name: 'Deluxe Room',
    image: 'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=2069&auto=format&fit=crop',
    features: ['Lounge Access', 'Rain Shower', 'Breakfast Included'],
    price: 320,
  },
  {
    id: 'ste',
    name: 'Suite',
    image: 'https://images.unsplash.com/photo-1552902865-3930f0ec0a6b?q=80&w=2069&auto=format&fit=crop',
    features: ['Separate Living Area', 'Butler Service', 'Panoramic View'],
    price: 520,
  },
]

import ImageWithFallback from './ImageWithFallback'

export default function RoomSelector() {
  return (
    <div className="space-y-4">
      {rooms.map((r) => (
        <article key={r.id} className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr_auto]">
            <div className="relative sm:h-full h-48">
              <ImageWithFallback src={r.image} alt={r.name} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{r.name}</h3>
              <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                {r.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 text-right">
              <div className="text-xl font-semibold" style={{ color: 'var(--color-brand-gold)' }}>
                ${r.price}
              </div>
              <button
                className="mt-2 inline-flex items-center justify-center rounded-lg px-4 py-2"
                style={{ backgroundColor: 'var(--color-brand-gold)', color: '#0A1931' }}
                onClick={() => alert('Booking flow placeholder')}
              >
                Select Room
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}


