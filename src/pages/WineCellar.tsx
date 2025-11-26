import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WineCellar() {
  const navigate = useNavigate()

  const wineExperiences = [
    { id: 1, name: 'Bordeaux Grand Cru Tour', winery: 'Château Margaux', region: 'Bordeaux, France', price: 1800, image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400', description: 'Private tour with vintage tastings from 1990-2010' },
    { id: 2, name: 'Champagne Dom Pérignon', winery: 'Dom Pérignon', region: 'Champagne, France', price: 2200, image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400', description: 'Exclusive cellar tour with vintage collection tasting' },
    { id: 3, name: 'Napa Valley Premium', winery: 'Screaming Eagle', region: 'California, USA', price: 1600, image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400', description: 'Private vineyard tour with cult wine tastings' },
    { id: 4, name: 'Tuscany Chianti Classico', winery: 'Castello di Ama', region: 'Tuscany, Italy', price: 1200, image: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=400', description: 'Historic estate tour with aged Chianti reserves' },
    { id: 5, name: 'Burgundy Pinot Noir', winery: 'Domaine de la Romanée-Conti', region: 'Burgundy, France', price: 3500, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', description: 'Ultra-rare tasting of legendary Pinot Noir vintages' },
    { id: 6, name: 'Port Wine Heritage', winery: 'Taylor Fladgate', region: 'Porto, Portugal', price: 950, image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400', description: 'Historic cellars with vintage Port collection' }
  ]

  const handleBooking = (experience: any) => {
    const wineService = {
      id: `wine-${experience.id}`,
      name: experience.name,
      wine: experience,
      type: 'wine'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: wineService } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-[var(--color-brand-navy)] to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🍷 Wine Cellar Tours & Tastings</h1>
          <p className="text-gray-300 text-lg">Exclusive access to world's finest wine collections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wineExperiences.map((experience) => (
            <div key={experience.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 group">
              <div className="relative overflow-hidden">
                <img src={experience.image} alt={experience.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Premium
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm opacity-90">{experience.winery}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{experience.name}</h3>
                <p className="text-red-300 text-sm font-medium mb-2">{experience.region}</p>
                <p className="text-gray-300 text-sm mb-4">{experience.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[var(--color-brand-gold)]">${experience.price}</span>
                    <p className="text-xs text-gray-400">per experience</p>
                  </div>
                  <button 
                    onClick={() => handleBooking(experience)}
                    className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-2 rounded-lg font-bold hover:brightness-95 transition-all transform hover:scale-105"
                  >
                    Book Tour
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-red-900/20 to-purple-900/20 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30">
          <h3 className="text-2xl font-bold text-center text-white mb-8">Experience Includes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Private Tours</h4>
              <p className="text-gray-300 text-sm">Exclusive access to historic cellars and vineyards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Rare Vintages</h4>
              <p className="text-gray-300 text-sm">Taste exclusive wines not available to public</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Expert Sommelier</h4>
              <p className="text-gray-300 text-sm">Professional wine education and pairing guidance</p>
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