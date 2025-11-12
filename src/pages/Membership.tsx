import { useState } from 'react'

const membershipTiers = [
  {
    name: 'Bronze',
    price: '$49',
    period: '/year',
    color: 'from-amber-600 to-amber-800',
    borderColor: 'border-amber-600',
    shadowColor: 'shadow-amber-600/20',
    icon: '🥉',
    benefits: ['3% discount on bookings', 'Basic customer support', 'Free Wi-Fi', 'Standard amenities']
  },
  {
    name: 'Silver',
    price: '$99',
    period: '/year',
    color: 'from-gray-400 to-gray-600',
    borderColor: 'border-gray-400',
    shadowColor: 'shadow-gray-400/20',
    icon: '🥈',
    benefits: ['5% discount on bookings', 'Priority customer support', 'Free Wi-Fi', 'Late checkout until 2 PM']
  },
  {
    name: 'Gold',
    price: '$299',
    period: '/year',
    color: 'from-yellow-400 to-yellow-600',
    borderColor: 'border-yellow-400',
    shadowColor: 'shadow-yellow-400/20',
    icon: '🥇',
    benefits: ['15% discount on bookings', '24/7 concierge service', 'Complimentary breakfast', 'Room upgrades (subject to availability)', 'Airport transfer']
  },
  {
    name: 'Platinum',
    price: '$599',
    period: '/year',
    color: 'from-slate-300 to-slate-500',
    borderColor: 'border-slate-300',
    shadowColor: 'shadow-slate-300/20',
    icon: '💎',
    benefits: ['25% discount on bookings', 'Personal butler service', 'Premium suite access', 'Spa credits ($200/month)', 'Private dining', 'Helicopter transfers']
  },
  {
    name: 'Diamond',
    price: '$1,299',
    period: '/year',
    color: 'from-pink-400 via-pink-500 to-rose-500',
    borderColor: 'border-pink-400',
    shadowColor: 'shadow-pink-400/20',
    icon: '💍',
    benefits: ['35% discount on bookings', 'Dedicated lifestyle manager', 'Presidential suite access', 'Unlimited spa services', 'Private jet coordination', 'Yacht charter access', 'Michelin star dining']
  }
]

export default function Membership() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Exclusive Membership Tiers
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Elevate your luxury travel experience with our premium membership programs. 
            Each tier unlocks extraordinary benefits and personalized services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {membershipTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                selectedTier === tier.name ? 'scale-105' : ''
              }`}
              onClick={() => setSelectedTier(selectedTier === tier.name ? null : tier.name)}
            >
              <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${tier.color} shadow-2xl ${tier.shadowColor} border-2 ${tier.borderColor} backdrop-blur-sm`}>
                <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">{tier.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-bold text-white">{tier.price}</span>
                      <span className="text-sm text-white/80 ml-1">{tier.period}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-white/90">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3 px-6 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-white transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50">
                    Select {tier.name}
                  </button>
                </div>

                {selectedTier === tier.name && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-2xl blur-sm opacity-75 animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedTier && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-yellow-400/10 via-pink-400/10 to-purple-400/10 rounded-2xl p-8 border border-yellow-400/20">
              <h3 className="text-2xl font-bold mb-4">Ready to join {selectedTier} Membership?</h3>
              <p className="text-gray-300 mb-6">Experience luxury like never before with exclusive benefits and personalized service.</p>
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-black font-bold rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}