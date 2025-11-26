import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TheaterTickets() {
  const navigate = useNavigate()

  const ticketOptions = [
    { id: 1, name: 'Hamilton - Broadway', venue: 'Richard Rodgers Theatre', location: 'New York', price: 450, type: 'Musical', image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400', description: 'Premium orchestra seats for the hit musical' },
    { id: 2, name: 'The Lion King', venue: 'Minskoff Theatre', location: 'New York', price: 380, type: 'Musical', image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400', description: 'VIP seating with backstage tour included' },
    { id: 3, name: 'La Scala Opera Gala', venue: 'Teatro alla Scala', location: 'Milan', price: 850, type: 'Opera', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', description: 'Box seats for exclusive opera performance' },
    { id: 4, name: 'Royal Opera House', venue: 'Covent Garden', location: 'London', price: 620, type: 'Opera', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', description: 'Royal box with champagne service' },
    { id: 5, name: 'Cirque du Soleil VIP', venue: 'Various Locations', location: 'Worldwide', price: 320, type: 'Performance', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', description: 'Front row seats with meet & greet' },
    { id: 6, name: 'Sydney Opera House', venue: 'Concert Hall', location: 'Sydney', price: 480, type: 'Concert', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', description: 'Premium seats for world-class performances' }
  ]

  const handleBooking = (ticket: any) => {
    const ticketService = {
      id: `ticket-${ticket.id}`,
      name: ticket.name,
      ticket: ticket,
      type: 'ticket'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: ticketService } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-[var(--color-brand-navy)] to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🎭 Theater & Concert Tickets</h1>
          <p className="text-gray-300 text-lg">Premium seats to world's most exclusive performances</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ticketOptions.map((ticket) => (
            <div key={ticket.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 group">
              <div className="relative overflow-hidden">
                <img src={ticket.image} alt={ticket.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {ticket.type}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm opacity-90">{ticket.venue}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{ticket.name}</h3>
                <p className="text-indigo-300 text-sm font-medium mb-2">{ticket.location}</p>
                <p className="text-gray-300 text-sm mb-4">{ticket.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[var(--color-brand-gold)]">${ticket.price}</span>
                    <p className="text-xs text-gray-400">per ticket</p>
                  </div>
                  <button 
                    onClick={() => handleBooking(ticket)}
                    className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-2 rounded-lg font-bold hover:brightness-95 transition-all transform hover:scale-105"
                  >
                    Book Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 backdrop-blur-xl rounded-3xl p-8 border border-indigo-500/30">
          <h3 className="text-2xl font-bold text-center text-white mb-8">VIP Experience Includes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Premium Seating</h4>
              <p className="text-gray-300 text-sm">Best seats in the house with unobstructed views</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">VIP Access</h4>
              <p className="text-gray-300 text-sm">Priority entry and exclusive lounge access</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Concierge Service</h4>
              <p className="text-gray-300 text-sm">Personal assistance and special arrangements</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/royal-concierge')}
            className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            ← Back to Concierge
          </button>
        </div>
      </div>
    </div>
  )
}