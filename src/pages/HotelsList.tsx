import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Pagination from '../components/Pagination'

export default function HotelsList() {
  const [dbHotels, setDbHotels] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const hotelsPerPage = 6

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:5000/api/hotels')
        const data = await response.json()
        if (data.success) {
          setDbHotels(data.hotels)
        }
      } catch (error) {
        console.error('Error fetching hotels:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [])

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

  const allHotels = [...hotels, ...dbHotels.map(h => ({
    id: h._id,
    name: h.name,
    description: `Luxury accommodation in ${h.location} • $${h.price}/night • ⭐ ${h.rating}`
  }))]

  // Pagination logic
  const totalPages = Math.ceil(allHotels.length / hotelsPerPage)
  const startIndex = (currentPage - 1) * hotelsPerPage
  const endIndex = startIndex + hotelsPerPage
  const currentHotels = allHotels.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Hotels</h1>
          <p className="text-gray-600">Discover luxury accommodations around the world</p>
          <div className="mt-4 text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, allHotels.length)} of {allHotels.length} hotels
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentHotels.map((h) => (
                <Link
                  key={h.id}
                  to={`/hotel/${h.id}`}
                  className="bg-white p-6 border rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="font-semibold text-xl text-gray-900 mb-2">{h.name}</div>
                  {h.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{h.description}</p>
                  )}
                  <div className="mt-4 text-blue-600 font-medium text-sm">View Details →</div>
                </Link>
              ))}
            </div>

            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}