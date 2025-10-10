import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import ImageWithFallback from './ImageWithFallback'

type Hotel = {
  id: string
  name: string
  stars: number
  price: number
  description: string
  images: string[]
}

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const images = hotel.images
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  function prev() { emblaApi?.scrollPrev() }
  function next() { emblaApi?.scrollNext() }

  return (
    <article className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="relative aspect-[16/9]">
        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((src) => (
              <div key={src} className="flex-[0_0_100%] relative">
                <ImageWithFallback src={src} alt={hotel.name} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9">‹</button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9">›</button>
      </div>
      <div className="p-5 grid gap-2 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
          <div className="text-yellow-500 text-sm">{'★'.repeat(hotel.stars)}{'☆'.repeat(5 - hotel.stars)}</div>
          <p className="mt-2 text-sm text-gray-600 max-w-prose">{hotel.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold" style={{ color: 'var(--color-brand-gold)' }}>
            ${hotel.price}
            <span className="text-sm text-gray-500 ml-1">/night</span>
          </div>
          <Link
            to={`/hotel/${hotel.id}`}
            className="mt-3 inline-flex items-center justify-center rounded-lg px-4 py-2"
            style={{ backgroundColor: 'var(--color-brand-gold)', color: '#0A1931' }}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}


