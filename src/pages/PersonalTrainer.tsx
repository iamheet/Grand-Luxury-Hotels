import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PersonalTrainer() {
  const navigate = useNavigate()

  const trainers = [
    { id: 1, name: 'Elite Strength Training', description: 'High-intensity strength and conditioning with Olympic-level trainers', price: 300, duration: '90 minutes', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
    { id: 2, name: 'Luxury Yoga & Pilates', description: 'Private yoga and pilates sessions in premium studio settings', price: 250, duration: '75 minutes', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400' },
    { id: 3, name: 'Executive Fitness Program', description: 'Efficient workouts designed for busy professionals', price: 200, duration: '45 minutes', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
    { id: 4, name: 'Athletic Performance Coaching', description: 'Sport-specific training with former professional athletes', price: 400, duration: '2 hours', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
    { id: 5, name: 'Wellness & Recovery Sessions', description: 'Holistic approach combining fitness with recovery and wellness', price: 350, duration: '2 hours', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
    { id: 6, name: 'Celebrity Trainer Experience', description: 'Train with A-list celebrity personal trainers', price: 500, duration: '90 minutes', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }
  ]

  const handleBooking = (trainer: any) => {
    const fitness = {
      id: `fitness-${trainer.id}`,
      name: trainer.name,
      fitness: trainer,
      type: 'fitness'
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(JSON.parse(localStorage.getItem('member') || '{}')))
    navigate('/member-checkout', { state: { room: fitness } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-brand-navy)] to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">💪 Personal Trainer & Fitness</h1>
          <p className="text-gray-300 text-lg">Elite fitness coaching with world-class personal trainers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="relative">
                <img src={trainer.image} alt={trainer.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-3 py-1 rounded-full text-sm font-bold">
                  {trainer.duration}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{trainer.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{trainer.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[var(--color-brand-gold)]">${trainer.price}</span>
                    <p className="text-xs text-gray-400">per session</p>
                  </div>
                  <button 
                    onClick={() => handleBooking(trainer)}
                    className="bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-6 py-2 rounded-lg font-bold hover:brightness-95 transition-all"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/royal-concierge')}
            className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            ← Back to Concierge
          </button>
        </div>
      </div>
    </div>
  )
}