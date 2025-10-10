import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import HotelCard from '../components/HotelCard'
import HotelSkeleton from '../components/HotelSkeleton'

export default function SearchResults() {
  const [params] = useSearchParams()
  const destination = params.get('destination') || 'Any destination'
  const checkIn = params.get('checkIn') || ''
  const checkOut = params.get('checkOut') || ''

  const [price, setPrice] = useState(Number(params.get('price') || 800))
  const [stars, setStars] = useState(Number(params.get('stars') || 0))
  const [roomTypes, setRoomTypes] = useState<string[]>(params.get('rooms')?.split(',').filter(Boolean) || [])
  const [amenities, setAmenities] = useState<string[]>(params.get('amenities')?.split(',').filter(Boolean) || [])
  const [tiers, setTiers] = useState<string[]>(params.get('tiers')?.split(',').filter(Boolean) || [])
  const [categories, setCategories] = useState<string[]>(params.get('categories')?.split(',').filter(Boolean) || [])

  useEffect(() => {
    const p = new URLSearchParams(params)
    p.set('price', String(price))
    p.set('stars', String(stars))
    if (roomTypes.length) p.set('rooms', roomTypes.join(',')); else p.delete('rooms')
    if (amenities.length) p.set('amenities', amenities.join(',')); else p.delete('amenities')
    if (tiers.length) p.set('tiers', tiers.join(',')); else p.delete('tiers')
    if (categories.length) p.set('categories', categories.join(',')); else p.delete('categories')
    history.replaceState(null, '', `?${p.toString()}`)
  }, [price, stars, roomTypes, amenities, tiers, categories])

  type Hotel = {
    id: string;
    name: string;
    stars: number;
    price: number;
    description: string;
    images: string[];
    city: string;
    tier: 'budget' | 'standard' | 'premium';
    category: 'standard' | 'suite' | 'deluxe suite' | 'presidential suite';
  }

  const hotelsByCity: Record<string, Hotel[]> = useMemo(
    () => ({
      Paris: [
        {
          id: 'paris-1',
          name: 'Hôtel Étoile Royale',
          stars: 5,
          price: 520,
          description: 'Classic Parisian elegance steps from the Champs‑Élysées.',
          images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1501117716987-c8e2a7a6d37b?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=2070&auto=format&fit=crop',
          ],
          city: 'Paris',
          tier: 'premium',
          category: 'presidential suite',
        },
        {
          id: 'paris-2',
          name: 'Le Jardin Suites',
          stars: 4,
          price: 360,
          description: 'Chic boutique hotel with garden terraces and fine pastries.',
          images: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314837-538b205f1b35?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Paris',
          tier: 'standard',
          category: 'deluxe suite',
        },
        {
          id: 'paris-3',
          name: 'Montmartre Inn',
          stars: 3,
          price: 180,
          description: 'Cozy budget stay near Sacré‑Cœur with café downstairs.',
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Paris',
          tier: 'budget',
          category: 'standard',
        },
        {
          id: 'paris-3',
          name: 'Montmartre Inn',
          stars: 3,
          price: 180,
          description: 'Cozy budget stay near Sacré‑Cœur with café downstairs.',
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Paris',
          tier: 'budget',
        },
      ],
      'New York': [
        {
          id: 'nyc-1',
          name: 'The Skyline Tower',
          stars: 5,
          price: 480,
          description: 'Sleek Midtown icon with rooftop bar and skyline views.',
          images: [
            'https://images.unsplash.com/photo-1542314837-538b205f1b35?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'New York',
          tier: 'premium',
          category: 'presidential suite',
        },
        {
          id: 'nyc-2',
          name: 'Central Grand',
          stars: 4,
          price: 340,
          description: 'Refined rooms on the park with celebrated steakhouse.',
          images: [
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'New York',
          tier: 'standard',
          category: 'deluxe suite',
        },
        {
          id: 'nyc-3',
          name: 'Hudson Pods',
          stars: 3,
          price: 150,
          description: 'Smart budget hotel with compact rooms near Hudson Yards.',
          images: [
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'New York',
          tier: 'budget',
          category: 'standard',
        },
      ],
      Tokyo: [
        {
          id: 'tokyo-1',
          name: 'Shinjuku Imperial',
          stars: 5,
          price: 450,
          description: 'Contemporary sanctuary above the neon with onsen spa.',
          images: [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/550605365.jpg?k=36aea1ca2131faaa2c47761580433197dd7c13432c486fc15e06df08362bf0c1&o=',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314837-538b205f1b35?q=80&w=2070&auto=format&fit=crop',
          ],
          city: 'Tokyo',
          tier: 'premium',
          category: 'suite',
        },
        {
          id: 'tokyo-2',
          name: 'Ginza Artisan Hotel',
          stars: 4,
          price: 310,
          description: 'Minimalist design, artisanal breakfasts, and walkable luxury.',
          images: [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1552902865-3930f0ec0a6b?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Tokyo',
          tier: 'standard',
          category: 'deluxe suite',
        },
        {
          id: 'tokyo-3',
          name: 'Asakusa Capsule',
          stars: 3,
          price: 90,
          description: 'Efficient capsules by Senso‑ji; great for explorers.',
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Tokyo',
          tier: 'budget',
          category: 'standard',
        },
      ],
      Dubai: [
        {
          id: 'dubai-1',
          name: 'Palm Marina Resort',
          stars: 5,
          price: 530,
          description: 'Waterfront resort with private beach and fine dining.',
          images: [
            'https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=2070&auto=format&fit=crop',
          ],
          city: 'Dubai',
          tier: 'premium',
          category: 'presidential suite',
        },
        {
          id: 'dubai-2',
          name: 'Desert Pearl',
          stars: 4,
          price: 330,
          description: 'Modern oasis with spa rituals and skyline views.',
          images: [
            'https://images.unsplash.com/photo-1542314837-538b205f1b35?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Dubai',
          tier: 'standard',
          category: 'suite',
        },
        {
          id: 'dubai-3',
          name: 'Old Town Lodge',
          stars: 3,
          price: 160,
          description: 'Budget comfort near souks; great value and location.',
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Dubai',
          tier: 'budget',
          category: 'standard',
        },
      ],
      Rome: [
        {
          id: 'rome-1',
          name: 'Palazzo Aurelia',
          stars: 5,
          price: 400,
          description: 'Historic palazzo near the Trevi Fountain with frescoed suites.',
          images: [
            'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314837-538b205f1b35?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Rome',
          tier: 'premium',
          category: 'presidential suite',
        },
        {
          id: 'rome-2',
          name: 'Via Condotti House',
          stars: 4,
          price: 290,
          description: 'Stylish townhouse by the Spanish Steps with terrace breakfasts.',
          images: [
            'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314837-538b205f1b35?q=80&w=2070&auto=format&fit=crop',
          ],
          city: 'Rome',
          tier: 'standard',
          category: 'deluxe suite',
        },
        {
          id: 'rome-3',
          name: 'Trastevere Rooms',
          stars: 3,
          price: 140,
          description: 'Charming budget guesthouse in cobblestone lanes.',
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Rome',
          tier: 'budget',
          category: 'standard',
        },
      ],
      Singapore: [
        {
          id: 'sg-1',
          name: 'Marina Vista',
          stars: 5,
          price: 470,
          description: 'Harborfront luxury with infinity pool and sky garden.',
          images: [
            'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314837-538b205f1b35?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Singapore',
          tier: 'premium',
          category: 'suite',
        },
        {
          id: 'sg-2',
          name: 'Orchard Grove',
          stars: 4,
          price: 320,
          description: 'Lush urban retreat off Orchard Road, perfect for shoppers.',
          images: [
            'https://images.unsplash.com/photo-1552902865-3930f0ec0a6b?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Singapore',
          tier: 'standard',
          category: 'deluxe suite',
        },
        {
          id: 'sg-3',
          name: 'Bugis Budget Inn',
          stars: 3,
          price: 120,
          description: 'Clean, simple rooms near Bugis MRT; great savings.',
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2069&auto=format&fit=crop',
          ],
          city: 'Singapore',
          tier: 'budget',
          category: 'standard',
        },
      ],
    }),
    []
  )

  const allHotels = Object.values(hotelsByCity).flat()
  const hotels: Hotel[] = hotelsByCity[destination] || allHotels

  const [sort, setSort] = useState<string>(params.get('sort') || 'relevance')
  const filtered = hotels
    .filter((h) => h.price <= price && (stars === 0 || h.stars === stars))
    .filter((h) => (tiers.length ? tiers.includes(h.tier) : true))
    .filter((h) => (categories.length ? categories.includes(h.category) : true))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating-desc') return b.stars - a.stars
      return 0
    })

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    p.set('sort', sort)
    history.replaceState(null, '', `?${p.toString()}`)
  }, [sort])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [destination, checkIn, checkOut])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
      <div className="md:col-span-2 -mb-2">
        <h1 className="text-xl font-semibold text-gray-900">{destination}</h1>
        <div className="text-sm text-gray-600">
          {checkIn && checkOut ? `${checkIn} - ${checkOut}` : 'Flexible dates'}
        </div>
      </div>
      <aside className="md:sticky md:top-24 h-fit rounded-xl border border-gray-200 p-5 hidden md:block">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        <div className="mt-5">
          <label className="text-sm text-gray-700">Price Range: ${'{'}0 - {price}{'}'}</label>
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
        {/* Mobile filter button */}
        <div className="md:hidden">
          <details className="rounded-lg border border-gray-200">
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer">
              <span className="font-medium">Filters</span>
              <span className="text-sm text-gray-600">Tap to open</span>
            </summary>
            <div className="p-4 border-t border-gray-200">
              {/* duplicate of filters */}
              <div>
                <label className="text-sm text-gray-700">Price Range: ${'{'}0 - {price}{'}'}</label>
                <input type="range" min={50} max={800} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full" />
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-700 mb-1">Star Rating</div>
                <div className="flex gap-2 flex-wrap">
                  {[0, 3, 4, 5].map((s) => (
                    <label key={s} className="inline-flex items-center gap-2 text-sm">
                      <input type="radio" name="stars-m" checked={stars === s} onChange={() => setStars(s)} />
                      {s === 0 ? 'Any' : `${s}★`}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-700 mb-2">Tier</div>
                {['budget', 'standard', 'premium'].map((t) => (
                  <label key={t} className="block text-sm mb-1 capitalize">
                    <input className="mr-2" type="checkbox" checked={tiers.includes(t)} onChange={() => toggle(tiers, t, setTiers)} />
                    {t}
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-700 mb-2">Room Type</div>
                {['Standard', 'Deluxe', 'Suite'].map((r) => (
                  <label key={r} className="block text-sm mb-1">
                    <input className="mr-2" type="checkbox" checked={roomTypes.includes(r)} onChange={() => toggle(roomTypes, r, setRoomTypes)} />
                    {r}
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-700 mb-2">Category (Suites)</div>
                {['suite', 'deluxe suite', 'presidential suite', 'standard'].map((c) => (
                  <label key={c} className="block text-sm mb-1 capitalize">
                    <input className="mr-2" type="checkbox" checked={categories.includes(c)} onChange={() => toggle(categories, c, setCategories)} />
                    {c}
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-700 mb-2">Amenities</div>
                {['Free Wi‑Fi', 'Pool', 'Gym', 'Restaurant', 'Spa'].map((a) => (
                  <label key={a} className="block text-sm mb-1">
                    <input className="mr-2" type="checkbox" checked={amenities.includes(a)} onChange={() => toggle(amenities, a, setAmenities)} />
                    {a}
                  </label>
                ))}
              </div>
            </div>
          </details>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">{filtered.length} properties</div>
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
          filtered.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))
        )}
      </section>
    </div>
  )
}


