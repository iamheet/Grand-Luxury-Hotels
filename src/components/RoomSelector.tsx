import { useNavigate } from 'react-router-dom'
import ImageWithFallback from './ImageWithFallback'

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

const defaultRooms: RoomProp[] = [
  {
    id: 'std',
    title: 'Standard Room',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2069&auto=format&fit=crop',
    features: ['King Bed', 'City View', 'Complimentary Wi‑Fi'],
    price: 220,
  },
  {
    id: 'dlx',
    title: 'Deluxe Room',
    image: 'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=2069&auto=format&fit=crop',
    features: ['Lounge Access', 'Rain Shower', 'Breakfast Included'],
    price: 320,
  },
  {
    id: 'ste',
    title: 'Suite',
    image: 'https://images.unsplash.com/photo-1552902865-3930f0ec0a6b?q=80&w=2069&auto=format&fit=crop',
    features: ['Separate Living Area', 'Butler Service', 'Panoramic View'],
    price: 520,
  },
]

export default function RoomSelector({ rooms = defaultRooms, hotelName }: { rooms?: RoomProp[], hotelName?: string }) {
  const navigate = useNavigate()

  return (
    // keep selector scrollable inside the aside so it stays visible in the frame
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {rooms.map((r) => {
        const title = r.title || r.name || 'Room'
        const features = r.features ?? [
          ...(r.guests ? [`Guests: ${r.guests}`] : []),
          ...(r.beds ? [`Beds: ${r.beds}`] : []),
        ]

        return (
          <article key={r.id} className="rounded-xl border border-gray-200 overflow-hidden">
            {/* tightened columns and reduced image size so items fit in the aside */}
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr_96px] items-stretch">
              <div className="relative sm:h-24 h-40">
                <ImageWithFallback src={r.image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                <ul className="mt-2 text-xs text-gray-600 list-disc pl-5 space-y-0.5">
                  {features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 text-right flex flex-col justify-center items-end gap-2">
                <div className="text-lg font-semibold" style={{ color: 'var(--color-brand-gold)' }}>
                  ${r.price}
                </div>
                <button
                  className="mt-0 inline-flex items-center justify-center rounded-md px-3 py-1 text-sm"
                  style={{ backgroundColor: 'var(--color-brand-gold)', color: '#0A1931' }}
                  onClick={() => navigate('/checkout', { state: { room: { ...r, hotelName } } })}
                >
                  Select
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}


