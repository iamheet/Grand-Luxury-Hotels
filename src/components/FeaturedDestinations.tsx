const cities = [
  { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2070&auto=format&fit=crop' },
  { name: 'New York', image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/615410548.jpg?k=b2b223272c1bc38f8394f18a125a73d52160c4c566cda040687d91fa997ed6c7&o=' },
  { name: 'Tokyo', image: 'https://cf.bstatic.com/xdata/images/hotel/max500/97986399.jpg?k=cd109a8cb120efa5414c04f2f64bbaf0168431f2f78d79f4e4b3026f50c1852a&o=' },
  { name: 'Dubai', image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/402062213.jpg?k=b210cfef3e9c3450e72a0c21675110a1b62f2f2174a276eb8c2762a99a5cd61d&o=' },
  { name: 'Rome', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Singapore', image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/759622129.jpg?k=12759b5e8cefa8be1ea2e82cb400df75d4871588cbd2e5ca8f7f1b0911f37746&o=' },
]

import { Link } from 'react-router-dom'
import ImageWithFallback from './ImageWithFallback'

export default function FeaturedDestinations() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cities.slice(0, 6).map((c) => (
        <article key={c.name} className="group relative overflow-hidden rounded-xl shadow-sm border border-gray-200">
          <ImageWithFallback src={c.image} alt={c.name} className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-4 flex items-center justify-between w-full">
            <h3 className="text-white font-medium text-lg">{c.name}</h3>
            <Link
              to={`/search?destination=${encodeURIComponent(c.name)}`}
              className="text-sm font-medium px-3 py-1.5 rounded-md"
              style={{ backgroundColor: 'var(--color-brand-gold)', color: '#0A1931' }}
            >
              View Deals
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}


