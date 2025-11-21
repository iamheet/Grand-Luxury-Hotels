import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RoyalRewards() {
  const [member, setMember] = useState<any>(null)
  const [points, setPoints] = useState(0)
  const [bookings, setBookings] = useState<any[]>([])
  const [spentPoints, setSpentPoints] = useState(0)
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [rewardedItem, setRewardedItem] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
    if (!memberData) {
      navigate('/member-login')
    } else {
      const parsedMember = JSON.parse(memberData)
      setMember(parsedMember)
      
      // Get bookings and calculate points
      const memberBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
      setBookings(memberBookings)
      
      const basePoints = memberBookings.reduce((sum: number, booking: any) => {
        if (booking.status === 'confirmed') {
          return sum + Math.floor(booking.total / 10) // 1 point per $10 spent
        }
        return sum
      }, 0)
      setPoints(basePoints)
      
      // Load spent points
      const spent = parseInt(localStorage.getItem('spentPoints') || '0')
      setSpentPoints(spent)
    }
  }, [navigate])

  if (!member) return null

  const tierMultiplier = {
    Bronze: 1,
    Silver: 1.2,
    Gold: 1.5,
    Platinum: 2,
    Diamond: 2.5
  }

  const rewards = [
    { points: 500, reward: 'Free Airport VIP Lounge Access', icon: '🛫' },
    { points: 1000, reward: 'Complimentary Room Upgrade', icon: '🏨' },
    { points: 2500, reward: 'Free Yacht Charter (4 hours)', icon: '🛥️' },
    { points: 5000, reward: 'Private Jet Credit ($2,500)', icon: '✈️' },
    { points: 10000, reward: 'Luxury Car Rental (1 week)', icon: '🚗' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] pt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
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
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent">
            👑 Royal Elite Rewards
          </h1>
          
          <div className="w-32"></div>
        </div>

        {/* Points Balance */}
        <div className="bg-gradient-to-r from-[var(--color-brand-gold)]/20 to-yellow-600/20 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-[var(--color-brand-gold)]/30">
          <div className="text-center">
            <div className="text-6xl font-bold text-[var(--color-brand-gold)] mb-2">
              {Math.max(0, bookings.reduce((total, booking) => {
                if (booking.status === 'confirmed' && booking.total && !isNaN(booking.total)) {
                  const basePoints = Math.floor(Number(booking.total) / 10)
                  return total + Math.floor(basePoints * tierMultiplier[member.tier as keyof typeof tierMultiplier])
                }
                return total
              }, 0) - spentPoints)}
            </div>
            <p className="text-white text-xl mb-2">Royal Elite Points</p>
            <p className="text-gray-300">
              {member.tier} Member • {tierMultiplier[member.tier as keyof typeof tierMultiplier]}x Multiplier
            </p>
            <div className="text-gray-400 text-sm mt-2 space-y-1">
              <p>Total Earned: {bookings.reduce((total, booking) => {
                if (booking.status === 'confirmed' && booking.total && !isNaN(booking.total)) {
                  const basePoints = Math.floor(Number(booking.total) / 10)
                  return total + Math.floor(basePoints * tierMultiplier[member.tier as keyof typeof tierMultiplier])
                }
                return total
              }, 0)} pts</p>
              <p>Spent on Rewards: {spentPoints} pts</p>
              <p className="text-[var(--color-brand-gold)]">Available Balance: {Math.max(0, bookings.reduce((total, booking) => {
                if (booking.status === 'confirmed' && booking.total && !isNaN(booking.total)) {
                  const basePoints = Math.floor(Number(booking.total) / 10)
                  return total + Math.floor(basePoints * tierMultiplier[member.tier as keyof typeof tierMultiplier])
                }
                return total
              }, 0) - spentPoints)} pts</p>
            </div>
          </div>
        </div>

        {/* Points Breakdown */}
        <div className="bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">📊 Points Breakdown</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No bookings found. Make your first booking to start earning points!</p>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {[...bookings].reverse().map((booking, index) => {
                const basePoints = Math.floor(Number(booking.total || 0) / 10)
                const multipliedPoints = Math.floor(basePoints * tierMultiplier[member.tier as keyof typeof tierMultiplier])
                return (
                  <div key={index} className={`bg-white/10 rounded-lg p-4 flex justify-between items-center ${
                    booking.status === 'pending' ? 'opacity-60' : ''
                  }`}>
                    <div>
                      <p className="text-white font-medium">
                        {booking.type === 'combined' ? '🎯 Combined Booking' : 
                         booking.type === 'aircraft' ? '✈️ Aircraft' :
                         booking.type === 'car' ? '🚗 Car Rental' :
                         booking.type === 'yacht' ? '🛥️ Yacht Charter' :
                         booking.type === 'airport' ? '🛫 Airport VIP' :
                         booking.type === 'travel' ? '🌍 Travel Service' : '🏨 Hotel'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(booking.bookingDate).toLocaleDateString()} • 
                        <span className={booking.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'}>
                          {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[var(--color-brand-gold)] font-bold">${booking.total}</p>
                      <p className="text-white text-sm">
                        {booking.status === 'confirmed' 
                          ? `${basePoints} × ${tierMultiplier[member.tier as keyof typeof tierMultiplier]} = ${multipliedPoints} pts`
                          : 'Points pending confirmation'
                        }
                      </p>
                    </div>
                  </div>
                )
              })}
              <div className="border-t border-white/20 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-white font-bold text-lg">Total Points Earned:</p>
                  <p className="text-[var(--color-brand-gold)] font-bold text-xl">
                    {Math.max(0, bookings.reduce((total, booking) => {
                      if (booking.status === 'confirmed' && booking.total && !isNaN(booking.total)) {
                        const basePoints = Math.floor(Number(booking.total) / 10)
                        return total + Math.floor(basePoints * tierMultiplier[member.tier as keyof typeof tierMultiplier])
                      }
                      return total
                    }, 0) - spentPoints)} pts
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Available Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, index) => {
            const earnedPoints = bookings.reduce((total, booking) => {
              if (booking.status === 'confirmed' && booking.total && !isNaN(booking.total)) {
                const basePoints = Math.floor(Number(booking.total) / 10)
                return total + Math.floor(basePoints * tierMultiplier[member.tier as keyof typeof tierMultiplier])
              }
              return total
            }, 0)
            const availablePoints = Math.max(0, earnedPoints - spentPoints)
            const canRedeem = availablePoints >= reward.points
            return (
              <div key={index} className={`bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-2xl p-6 border transition-all ${
                canRedeem ? 'border-[var(--color-brand-gold)]/50 hover:border-[var(--color-brand-gold)]' : 'border-white/20'
              }`}>
                <div className="text-4xl mb-4">{reward.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{reward.reward}</h3>
                <p className="text-[var(--color-brand-gold)] font-semibold mb-4">{reward.points} Points</p>
                <button 
                  disabled={!canRedeem}
                  onClick={() => {
                    if (canRedeem) {
                      const newSpentPoints = spentPoints + reward.points
                      setSpentPoints(newSpentPoints)
                      localStorage.setItem('spentPoints', newSpentPoints.toString())
                      setRewardedItem(reward)
                      setShowRewardModal(true)
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    canRedeem 
                      ? 'bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] hover:brightness-95' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canRedeem ? 'Redeem Now' : 'Insufficient Points'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Reward Success Modal */}
        {showRewardModal && rewardedItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-[var(--color-brand-navy)] rounded-3xl p-8 max-w-md w-full border border-[var(--color-brand-gold)]/30 relative overflow-hidden">
              {/* Animated particles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-2 h-2 bg-[var(--color-brand-gold)] rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-[var(--color-brand-gold)] rounded-full animate-ping"></div>
              </div>
              
              <div className="relative text-center">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent mb-4">
                  Reward Redeemed!
                </h2>
                <div className="text-4xl mb-4">{rewardedItem.icon}</div>
                <p className="text-white text-lg mb-2">{rewardedItem.reward}</p>
                <p className="text-[var(--color-brand-gold)] font-semibold mb-6">
                  {rewardedItem.points} points deducted
                </p>
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 mb-6 border border-green-500/30">
                  <p className="text-green-400 font-medium">✨ Your exclusive reward is now active!</p>
                </div>
                <button
                  onClick={() => {
                    setShowRewardModal(false)
                    setRewardedItem(null)
                  }}
                  className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-8 py-3 rounded-xl font-bold hover:brightness-95 transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}