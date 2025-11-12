import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import ImageWithFallback from './ImageWithFallback'

function getAmenityIcon(amenity: string) {
  const iconMap: Record<string, JSX.Element> = {
    'Free Wi‑Fi': <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
    'Pool': <svg className="w-3 h-3 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10s3-1 4-1 4 1 4 1 3-1 4-1 4 1 4 1v1s-3-1-4-1-4 1-4 1-3-1-4-1-4 1-4 1v-1zM2 13s3-1 4-1 4 1 4 1 3-1 4-1 4 1 4 1v1s-3-1-4-1-4 1-4 1-3-1-4-1-4 1-4 1v-1z"/></svg>,
    'Gym': <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 9V7a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1zM2 7a1 1 0 011-1h1v6H3a1 1 0 01-1-1V7zM17 6a1 1 0 011 1v4a1 1 0 01-1 1h-1V6h1z"/></svg>,
    'Restaurant': <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 01-1 1H8a1 1 0 110-2h4a1 1 0 011 1zm-1 4a1 1 0 100-2H8a1 1 0 100 2h4z" clipRule="evenodd" /></svg>,
    'Spa': <svg className="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
  }
  return iconMap[amenity] || <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3" /></svg>
}

type Hotel = {
  id: string
  name: string
  stars: number
  price: number
  description: string
  images: string[]
  amenities?: string[]
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
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {hotel.amenities.map((amenity) => (
                <span key={amenity} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {getAmenityIcon(amenity)}
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold" style={{ color: 'var(--color-brand-gold)' }}>
            ${hotel.price}
            <span className="text-sm text-gray-500 ml-1">/night</span>
          </div>
          <Link
            to={`/hotel/${hotel.id}`}
            state={{ hotel }}
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


