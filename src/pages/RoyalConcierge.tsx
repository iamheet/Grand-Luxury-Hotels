import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RoyalConcierge() {
  const [member, setMember] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
    if (!memberData) {
      navigate('/member-login')
    } else {
      const parsedMember = JSON.parse(memberData)
      setMember(parsedMember)
    }
  }, [navigate])

  if (!member) return null

  const conciergeServices = [
    {
      category: "Travel & Transportation",
      icon: "✈️",
      services: [
        { name: "Private jet and helicopter arrangements", desc: "Book luxury aircraft for seamless travel worldwide" },
        { name: "Luxury car rentals and chauffeur services", desc: "Premium vehicles with professional drivers available 24/7" },
        { name: "Airport VIP lounge access and fast-track", desc: "Skip lines and enjoy exclusive airport amenities" },
        { name: "Yacht and private boat charters", desc: "Exclusive maritime experiences and coastal adventures" },
        { name: "Custom travel itinerary planning", desc: "Personalized journeys crafted to your preferences" }
      ]
    },
    {
      category: "Dining & Entertainment",
      icon: "🍾",
      services: [
        { name: "Exclusive restaurant reservations", desc: "Access to the world's most sought-after dining venues" },
        { name: "Private chef and catering services", desc: "Michelin-starred chefs for intimate dining experiences" },
        { name: "Wine cellar tours and tastings", desc: "Curated experiences at prestigious wineries and cellars" },
        { name: "Theater and concert ticket procurement", desc: "Premium seats to sold-out shows and exclusive events" },
        { name: "Private event planning and coordination", desc: "Bespoke celebrations and gatherings tailored to perfection" }
      ]
    },
    {
      category: "Wellness & Lifestyle",
      icon: "💎",
      services: [
        { name: "Spa and wellness retreat bookings", desc: "Rejuvenating experiences at world-class wellness destinations" },
        { name: "Personal trainer and fitness coaching", desc: "Elite fitness professionals for personalized health goals" },
        { name: "Medical appointments with specialists", desc: "Priority access to top medical professionals globally" },
        { name: "Beauty and grooming services", desc: "Premium styling and beauty treatments in your location" },
        { name: "Personal shopping and styling", desc: "Curated fashion and luxury goods sourcing" }
      ]
    },
    {
      category: "Business & Professional",
      icon: "👔",
      services: [
        { name: "Meeting room and conference facilities", desc: "Premium venues equipped with state-of-the-art technology" },
        { name: "Business center and secretarial services", desc: "Professional administrative support for all business needs" },
        { name: "Translation and interpretation services", desc: "Expert linguists for seamless international communication" },
        { name: "Legal and financial consultation referrals", desc: "Connections to top-tier professional advisors worldwide" },
        { name: "Corporate event management", desc: "Sophisticated business gatherings and networking events" }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/member-dashboard')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent mb-2">
              👑 Royal Concierge
            </h1>
            <p className="text-gray-300">Your personal luxury lifestyle assistant</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Member Welcome */}
        <div className="bg-gradient-to-r from-[var(--color-brand-gold)]/20 to-yellow-600/20 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-[var(--color-brand-gold)]/30">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome, {member.name}</h2>
              <p className="text-[var(--color-brand-gold)] font-semibold">{member.tier} Member • ID: {member.membershipId}</p>
              <p className="text-gray-300 mt-2">Your dedicated concierge team is available 24/7 to fulfill your every request</p>
            </div>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-900/40 to-green-800/40 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">Call Concierge</h3>
                <p className="text-emerald-200 text-sm">+1 (800) ROYAL-01</p>
              </div>
            </div>
            <button className="w-full bg-emerald-500 text-white py-2 rounded-lg font-semibold hover:brightness-95 transition-all">
              Call Now
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-800/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">Live Chat</h3>
                <p className="text-blue-200 text-sm">Instant messaging</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/member-chat')}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:brightness-95 transition-all"
            >
              Start Chat
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-pink-800/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">Email Request</h3>
                <p className="text-purple-200 text-sm">Detailed inquiries</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/concierge-email')}
              className="w-full bg-purple-500 text-white py-2 rounded-lg font-semibold hover:brightness-95 transition-all"
            >
              Send Email
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {conciergeServices.map((category, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-3xl p-8 border border-[var(--color-brand-gold)]/20 hover:border-[var(--color-brand-gold)]/40 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{category.icon}</div>
                <h3 className="text-2xl font-bold text-white">{category.category}</h3>
              </div>
              
              <div className="space-y-4">
                {category.services.map((service, serviceIndex) => (
                  <div 
                    key={serviceIndex} 
                    onClick={() => {
                      if (service.name === "Private jet and helicopter arrangements") {
                        navigate('/aircraft-booking')
                      } else if (service.name === "Luxury car rentals and chauffeur services") {
                        navigate('/car-rental')
                      } else if (service.name === "Airport VIP lounge access and fast-track") {
                        navigate('/airport-vip')
                      } else if (service.name === "Yacht and private boat charters") {
                        navigate('/yacht-charter')
                      } else if (service.name === "Custom travel itinerary planning") {
                        navigate('/travel-planning')
                      }
                    }}
                    className="flex items-start gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="w-2 h-2 bg-[var(--color-brand-gold)] rounded-full mt-2 group-hover:scale-150 transition-transform"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium group-hover:text-[var(--color-brand-gold)] transition-colors mb-1">{service.name}</p>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{service.desc}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-brand-gold)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => navigate('/concierge-email')}
                className="w-full mt-6 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] py-3 rounded-xl font-bold hover:brightness-95 transition-all"
              >
                Contact Concierge Team
              </button>
            </div>
          ))}
        </div>

        {/* Premium Features */}
        <div className="mt-12 bg-gradient-to-r from-[var(--color-brand-gold)]/10 to-yellow-600/10 backdrop-blur-xl rounded-3xl p-8 border border-[var(--color-brand-gold)]/30">
          <h3 className="text-2xl font-bold text-center text-white mb-8">Exclusive {member.tier} Member Benefits</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Priority Response</h4>
              <p className="text-gray-300 text-sm">Guaranteed response within 15 minutes, 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">No Request Too Small</h4>
              <p className="text-gray-300 text-sm">From simple tasks to extraordinary experiences</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Personal Touch</h4>
              <p className="text-gray-300 text-sm">Dedicated concierge who knows your preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}