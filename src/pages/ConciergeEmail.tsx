import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ConciergeEmail() {
  const [member, setMember] = useState<any>(null)
  const [formData, setFormData] = useState({
    requestType: '',
    subject: '',
    details: '',
    preferredDate: '',
    preferredTime: '',
    budget: '',
    urgency: 'normal'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
    if (!memberData) {
      navigate('/member-login')
    } else {
      setMember(JSON.parse(memberData))
    }
  }, [navigate])

  const requestTypes = [
    { value: 'private-jet', label: '✈️ Private Jet Booking', description: 'Luxury aircraft reservations' },
    { value: 'restaurant', label: '🍽️ Restaurant Reservations', description: 'Exclusive dining experiences' },
    { value: 'event-planning', label: '🎉 Event Planning', description: 'Special occasions & celebrations' },
    { value: 'yacht-charter', label: '🛥️ Yacht Charter', description: 'Private yacht experiences' },
    { value: 'airport-vip', label: '🛫 Airport VIP Services', description: 'Premium airport experiences' },
    { value: 'entertainment', label: '🎭 Entertainment Booking', description: 'Shows, concerts & experiences' },
    { value: 'transportation', label: '🚗 Luxury Transportation', description: 'Chauffeur & premium vehicles' },
    { value: 'shopping', label: '🛍️ Personal Shopping', description: 'Exclusive shopping experiences' },
    { value: 'other', label: '👑 Other Royal Request', description: 'Custom luxury services' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    setTimeout(() => {
      const request = {
        id: Date.now(),
        ...formData,
        member: member,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        estimatedResponse: '2-4 hours'
      }
      
      const existingRequests = JSON.parse(localStorage.getItem('conciergeRequests') || '[]')
      localStorage.setItem('conciergeRequests', JSON.stringify([request, ...existingRequests]))
      
      setIsSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  if (!member) return null

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] pt-20">
        <div className="max-w-2xl mx-auto px-6 py-12 text-center">
          <div className="bg-gradient-to-br from-slate-900/90 to-[var(--color-brand-navy)]/90 backdrop-blur-2xl rounded-3xl border-2 border-[var(--color-brand-gold)]/40 p-12">
            <div className="text-6xl mb-6">👑</div>
            <h1 className="text-3xl font-bold text-[var(--color-brand-gold)] mb-4">Request Submitted Successfully!</h1>
            <p className="text-white/80 mb-6">Your royal concierge team will respond within 2-4 hours with personalized recommendations and arrangements.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/royal-concierge')}
                className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-3 rounded-lg font-semibold hover:brightness-95 transition-all"
              >
                Back to Concierge
              </button>
              <button
                onClick={() => navigate('/member-dashboard')}
                className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all"
              >
                Member Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/royal-concierge')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Concierge
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent mb-2">
              📧 Royal Concierge Request
            </h1>
            <p className="text-gray-300">Exclusive {member.tier} Member Services</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Form */}
        <div className="bg-gradient-to-br from-slate-900/90 to-[var(--color-brand-navy)]/90 backdrop-blur-2xl rounded-3xl border-2 border-[var(--color-brand-gold)]/40 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Request Type */}
            <div>
              <label className="block text-white font-semibold mb-4">Service Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requestTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({...formData, requestType: type.value})}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.requestType === type.value
                        ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/20'
                        : 'border-white/20 bg-white/10 hover:border-[var(--color-brand-gold)]/50'
                    }`}
                  >
                    <div className="text-white font-medium mb-1">{type.label}</div>
                    <div className="text-gray-400 text-sm">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-white font-semibold mb-2">Request Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Brief description of your request..."
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[var(--color-brand-gold)]"
                required
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-white font-semibold mb-2">Detailed Requirements</label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                placeholder="Please provide specific details about your request, preferences, special requirements, number of guests, etc..."
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[var(--color-brand-gold)] resize-none"
                required
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Preferred Date</label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Preferred Time</label>
                <input
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                />
              </div>
            </div>

            {/* Budget & Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Budget Range (Optional)</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                >
                  <option value="" className="bg-slate-800 text-white">No specific budget</option>
                  <option value="under-5k" className="bg-slate-800 text-white">Under $5,000</option>
                  <option value="5k-15k" className="bg-slate-800 text-white">$5,000 - $15,000</option>
                  <option value="15k-50k" className="bg-slate-800 text-white">$15,000 - $50,000</option>
                  <option value="50k-plus" className="bg-slate-800 text-white">$50,000+</option>
                  <option value="unlimited" className="bg-slate-800 text-white">Unlimited Budget</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Urgency Level</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                >
                  <option value="normal" className="bg-slate-800 text-white">Normal (2-4 hours)</option>
                  <option value="high" className="bg-slate-800 text-white">High Priority (1-2 hours)</option>
                  <option value="urgent" className="bg-slate-800 text-white">Urgent (Within 1 hour)</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !formData.requestType || !formData.subject || !formData.details}
                className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-12 py-4 rounded-xl font-bold text-lg hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[var(--color-brand-navy)]/30 border-t-[var(--color-brand-navy)] rounded-full animate-spin"></div>
                    Submitting Request...
                  </div>
                ) : (
                  '👑 Submit Royal Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}