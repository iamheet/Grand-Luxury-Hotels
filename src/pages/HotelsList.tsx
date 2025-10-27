import { Link } from 'react-router-dom'

export default function HotelsList() {
  const hotels = [
    {
      id: 'grand-palace',
      name: 'Grand Palace Hotel',
      description:
        'Timeless elegance with skyline views, Michelin‑starred dining, and a serene spa sanctuary.'
    },
    {
      id: 'royal-inn',
      name: 'Royal Inn',
      description:
        'Cozy refined stay near the central square with modern comforts and attentive concierge.'
    },
    {
      id: 'sea-view',
      name: 'Sea View Resort',
      description:
        'Oceanfront retreat with beach access, luxury suites, and water sports on site.'
    },
  ]

  return (
    <div className="p-10 grid gap-4">
      {hotels.map((h) => (
        <Link
          key={h.id}
          to={`/hotel/${h.id}`}
          className="p-4 border rounded-lg hover:bg-gray-50 transition"
        >
          <div className="font-semibold text-gray-900">{h.name}</div>
          {h.description && (
            <p className="mt-1 text-sm text-gray-600">{h.description}</p>
          )}
        </Link>
      ))}
    </div>
  )
}
