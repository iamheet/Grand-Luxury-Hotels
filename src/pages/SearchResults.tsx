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
  const [hotelIds, setHotelIds] = useState<string[]>(params.get('hotels')?.split(',').filter(Boolean) || [])

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
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/49168040.jpg?k=179f833194c2b5209d19ce3dc1845d1d20e1a251c95bb9128ce217b38a61ceb0&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/13935449.jpg?k=f9f579d591b088a40330fab41dd8ce80a05ae66e4b441ab383e554b2f3bbe1e2&o=',
            
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

            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/549415122.jpg?k=6aa38e1d6d970b5756c6e0bd4297a603ce8618ffec17a5e8c2332ac20ab1bc2e&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/762654426.jpg?k=e81d32efc2dee072e0c9a880dd3067cc6eb1598ab321ff3def9f4e60f405bd1e&o=',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
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
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/269945146.jpg?k=705f092a0e86ab775de93f8e2013b12ae5981739f5a513bcecead2c0db4e109d&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max500/692661808.jpg?k=7a0a6d2c0e1ec0e8b15169b2ca966641962e761d9965d9b775d6daa140bb4aff&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/692660963.jpg?k=be3958d27d03811946f43623be9fd04f551ce0cc4ec5e370032c2232b6b5fb12&o=',
          ],
          city: 'Paris',
          tier: 'budget',
          category: 'standard',
        },
        {
          id: 'paris-4',
          name: 'InterContinental Paris Le Grand',
          stars: 3,
          price: 180,
          description: 'Cozy budget stay near Sacré‑Cœur with café downstairs.',
          images: [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/305226334.jpg?k=9ae2832a933df98871eb9eb686ca95c00b8f637e0d93925f71df24e7ddab0b4b&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/297823059.jpg?k=28ee53b9d6accd2199214af93b571689cae672df2818e2f38843a7887e2d4646&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/304583156.jpg?k=a27049c923986a45d74b0bda5e80b00735159eadbc51aabd0bd863a3195a8ce8&o=',

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
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763346606.jpg?k=6ec8469c977fbd5e6867bd1da4f454db5914ccf5c962cd9b9ae74a5c2c766ca4&o=',
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
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/674961168.jpg?k=478bea50dd93b61a34be446f180c1b079e08ed9ce425d2680b87f91afea36272&o=',
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
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082763.jpg?k=1e0efd2d22e212697c98ff09502775672c39f4b38dc54b729c3a76f800173d12&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/681025400.jpg?k=3120fe0f32eb74745d92ba73e4a71c0c484c52702d47945ff6a6d7e54343277b&o=',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
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
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/622864288.jpg?k=6709fc69eab0ae881792007d3d099fb03e92be6f6a925e19dce4f212b0664971&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/639594431.jpg?k=1f0e032325674272208889e554401755e263e49c9b692642c0aac3af27fbe2d3&o=',
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
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/488327823.jpg?k=ff6638640efe474a5079fc280b26ba9e3ea4e1a4cfc0dbfaef69d29b3d3cb821&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/91525123.jpg?k=08fb9cca1fcd663c1aead048fd498707fc9aeb81b63461277fdfe248326024c6&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/14834235.jpg?k=cb8b2b9e16642fd7af4951c592cf27bd0d908191e9744b6c377de8eeb97274b7&o=',
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
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/727476358.jpg?k=aec126bb04f23b6b833361fd74d87bd9512216d5bc27827f96554dbe59602a31&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/727476587.jpg?k=803bb5a33d9afde7e895b3600102b28d091c34537e8a0f9f56cfea6036edb17f&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/727476458.jpg?k=68b90d808efc679ccc4335db9e4733b0d324ab0cbbcc155f20573519bf963135&o=',
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
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/598095554.jpg?k=a6feffaab51bf2d7bdbdb6eb5ea1ef8f9e7800524f7f7cfc093519c50f28fd48&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/140880609.jpg?k=c55d9cd422962f34a0fd40b9ef19a375b4537451ed18d4848af149f0a881d60e&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/598095536.jpg?k=b398a34733e5758600406dd0812ab0e0e8bf76e78fb40d2ab62aff95e0877e25&o=',
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
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/567316864.jpg?k=5a093e3d899bc5afd867cd1db35ee8eeb8c7ececdf92067eeb7ee0981fb4bbd0&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/633457074.jpg?k=874c23ff2bf15e0218d9600c4f21ec0cd5a03f557c42ae6b2e884ff58d915b45&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/567317010.jpg?k=dd19da054c7701d9d2576e00666be3f5803b4ab3b11d1dd76675d6db380b76c1&o=',
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
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/435714928.jpg?k=bbf01bc66b9366bb644a3910b74e29a7da359a2c70f450de03bc37275d91c005&o=',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/435714995.jpg?k=8779e505d2dc8e97261b97d0b39dab6a00b5c85e5b3c1e46edf4d7dc1bbfcefd&o=',
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
      Malaysia: [
        {
          id: 'my-1',
          name: 'Kuala Vista Residences',
          stars: 5,
          price: 380,
          description: 'Skyline views in KLCC with infinity pool and fine dining.',
          images: [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/624148627.jpg?k=f1f6ef6b9ef5a4a1a952ad5d47ad8bfdf0e2dba2c286e028bc1b628968fd6e5c&o=',
            'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314837-538b205f1b35?q=80&w=2070&auto=format&fit=crop'
          ],
          city: 'Malaysia',
          tier: 'premium',
          category: 'suite',
        },
        {
          id: 'my-2',
          name: 'Penang Heritage Hotel',
          stars: 4,
          price: 220,
          description: 'Colonial charm in George Town with heritage suites and cafés.',
          images: [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/501134275.jpg?k=f6761a7f8c887d3c1c9f6d19e1aa54a79d2b47d368a3e7e2f8a7c7b1a9d86b2d&o=',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop'
          ],
          city: 'Malaysia',
          tier: 'standard',
          category: 'deluxe suite',
        },
        {
          id: 'my-3',
          name: 'Langkawi Beach Villas',
          stars: 5,
          price: 460,
          description: 'Private beachfront villas with spa cabanas and sunset decks.',
          images: [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/105355665.jpg?k=9e348a5f2bda3fd9e1c2b9d1b3f6ab0c8a0d83c6d8f5e6e9f7f1c7a0a6d0b1b2&o=',
            'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=2070&auto=format&fit=crop'
          ],
          city: 'Malaysia',
          tier: 'premium',
          category: 'presidential suite',
        },
      ],
      Bangkok: [
        {
          id: 'bkk-1',
          name: 'Chao Phraya Riverside',
          stars: 5,
          price: 390,
          description: 'Riverside luxury with boat pier, sky bar, and spa rituals.',
          images: [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/457930046.jpg?k=2f0a1f2a0d52d5ed2b8e6b5f3f7c3a90fa7b0d68f4c0e3e7f2b5c6a0d3e4f5a6&o=',
            'https://images.unsplash.com/photo-1542314837-538b205f1b35?q=80&w=2070&auto=format&fit=crop'
          ],
          city: 'Bangkok',
          tier: 'premium',
          category: 'suite',
        },
        {
          id: 'bkk-2',
          name: 'Sukhumvit Urban Hotel',
          stars: 4,
          price: 240,
          description: 'Chic rooms near BTS with rooftop pool and craft cocktails.',
          images: [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/555924063.jpg?k=6b3a9b6d6c3f1d5e2a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f&o=',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2069&auto=format&fit=crop'
          ],
          city: 'Bangkok',
          tier: 'standard',
          category: 'deluxe suite',
        },
        {
          id: 'bkk-3',
          name: 'Old Town Guesthouse',
          stars: 3,
          price: 120,
          description: 'Budget comfort by temples and street food lanes.',
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2069&auto=format&fit=crop'
          ],
          city: 'Bangkok',
          tier: 'budget',
          category: 'standard',
        },
      ],
      Seoul: [
        {
          id: 'seoul-1',
          name: 'Gangnam Heights',
          stars: 5,
          price: 410,
          description: 'Stylish tower in Gangnam with city views and sauna.',
          images: [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/225664341.jpg?k=0f8d1d1cce6e784a6c9589e46a112f9f2193c96867c2e44dcac670ccd7b7d6c2&o=',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/582009107.jpg?k=6ba40521114ab0a05c16acd7eb328061e59c0645c85e5be6d0243f46aa0881f5&o='
          ],
          city: 'Seoul',
          tier: 'premium',
          category: 'suite',
        },
        {
          id: 'seoul-2',
          name: 'Myeongdong Boutique',
          stars: 4,
          price: 260,
          description: 'Boutique design steps from shopping streets and cafés.',
          images: [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763709548.jpg?k=8f4711a661ffe9156cc27298b7972526f7c2638ec9aab6d4cbc5a2c9fd6390c2&o=',
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2069&auto=format&fit=crop',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763709587.jpg?k=d2f3ddec247b1b8b9901aa3082e0f210bd7cf2fab9bc4598e90a4f512509f36f&o='
          ],
          city: 'Seoul',
          tier: 'standard',
          category: 'deluxe suite',
        },
        {
          id: 'seoul-3',
          name: 'Hanok House',
          stars: 3,
          price: 130,
          description: 'Traditional hanok stay with courtyard charm.',
          images: [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/409143054.jpg?k=2e65ea2a4bd321768e91741df75162d8ae60256c808a36fd1521c53ebe79ab89&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/623911128.jpg?k=21dbd3c41ebaec261a44e3a091bce5f930e068f24ae6aa67ef61fbfc0458d0ff&o=',
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/612404024.jpg?k=709d785c5d0250d29932392df8c0ce3a2b53e90fc3a3edae29d20594a937afab&o='
          ],
          city: 'Seoul',
          tier: 'budget',
          category: 'standard',
        },
      ],
    }),
    []
  )

  const uniqueById = (items: Hotel[]): Hotel[] => {
    const map = new Map<string, Hotel>()
    for (const h of items) {
      if (!map.has(h.id)) map.set(h.id, h)
    }
    return Array.from(map.values())
  }
  const allHotels = uniqueById(Object.values(hotelsByCity).flat())

  // Resolve destination with aliases and fuzzy fallback
  const destinationResolved = useMemo(() => {
    const input = (destination || '').trim().toLowerCase()
    if (!input) return undefined

    const aliases: Record<string, string> = {
      malasia: 'Malaysia',
      malaysia: 'Malaysia',
      malyasia: 'Malaysia',
      malyasiah: 'Malaysia',
      bkk: 'Bangkok',
      bankok: 'Bangkok',
      seol: 'Seoul',
      seul: 'Seoul',
    }
    if (aliases[input]) return aliases[input]

    const keys = Object.keys(hotelsByCity)
    const lowerKeys = keys.map((k) => k.toLowerCase())
    const exactIdx = lowerKeys.indexOf(input)
    if (exactIdx !== -1) return keys[exactIdx]

    // Fuzzy match (Levenshtein distance)
    function distance(a: string, b: string) {
      const dp: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))
      for (let i = 0; i <= a.length; i++) dp[i][0] = i
      for (let j = 0; j <= b.length; j++) dp[0][j] = j
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + cost
          )
        }
      }
      return dp[a.length][b.length]
    }

    let bestKey: string | undefined
    let best = Infinity
    for (const k of keys) {
      const d = distance(input, k.toLowerCase())
      if (d < best) { best = d; bestKey = k }
    }
    // Accept only if reasonably close
    if (best <= 3) return bestKey
    return undefined
  }, [destination, hotelsByCity])

  const hotelsSource: Hotel[] = uniqueById((destinationResolved ? hotelsByCity[destinationResolved] : allHotels))
  const hotelOptions = useMemo(() => hotelsSource.map(h => ({ id: h.id, name: h.name })), [hotelsSource])
  const hotels: Hotel[] = hotelsSource

  const [sort, setSort] = useState<string>(params.get('sort') || 'relevance')
  const filtered = hotels
    .filter((h) => h.price <= price && (stars === 0 || h.stars === stars))
    .filter((h) => (tiers.length ? tiers.includes(h.tier) : true))
    .filter((h) => (categories.length ? categories.includes(h.category) : true))
    .filter((h) => (hotelIds.length ? hotelIds.includes(h.id) : true))
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


