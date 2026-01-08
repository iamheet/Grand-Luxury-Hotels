import { Link } from 'react-router-dom'
import ImageWithFallback from './ImageWithFallback'
import { useState, useEffect } from 'react'

const cities = [
  { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2070&auto=format&fit=crop' },
  { name: 'New York', image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/615410548.jpg?k=b2b223272c1bc38f8394f18a125a73d52160c4c566cda040687d91fa997ed6c7&o=' },
  { name: 'Tokyo', image: 'https://cf.bstatic.com/xdata/images/hotel/max500/97986399.jpg?k=cd109a8cb120efa5414c04f2f64bbaf0168431f2f78d79f4e4b3026f50c1852a&o=' },
  { name: 'Dubai', image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/402062213.jpg?k=b210cfef3e9c3450e72a0c21675110a1b62f2f2174a276eb8c2762a99a5cd61d&o=' },
  { name: 'Rome', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Singapore', image: 'https://cf.bstatic.com/xdata/images/hotel/max300/281047348.jpg?k=16b2802339249d3978326b7f570026ae77af5ff78716646a46b6dbabdbc5ffcc&o=' },
  { name: 'Malaysia', image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/604095272.jpg?k=27eaf1958876c206e4284916e2655a042b9d79269204d4e5d24221a885f64a7b&o=' },
  { name: 'Bangkok', image:'https://cf.bstatic.com/xdata/images/hotel/max300/350599279.jpg?k=a5e491a7f969edd33907623ed53a6fe0ec67e5761664cbbdeffc1fbd436d36d0&o=' },
  { name: 'Seoul', image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/590904787.jpg?k=fc3a055117b45594091f5f59304fd450ed806a55a265d9c5917eecd7e7175695&o=' },
]

export default function FeaturedDestinations() {
  const [dbDestinations, setDbDestinations] = useState<any[]>([])

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hotels')
        const data = await response.json()
        if (data.success) {
          // Group hotels by location and show ALL hotels
          const locationMap = new Map()
          data.hotels.forEach((hotel: any) => {
            if (!locationMap.has(hotel.location)) {
              locationMap.set(hotel.location, [])
            }
            locationMap.get(hotel.location).push(hotel)
          })
          
          // Create destination cards for each location (showing first hotel image)
          const newDestinations = Array.from(locationMap.entries()).map(([location, hotels]: [string, any[]]) => {
            return { name: location, image: hotels[0].image, count: hotels.length }
          })
          setDbDestinations(newDestinations)
        }
      } catch (error) {
        console.error('Error fetching destinations:', error)
      }
    }
    fetchDestinations()
  }, [])

  const allDestinations = [...cities, ...dbDestinations].slice(0, 9)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {allDestinations.map((c) => (
        <article
          key={c.name}
          className="group relative overflow-hidden rounded-xl shadow-sm border border-gray-200"
        >
          <ImageWithFallback
            src={c.image}
            alt={c.name}
            className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
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


