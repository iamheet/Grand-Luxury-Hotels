import { useState, useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import ImageWithFallback from '../components/ImageWithFallback'
import RoomSelector from '../components/RoomSelector'

export default function HotelDetails() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const stateHotel = (location as any).state?.hotel as any | undefined

  // --- Define all hotel data ---
  const hotels = useMemo(
    () => [
      {
        id: 'grand-palace',
        name: 'Grand Palace Hotel',
        rating: 5,
        address: '123 Luxury Ave, City, Country',
        description:
          'Experience timeless elegance at the Grand Palace Hotel, where refined interiors meet impeccable service. Enjoy panoramic skyline views, Michelin-starred dining, and a serene spa sanctuary.',
        images: [
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082763.jpg?k=1e0efd2d22e212697c98ff09502775672c39f4b38dc54b729c3a76f800173d12&o=',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082815.jpg?k=02f67b028a078c447148ec120fc37b81def8ce7baf2040ffce7a303d5d358940&o=',
        ],
        amenities: ['Free Wi-Fi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Valet Parking', 'Concierge', 'Room Service'],
        rooms: [
          { id: 'gp-deluxe', title: 'Deluxe Room', price: 180, guests: 2, beds: 1, image: 'https://images.unsplash.com/photo-1501117716987-c8eecb9767af?q=80&w=2070&auto=format&fit=crop' },
          { id: 'gp-suite', title: 'Executive Suite', price: 350, guests: 3, beds: 2, image: 'https://images.unsplash.com/photo-1552902865-3930f0ec0a6b?q=80&w=2069&auto=format&fit=crop' },
          { id: 'gp-royal', title: 'Royal Suite', price: 600, guests: 4, beds: 2, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082815.jpg?k=02f67b028a078c447148ec120fc37b81def8ce7baf2040ffce7a303d5d358940&o=' },
        ],
      },
      {
        id: 'royal-inn',
        name: 'Royal Inn',
        rating: 4,
        address: '45 Royal St, City, Country',
        description:
          'Cozy and refined stay with modern comforts. Steps from the central square and vibrant dining options.',
        images: [
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/446924572.jpg?k=1c5c38e495b2db2a77f061f2e255dc2464d6d07701cbf7176dd2706cd33420bb&o=',
          'https://images.unsplash.com/photo-1552902865-3930f0ec0a6b?q=80&w=2069&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1501117716987-c8eecb9767af?q=80&w=2070&auto=format&fit=crop',
        ],
        amenities: ['Free Wi-Fi', 'Breakfast', 'Concierge', 'Laundry'],
        rooms: [
          { id: 'ri-standard', title: 'Standard Room', price: 90, guests: 2, beds: 1, image: 'https://images.unsplash.com/photo-1501117716987-c8eecb9767af?q=80&w=2070&auto=format&fit=crop' },
          { id: 'ri-family', title: 'Family Room', price: 140, guests: 4, beds: 2, image: 'https://images.unsplash.com/photo-1505692794400-1a1f4f54b0d4?q=80&w=2070&auto=format&fit=crop' },
        ],
      },
      {
        id: 'sea-view',
        name: 'Sea View Resort',
        rating: 5,
        address: '7 Ocean Drive, Coast City',
        description:
          'Wake up to ocean breezes and panoramic sea views. Luxury suites, beach access, and watersports on site.',
        images: [
          'https://images.unsplash.com/photo-1501117716987-c8eecb9767af?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1505692794400-1a1f4f54b0d4?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=2070&auto=format&fit=crop',
        ],
        amenities: ['Beach Access', 'Pool', 'Spa', 'Water Sports', 'Free Wi-Fi'],
        rooms: [
          { id: 'sv-sea-deluxe', title: 'Sea View Deluxe', price: 220, guests: 2, beds: 1, image: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=2070&auto=format&fit=crop' },
          { id: 'sv-villa', title: 'Beach Villa', price: 480, guests: 6, beds: 3, image: 'https://images.unsplash.com/photo-1505692794400-1a1f4f54b0d4?q=80&w=2070&auto=format&fit=crop' },
        ],
      },
    ],
    []
  )

  // --- Resolve the display hotel ---
  const matchedById = hotels.find((h) => h.id === id)
  const hotel = stateHotel
    ? {
        // Prefer data from navigation state; fall back to local seed where missing
        id: stateHotel.id ?? matchedById?.id ?? 'unknown',
        name: stateHotel.name ?? matchedById?.name ?? 'Hotel',
        rating: stateHotel.stars ?? matchedById?.rating ?? 4,
        address: matchedById?.address ?? (stateHotel.city ? String(stateHotel.city) : '—'),
        description: stateHotel.description ?? matchedById?.description ?? '',
        images: Array.isArray(stateHotel.images) && stateHotel.images.length
          ? stateHotel.images
          : (matchedById?.images ?? []),
        amenities: matchedById?.amenities ?? [],
        rooms: matchedById?.rooms ?? [
          {
            id: 'single',
            title: 'Single Bed Room',
            price: 120,
            guests: 1,
            beds: 1,
            image: (Array.isArray(stateHotel.images) && stateHotel.images[0]) || matchedById?.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2069&auto=format&fit=crop'
          },
          {
            id: 'double',
            title: 'Double Bed Room',
            price: 180,
            guests: 2,
            beds: 1,
            image: (Array.isArray(stateHotel.images) && stateHotel.images[1]) || matchedById?.images?.[1] || 'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=2069&auto=format&fit=crop'
          },
          {
            id: 'suite',
            title: 'Suite',
            price: 260,
            guests: 3,
            beds: 2,
            image: (Array.isArray(stateHotel.images) && stateHotel.images[2]) || matchedById?.images?.[2] || 'https://images.unsplash.com/photo-1552902865-3930f0ec0a6b?q=80&w=2069&auto=format&fit=crop'
          }
        ],
      }
    : (matchedById ?? hotels[0])
  const [index, setIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  // --- UI ---
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Image Gallery */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {hotel.images.map((src) => (
              <div key={src} className="flex-[0_0_100%] relative">
                <ImageWithFallback src={src} alt={hotel.name} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Gallery controls */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9"
        >
          ‹
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9"
        >
          ›
        </button>
      </div>

      {/* Thumbnails */}
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {hotel.images.map((src, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i)
              emblaApi?.scrollTo(i)
            }}
            className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border ${
              i === index ? 'border-[var(--color-brand-gold)]' : 'border-gray-200'
            }`}
          >
            <ImageWithFallback src={src} alt={`${hotel.name} thumb`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Details */}
      <section className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{hotel.name}</h1>
          <div className="text-yellow-500 mt-1">{'★'.repeat(hotel.rating)}</div>
          <div className="mt-1 text-sm text-gray-600">{hotel.address}</div>
          <p className="mt-4 text-gray-700 max-w-prose">{hotel.description}</p>

          {/* Amenities */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
            {hotel.amenities.map((label) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                <span className="text-lg">•</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Selector */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <RoomSelector rooms={hotel.rooms} />
        </aside>
      </section>
    </div>
  )
}
