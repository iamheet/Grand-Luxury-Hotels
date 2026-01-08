import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import HotelCard from '../components/HotelCard'
import HotelSkeleton from '../components/HotelSkeleton'
import Pagination from '../components/Pagination'
import { hotelsByCity, type Hotel } from '../data/hotels'

export default function SearchResults() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const destination = params.get('destination') || 'Any destination'
  const checkIn = params.get('checkIn') || ''
  const checkOut = params.get('checkOut') || ''

  const [searchQuery, setSearchQuery] = useState(destination === 'Any destination' ? '' : destination)
  const [price, setPrice] = useState(Number(params.get('price') || 800))
  const [stars, setStars] = useState(Number(params.get('stars') || 0))
  const [roomTypes, setRoomTypes] = useState<string[]>(params.get('rooms')?.split(',').filter(Boolean) || [])
  const [amenities, setAmenities] = useState<string[]>(params.get('amenities')?.split(',').filter(Boolean) || [])
  const [tiers, setTiers] = useState<string[]>(params.get('tiers')?.split(',').filter(Boolean) || [])
  const [categories, setCategories] = useState<string[]>(params.get('categories')?.split(',').filter(Boolean) || [])
  const [hotelIds, setHotelIds] = useState<string[]>(params.get('hotels')?.split(',').filter(Boolean) || [])
  const [dbHotels, setDbHotels] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const hotelsPerPage = 6

  // Fetch database hotels
  useEffect(() => {
    const fetchDbHotels = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hotels/normal')
        const data = await response.json()
        if (data.success) {
          setDbHotels(data.hotels)
        }
      } catch (error) {
        console.error('Error fetching hotels:', error)
      }
    }
    fetchDbHotels()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?destination=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  useEffect(() => {
    const p = new URLSearchParams(params)
    p.set('price', String(price))
    p.set('stars', String(stars))
    if (roomTypes.length) p.set('rooms', roomTypes.join(',')); else p.delete('rooms')
    if (amenities.length) p.set('amenities', amenities.join(',')); else p.delete('amenities')
    if (tiers.length) p.set('tiers', tiers.join(',')); else p.delete('tiers')
    if (categories.length) p.set('categories', categories.join(',')); else p.delete('categories')
    if (hotelIds.length) p.set('hotels', hotelIds.join(',')); else p.delete('hotels')
    history.replaceState(null, '', `?${p.toString()}`)
  }, [price, stars, roomTypes, amenities, tiers, categories, hotelIds])

  const uniqueById = (items: Hotel[]): Hotel[] => {
    const map = new Map<string, Hotel>()
    for (const h of items) {
      if (!map.has(h.id)) map.set(h.id, h)
    }
    return Array.from(map.values())
  }
  
  // Convert database hotels to UI format and combine with static hotels
  const convertDbHotels = (): Hotel[] => {
    return dbHotels.map(hotel => ({
      id: `db-${hotel._id}`, // Prefix with 'db-' to avoid ID conflicts
      name: hotel.name,
      stars: hotel.rating,
      price: hotel.price,
      description: `Luxury accommodation in ${hotel.location}`,
      images: [hotel.image],
      city: hotel.location,
      tier: hotel.price > 400 ? 'premium' : hotel.price > 200 ? 'standard' : 'budget',
      category: hotel.exclusive ? 'presidential suite' : 'deluxe suite',
      amenities: ['Free Wi‑Fi', 'Pool', 'Spa', 'Restaurant', 'Gym']
    }))
  }
  
  // Remove duplicate hotels by name and location
  const removeDuplicateHotels = (hotels: Hotel[]): Hotel[] => {
    const seen = new Set<string>()
    return hotels.filter(hotel => {
      const key = `${hotel.name.toLowerCase()}-${hotel.city.toLowerCase()}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }
  
  // Check if user is a member to show exclusive hotels
  const isMember = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
  const exclusiveHotels = [] // Disable exclusive hotels - they're now in database
  
  const staticHotels = [] // Remove static hotels
  const dynamicHotels = convertDbHotels()
  const allHotels = removeDuplicateHotels([...exclusiveHotels, ...dynamicHotels])

  const destinationResolved = useMemo(() => {
    const input = (destination || '').trim().toLowerCase()
    if (!input || input === 'any destination') return undefined

    // Direct aliases
    const aliases: Record<string, string> = {
      malasia: 'Malaysia',
      malaysia: 'Malaysia',
      malayasia: 'Malaysia',
      bkk: 'Bangkok',
      bangkok: 'Bangkok',
      seol: 'Seoul',
      seoul: 'Seoul',
      paris: 'Paris',
      tokyo: 'Tokyo',
      dubai: 'Dubai',
      rome: 'Rome',
      singapore: 'Singapore',
      'new york': 'New York',
      newyork: 'New York',
      nyc: 'New York'
    }
    
    if (aliases[input]) return aliases[input]

    // Exact match with city keys
    const keys = Object.keys(hotelsByCity)
    for (const key of keys) {
      if (key.toLowerCase() === input) {
        return key
      }
    }

    return undefined
  }, [destination])

  const hotelsSource: Hotel[] = destinationResolved 
    ? removeDuplicateHotels([...exclusiveHotels.filter(h => h.city.toLowerCase().includes(destinationResolved.toLowerCase())), ...dynamicHotels.filter(h => h.city.toLowerCase().includes(destinationResolved.toLowerCase()))])
    : allHotels
  const hotelOptions = useMemo(() => allHotels.map(h => ({ id: h.id, name: h.name })), [allHotels, dbHotels])
  const hotels: Hotel[] = hotelsSource

  const [sort, setSort] = useState<string>(params.get('sort') || 'relevance')
  const filtered = hotels
    .filter((h) => h.price <= price && (stars === 0 || h.stars === stars))
    .filter((h) => (tiers.length ? tiers.includes(h.tier) : true))
    .filter((h) => (categories.length ? categories.includes(h.category) : true))
    .filter((h) => (hotelIds.length ? hotelIds.includes(h.id) : true))
    .filter((h) => (amenities.length ? amenities.every(a => h.amenities?.includes(a)) : true))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating-desc') return b.stars - a.stars
      return 0
    })

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const [loading, setLoading] = useState(false)

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / hotelsPerPage)
  const startIndex = (currentPage - 1) * hotelsPerPage
  const endIndex = startIndex + hotelsPerPage
  const currentHotels = filtered.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    setLoading(true)
    setCurrentPage(1) // Reset to first page when filters change
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [destination, checkIn, checkOut, price, stars, roomTypes, amenities, tiers, categories, hotelIds])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8 animate-slideDown">
        <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destination..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-[var(--color-brand-gold)] transition-all"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] font-medium hover:brightness-95 transition"
          >
            Search
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <div className="md:col-span-2 -mb-2">
          <h1 className="text-xl font-semibold text-gray-900">{destinationResolved || destination}</h1>
          <div className="text-sm text-gray-600">
            {checkIn && checkOut ? `${checkIn} - ${checkOut}` : 'Flexible dates'}
          </div>
        </div>
        
        <aside className="md:sticky md:top-24 h-fit rounded-xl border border-gray-200 p-5 hidden md:block">
          <h2 className="font-semibold text-gray-900">Filters</h2>
          <div className="mt-5">
            <div className="text-sm text-gray-700 mb-2">Hotels</div>
            <div className="max-h-40 overflow-auto pr-1 space-y-1">
              {hotelOptions.map((opt) => (
                <label key={opt.id} className="block text-sm">
                  <input className="mr-2" type="checkbox" checked={hotelIds.includes(opt.id)} onChange={() => toggle(hotelIds, opt.id, setHotelIds)} />
                  {opt.name}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <label className="text-sm text-gray-700">Price Range: $0 - {price}</label>
            <input type="range" min={50} max={800} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full" />
          </div>
          <div className="mt-6">
            <div className="text-sm text-gray-700 mb-1">Star Rating</div>
            <div className="flex gap-2 flex-wrap">
              {[0, 3, 4, 5].map((s) => (
                <label key={s} className="inline-flex items-center gap-2 text-sm">
                  <input type="radio" name="stars" checked={stars === s} onChange={() => setStars(s)} />
                  {s === 0 ? 'Any' : `${s}★`}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <div className="text-sm text-gray-700 mb-2">Tier</div>
            {['budget', 'standard', 'premium'].map((t) => (
              <label key={t} className="block text-sm mb-1 capitalize">
                <input className="mr-2" type="checkbox" checked={tiers.includes(t)} onChange={() => toggle(tiers, t, setTiers)} />
                {t}
              </label>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-sm text-gray-700 mb-2">Room Type</div>
            {['Standard', 'Deluxe', 'Suite'].map((r) => (
              <label key={r} className="block text-sm mb-1">
                <input className="mr-2" type="checkbox" checked={roomTypes.includes(r)} onChange={() => toggle(roomTypes, r, setRoomTypes)} />
                {r}
              </label>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-sm text-gray-700 mb-2">Category (Suites)</div>
            {['suite', 'deluxe suite', 'presidential suite', 'standard'].map((c) => (
              <label key={c} className="block text-sm mb-1 capitalize">
                <input className="mr-2" type="checkbox" checked={categories.includes(c)} onChange={() => toggle(categories, c, setCategories)} />
                {c}
              </label>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-sm text-gray-700 mb-2">Amenities</div>
            {['Free Wi‑Fi', 'Pool', 'Gym', 'Restaurant', 'Spa'].map((a) => (
              <label key={a} className="block text-sm mb-1">
                <input className="mr-2" type="checkbox" checked={amenities.includes(a)} onChange={() => toggle(amenities, a, setAmenities)} />
                {a}
              </label>
            ))}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filtered.length} properties • Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-700">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border border-gray-300 px-2 py-1 text-gray-900">
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <HotelSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {currentHotels.map((h) => (
                  <HotelCard key={h.id} hotel={h} />
                ))}
              </div>
              
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </div>
    </div>
  )
}