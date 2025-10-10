import { useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import ImageWithFallback from '../components/ImageWithFallback'
import RoomSelector from '../components/RoomSelector'

export default function HotelDetails() {
  const images = [
    'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=2069&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552902865-3930f0ec0a6b?q=80&w=2069&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
  ]
  const [index, setIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Gallery */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((src, i) => (
              <div key={src} className="flex-[0_0_100%] relative">
                <ImageWithFallback src={src} alt="Hotel" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => emblaApi?.scrollPrev()} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9">‹</button>
        <button onClick={() => emblaApi?.scrollNext()} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9">›</button>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border ${i === index ? 'border-[var(--color-brand-gold)]' : 'border-gray-200'}`}>
            <ImageWithFallback src={src} alt="Thumb" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main info */}
      <section className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Grand Palace Hotel</h1>
          <div className="text-yellow-500 mt-1">★★★★★</div>
          <div className="mt-1 text-sm text-gray-600">123 Luxury Ave, City, Country</div>
          <p className="mt-4 text-gray-700 max-w-prose">
            Experience timeless elegance at the Grand Palace Hotel, where refined interiors meet impeccable service.
            Enjoy panoramic skyline views, Michelin-starred dining, and a serene spa sanctuary. Our spacious rooms
            and suites feature plush bedding, bespoke furnishings, and contemporary amenities designed for discerning travelers.
          </p>

          {/* Amenities */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
            {[
              ['📶', 'Free Wi‑Fi'],
              ['🏊', 'Pool'],
              ['🏋️', 'Gym'],
              ['🍽️', 'Restaurant'],
              ['🧖', 'Spa'],
              ['🅿️', 'Valet Parking'],
              ['🛎️', 'Concierge'],
              ['🛏️', 'Room Service'],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Selector */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <RoomSelector />
        </aside>
      </section>
    </div>
  )
}


