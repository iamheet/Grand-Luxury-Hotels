import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MemberDashboard() {
  const [member, setMember] = useState<any>(null)
  const [showHotels, setShowHotels] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const [showRoomSelection, setShowRoomSelection] = useState(false)
  const navigate = useNavigate()

  const exclusiveHotels = [
    { id: 'exc-1', name: 'Grand Palace Resort', location: 'Maldives', price: 850, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', rating: 4.9, exclusive: true },
    { id: 'exc-2', name: 'Royal Mountain Lodge', location: 'Swiss Alps', price: 720, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', rating: 4.8, exclusive: true },
    { id: 'exc-3', name: 'Ocean View Villa', location: 'Santorini', price: 650, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', rating: 4.7, exclusive: true },
    { id: 'exc-4', name: 'Desert Oasis Hotel', location: 'Dubai', price: 580, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', rating: 4.6, exclusive: true },
    { id: 'exc-5', name: 'Platinum Sky Resort', location: 'Bora Bora', price: 950, image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', rating: 5.0, exclusive: true },
    { id: 'exc-6', name: 'Crystal Bay Sanctuary', location: 'Seychelles', price: 780, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', rating: 4.9, exclusive: true },
    { id: 'exc-7', name: 'Aurora Ice Hotel', location: 'Iceland', price: 680, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', rating: 4.8, exclusive: true },
    { id: 'exc-8', name: 'Emerald Forest Lodge', location: 'Costa Rica', price: 620, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', rating: 4.7, exclusive: true }
  ]

  const regularHotels = [
    { id: 'paris-1', name: 'Hôtel Étoile Royale', location: 'Paris', price: 520, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
    { id: 'paris-2', name: 'Le Jardin Suites', location: 'Paris', price: 360, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/549415122.jpg?k=6aa38e1d6d970b5756c6e0bd4297a603ce8618ffec17a5e8c2332ac20ab1bc2e&o=', rating: 4, exclusive: false },
    { id: 'paris-3', name: 'Montmartre Inn', location: 'Paris', price: 180, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/269945146.jpg?k=705f092a0e86ab775de93f8e2013b12ae5981739f5a513bcecead2c0db4e109d&o=', rating: 3, exclusive: false },
    { id: 'nyc-1', name: 'The Skyline Tower', location: 'New York', price: 480, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763346606.jpg?k=6ec8469c977fbd5e6867bd1da4f454db5914ccf5c962cd9b9ae74a5c2c766ca4&o=', rating: 5, exclusive: false },
    { id: 'nyc-2', name: 'Central Grand', location: 'New York', price: 340, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/674961168.jpg?k=478bea50dd93b61a34be446f180c1b079e08ed9ce425d2680b87f91afea36272&o=', rating: 4, exclusive: false },
    { id: 'nyc-3', name: 'Hudson Pods', location: 'New York', price: 150, image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false },
    { id: 'tokyo-1', name: 'Shinjuku Imperial', location: 'Tokyo', price: 450, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/677082763.jpg?k=1e0efd2d22e212697c98ff09502775672c39f4b38dc54b729c3a76f800173d12&o=', rating: 5, exclusive: false },
    { id: 'tokyo-2', name: 'Ginza Artisan Hotel', location: 'Tokyo', price: 310, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/622864288.jpg?k=6709fc69eab0ae881792007d3d099fb03e92be6f6a925e19dce4f212b0664971&o=', rating: 4, exclusive: false },
    { id: 'tokyo-3', name: 'Asakusa Capsule', location: 'Tokyo', price: 90, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/488327823.jpg?k=ff6638640efe474a5079fc280b26ba9e3ea4e1a4cfc0dbfaef69d29b3d3cb821&o=', rating: 3, exclusive: false },
    { id: 'dubai-1', name: 'Palm Marina Resort', location: 'Dubai', price: 530, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/727476358.jpg?k=aec126bb04f23b6b833361fd74d87bd9512216d5bc27827f96554dbe59602a31&o=', rating: 5, exclusive: false },
    { id: 'dubai-2', name: 'Desert Pearl', location: 'Dubai', price: 330, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/598095554.jpg?k=a6feffaab51bf2d7bdbdb6eb5ea1ef8f9e7800524f7f7cfc093519c50f28fd48&o=', rating: 4, exclusive: false },
    { id: 'dubai-3', name: 'Old Town Lodge', location: 'Dubai', price: 160, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/567316864.jpg?k=5a093e3d899bc5afd867cd1db35ee8eeb8c7ececdf92067eeb7ee0981fb4bbd0&o=', rating: 3, exclusive: false },
    { id: 'rome-1', name: 'Palazzo Aurelia', location: 'Rome', price: 400, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=400&auto=format&fit=crop', rating: 5, exclusive: false },
    { id: 'rome-2', name: 'Via Condotti House', location: 'Rome', price: 290, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/435714928.jpg?k=bbf01bc66b9366bb644a3910b74e29a7da359a2c70f450de03bc37275d91c005&o=', rating: 4, exclusive: false },
    { id: 'rome-3', name: 'Trastevere Rooms', location: 'Rome', price: 140, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false },
    { id: 'sg-1', name: 'The Fullerton Hotel', location: 'Singapore', price: 470, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/106988145.jpg?k=4dc750be5829df9afb3485ee7555b8d4697c151d3a403062908c4a5a1fd87112&o=', rating: 5, exclusive: false },
    { id: 'sg-2', name: 'Orchard Grove', location: 'Singapore', price: 320, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/721154462.jpg?k=12932700b7c14aaeb157ec0bf77bbb0cf9cfac9f88c4fdb93100a16b91b31196&o=', rating: 4, exclusive: false },
    { id: 'sg-3', name: 'Bugis Budget Inn', location: 'Singapore', price: 120, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false },
    { id: 'my-1', name: 'Kuala Vista Residences', location: 'Malaysia', price: 380, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/624148627.jpg?k=f1f6ef6b9ef5a4a1a952ad5d47ad8bfdf0e2dba2c286e028bc1b628968fd6e5c&o=', rating: 5, exclusive: false },
    { id: 'my-2', name: 'Penang Heritage Hotel', location: 'Malaysia', price: 220, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/326893205.jpg?k=977021538d51e8e7d1ee65fd16d26db58547c263f681d78ad6f3f8bb41837865&o=', rating: 4, exclusive: false },
    { id: 'bkk-1', name: 'Chao Phraya Riverside', location: 'Bangkok', price: 390, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/593370627.jpg?k=c91650aace08fef98582558db6adb9a1332327278c3727ee89b59fa41cb4dde5&o=', rating: 5, exclusive: false },
    { id: 'bkk-2', name: 'Sukhumvit Urban Hotel', location: 'Bangkok', price: 240, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/555924063.jpg?k=6b3a9b6d6c3f1d5e2a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f&o=', rating: 4, exclusive: false },
    { id: 'bkk-3', name: 'Old Town Guesthouse', location: 'Bangkok', price: 120, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop', rating: 3, exclusive: false },
    { id: 'seoul-1', name: 'Gangnam Heights', location: 'Seoul', price: 410, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/225664341.jpg?k=0f8d1d1cce6e784a6c9589e46a112f9f2193c96867c2e44dcac670ccd7b7d6c2&o=', rating: 5, exclusive: false },
    { id: 'seoul-2', name: 'Myeongdong Boutique', location: 'Seoul', price: 260, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/763709548.jpg?k=8f4711a661ffe9156cc27298b7972526f7c2638ec9aab6d4cbc5a2c9fd6390c2&o=', rating: 4, exclusive: false },
    { id: 'seoul-3', name: 'Hanok House', location: 'Seoul', price: 130, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/409143054.jpg?k=2e65ea2a4bd321768e91741df75162d8ae60256c808a36fd1521c53ebe79ab89&o=', rating: 3, exclusive: false }
  ]

  const allHotels = [...exclusiveHotels, ...regularHotels]

  useEffect(() => {
    const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
    if (!memberData) {
      navigate('/member-login')
    } else {
      const parsedMember = JSON.parse(memberData)
      setMember(parsedMember)
      // Ensure both keys are set
      localStorage.setItem('member', JSON.stringify(parsedMember))
      localStorage.setItem('memberCheckout', JSON.stringify(parsedMember))
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('member')
    navigate('/')
  }

  const handleBookHotel = (hotel: any) => {
    setSelectedHotel(hotel)
    setShowRoomSelection(true)
  }

  const handleRoomSelect = (roomType: string, basePrice: number) => {
    const memberDiscount = member?.tier === 'Platinum' ? 25 : member?.tier === 'Gold' ? 15 : member?.tier === 'Silver' ? 10 : member?.tier === 'Diamond' ? 35 : 5
    const discountedPrice = Math.round(basePrice * (1 - memberDiscount / 100))
    
    const room = {
      id: `${selectedHotel.id}-${roomType.toLowerCase().replace(' ', '-')}`,
      name: `${selectedHotel.name} - ${roomType}`,
      title: `${selectedHotel.name} - ${roomType}`,
      image: selectedHotel.image,
      price: discountedPrice,
      features: [`${selectedHotel.location}`, `${selectedHotel.rating} stars`, `${memberDiscount}% member discount`],
      originalPrice: basePrice,
      memberDiscount: memberDiscount
    }
    
    localStorage.setItem('memberCheckout', JSON.stringify(member))
    
    // Use luxury checkout for exclusive hotels, regular checkout for others
    if (selectedHotel.exclusive) {
      navigate('/member-checkout', { state: { room } })
    } else {
      navigate('/checkout', { state: { room } })
    }
  }

  const getRoomOptions = (hotel: any) => {
    const basePrice = hotel.price
    return [
      { type: 'Standard Room', price: basePrice, features: ['1 Queen Bed', 'City View', 'Free WiFi', '25 sqm'] },
      { type: 'Deluxe Room', price: Math.round(basePrice * 1.3), features: ['1 King Bed', 'Partial Ocean View', 'Free WiFi', 'Mini Bar', '35 sqm'] },
      { type: 'Suite', price: Math.round(basePrice * 1.8), features: ['1 King Bed + Sofa', 'Ocean View', 'Free WiFi', 'Mini Bar', 'Balcony', '50 sqm'] },
      { type: 'Presidential Suite', price: Math.round(basePrice * 2.5), features: ['2 Bedrooms', 'Panoramic View', 'Free WiFi', 'Full Kitchen', 'Private Terrace', '80 sqm'] }
    ]
  }

  if (!member) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] pt-20 relative overflow-hidden">
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Royal Header */}
        <div className="bg-gradient-to-r from-slate-900/90 via-[var(--color-brand-navy)]/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 text-white mb-8 border border-[var(--color-brand-gold)]/20 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center shadow-2xl">
                  <svg className="w-10 h-10 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent mb-1">Welcome back, {member.name}!</h1>
                <p className="text-gray-300 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-3 py-1 rounded-full text-sm font-semibold">{member.tier}</span>
                  <span>•</span>
                  <span>ID: {member.membershipId}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 text-red-300 hover:text-red-200 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Royal Member Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-900/40 to-green-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-lg">Priority Booking</h3>
            </div>
            <p className="text-gray-300">Get first access to premium rooms and exclusive dates with royal treatment</p>
          </div>

          <div className="bg-gradient-to-br from-[var(--color-brand-gold)]/20 to-yellow-600/20 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-[var(--color-brand-gold)]/30 hover:border-[var(--color-brand-gold)]/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-[var(--color-brand-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-lg">{member?.tier === 'Diamond' ? '35%' : member?.tier === 'Platinum' ? '25%' : member?.tier === 'Gold' ? '15%' : member?.tier === 'Silver' ? '10%' : '5%'} Discount</h3>
            </div>
            <p className="text-gray-300">Exclusive member pricing on all luxury bookings worldwide</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-lg">Royal Concierge</h3>
            </div>
            <p className="text-gray-300">24/7 dedicated personal assistant for all your luxury needs</p>
          </div>
        </div>

        {/* Royal Member Services */}
        <div className="bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[var(--color-brand-gold)]/20">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent mb-8 text-center">Royal Member Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button 
              onClick={() => setShowHotels(!showHotels)}
              className="group p-8 bg-gradient-to-br from-[var(--color-brand-navy)]/80 to-blue-900/80 backdrop-blur-sm text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-blue-500/30 hover:border-blue-400/50"
            >
              <div className="relative">
                <svg className="w-10 h-10 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                </svg>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-bold mb-2 text-lg">Book Luxury</h3>
              <p className="text-sm text-blue-200">Exclusive reservations</p>
            </button>

            <button 
              onClick={() => navigate('/my-bookings')}
              className="group p-8 bg-gradient-to-br from-[var(--color-brand-gold)]/20 to-yellow-600/20 backdrop-blur-sm text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-[var(--color-brand-gold)]/30 hover:border-[var(--color-brand-gold)]/50">
              <div className="relative">
                <svg className="w-10 h-10 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full animate-pulse delay-200"></div>
              </div>
              <h3 className="font-bold mb-2 text-lg text-[var(--color-brand-gold)]">My Bookings</h3>
              <p className="text-sm text-gray-300">View & manage reservations</p>
            </button>

            <button 
              onClick={() => navigate('/royal-concierge')}
              className="group p-8 bg-gradient-to-br from-emerald-900/40 to-green-800/40 backdrop-blur-sm text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-emerald-500/30 hover:border-emerald-400/50">
              <div className="relative">
                <svg className="w-10 h-10 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse delay-400"></div>
              </div>
              <h3 className="font-bold mb-2 text-lg">Royal Concierge</h3>
              <p className="text-sm text-emerald-200">24/7 luxury services</p>
            </button>

            <button className="group p-8 bg-gradient-to-br from-purple-900/40 to-indigo-800/40 backdrop-blur-sm text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-purple-500/30 hover:border-purple-400/50">
              <div className="relative">
                <svg className="w-10 h-10 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full animate-pulse delay-600"></div>
              </div>
              <h3 className="font-bold mb-2 text-lg">Elite Rewards</h3>
              <p className="text-sm text-purple-200">Luxury points</p>
            </button>
          </div>
        </div>

        {/* Royal Hotels Section */}
        {showHotels && (
          <div className="bg-gradient-to-br from-slate-900/60 to-[var(--color-brand-navy)]/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mt-8 border border-[var(--color-brand-gold)]/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-300 bg-clip-text text-transparent">Royal Hotel Collection</h2>
              <button 
                onClick={() => setShowHotels(false)}
                className="text-gray-400 hover:text-[var(--color-brand-gold)] transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Exclusive Member Hotels */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-4 py-2 rounded-full text-sm font-bold shadow-lg">👑 EXCLUSIVE</span>
                  Royal Member-Only Hotels
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exclusiveHotels.map((hotel) => {
                    const memberDiscount = member?.tier === 'Platinum' ? 25 : member?.tier === 'Gold' ? 15 : member?.tier === 'Silver' ? 10 : member?.tier === 'Diamond' ? 35 : 5
                    const discountedPrice = Math.round(hotel.price * (1 - memberDiscount / 100))
                    
                    return (
                      <div key={hotel.id} className="group bg-gradient-to-br from-[var(--color-brand-gold)]/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-[var(--color-brand-gold)]/30 hover:border-[var(--color-brand-gold)]/60 transform hover:-translate-y-2">
                        <div className="relative overflow-hidden">
                          <img src={hotel.image} alt={hotel.name} className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            👑 ROYAL
                          </div>
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-400 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            {memberDiscount}% OFF
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-white mb-2 text-lg">{hotel.name}</h3>
                          <p className="text-gray-300 text-sm mb-3 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {hotel.location}
                          </p>
                          <div className="flex items-center gap-1 mb-3">
                            {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-sm text-gray-600 ml-1">{hotel.rating}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-[var(--color-brand-navy)]">${discountedPrice}</span>
                              <span className="text-sm text-gray-500 line-through ml-2">${hotel.price}</span>
                              <p className="text-xs text-gray-500">per night</p>
                            </div>
                            <button 
                              onClick={() => handleBookHotel(hotel)}
                              className="bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] px-6 py-3 rounded-xl font-bold hover:brightness-95 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                            >
                              Reserve Now
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Regular Hotels */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">✨ PREMIUM</span>
                  Luxury Hotel Collection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularHotels.map((hotel) => {
                    const memberDiscount = member?.tier === 'Platinum' ? 25 : member?.tier === 'Gold' ? 15 : member?.tier === 'Silver' ? 10 : member?.tier === 'Diamond' ? 35 : 5
                    const discountedPrice = Math.round(hotel.price * (1 - memberDiscount / 100))
                    
                    return (
                      <div key={hotel.id} className="group bg-gradient-to-br from-slate-800/60 to-blue-900/60 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 transform hover:-translate-y-1">
                        <div className="relative overflow-hidden">
                          <img src={hotel.image} alt={hotel.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            {memberDiscount}% OFF
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white mb-1 text-sm">{hotel.name}</h3>
                          <p className="text-gray-300 text-xs mb-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {hotel.location}
                          </p>
                          <div className="flex items-center gap-1 mb-3">
                            {Array.from({ length: Math.floor(hotel.rating) }).map((_, i) => (
                              <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs text-gray-600 ml-1">{hotel.rating}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-bold text-[var(--color-brand-navy)]">${discountedPrice}</span>
                              <span className="text-xs text-gray-500 line-through ml-1">${hotel.price}</span>
                              <p className="text-xs text-gray-500">per night</p>
                            </div>
                            <button 
                              onClick={() => handleBookHotel(hotel)}
                              className="bg-gradient-to-r from-[var(--color-brand-navy)] to-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:brightness-95 transition-all duration-300 transform hover:scale-105 shadow-lg text-xs"
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Room Selection Modal */}
        {showRoomSelection && selectedHotel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Select Room Type</h3>
                  <button 
                    onClick={() => setShowRoomSelection(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900">{selectedHotel.name}</h4>
                  <p className="text-gray-600 text-sm">{selectedHotel.location}</p>
                </div>
                
                <div className="space-y-4">
                  {getRoomOptions(selectedHotel).map((room, index) => {
                    const memberDiscount = member?.tier === 'Platinum' ? 25 : member?.tier === 'Gold' ? 15 : member?.tier === 'Silver' ? 10 : member?.tier === 'Diamond' ? 35 : 5
                    const discountedPrice = Math.round(room.price * (1 - memberDiscount / 100))
                    
                    return (
                      <div key={index} className="border rounded-lg p-4 hover:border-[var(--color-brand-gold)] transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-semibold text-gray-900">{room.type}</h5>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {room.features.map((feature, i) => (
                                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{feature}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 line-through">${room.price}</div>
                            <div className="text-lg font-bold text-[var(--color-brand-navy)]">${discountedPrice}</div>
                            <div className="text-xs text-green-600">{memberDiscount}% off</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRoomSelect(room.type, room.price)}
                          className="w-full bg-[var(--color-brand-navy)] text-white py-2 rounded-lg hover:brightness-95 transition"
                        >
                          Select Room
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}