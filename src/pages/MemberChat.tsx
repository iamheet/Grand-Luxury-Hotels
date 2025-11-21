import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MemberChat() {
  const [member, setMember] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const memberData = localStorage.getItem('member') || localStorage.getItem('memberCheckout')
    if (!memberData) {
      navigate('/member-login')
    } else {
      const parsedMember = JSON.parse(memberData)
      setMember(parsedMember)
      
      // Welcome message
      setMessages([{
        id: 1,
        text: `Welcome to Exclusive Member Support, ${parsedMember.name}! I'm your dedicated ${parsedMember.tier} concierge assistant. How may I assist you today?`,
        sender: 'bot',
        timestamp: new Date()
      }])
    }
  }, [navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const memberResponses = {
    'booking': `As a ${member?.tier} member, I can help you with your bookings. You have access to exclusive hotels, private aircraft, luxury cars, and premium travel services. Would you like me to check your current bookings or help you make a new reservation?`,
    'services': `Your ${member?.tier} membership includes: Priority concierge service, exclusive hotel access, private aircraft booking, luxury car rentals, yacht charters, airport VIP services, and custom travel planning. Which service interests you?`,
    'account': `Your ${member?.tier} membership (ID: ${member?.membershipId}) is active with premium benefits. You enjoy ${member?.tier === 'Diamond' ? '35%' : member?.tier === 'Platinum' ? '25%' : member?.tier === 'Gold' ? '15%' : member?.tier === 'Silver' ? '10%' : '5%'} discounts on all services. Is there anything specific about your account you'd like to know?`,
    'upgrade': `As a ${member?.tier} member, you're already enjoying premium benefits! ${member?.tier === 'Diamond' ? 'You have our highest tier with maximum privileges.' : 'Would you like to learn about upgrading to a higher tier for additional exclusive benefits?'}`,
    'concierge': `Your dedicated ${member?.tier} concierge team is available 24/7. We can arrange private jets, luxury accommodations, yacht charters, restaurant reservations, event planning, and any other exclusive experiences. What would you like us to arrange?`,
    'travel': `I can help you plan luxury travel experiences including private jet bookings, exclusive hotel reservations, yacht charters, airport VIP services, and custom itineraries. Where would you like to travel?`,
    'hotels': `You have access to our exclusive member-only hotels with premium amenities. I can check availability, make reservations, or help you modify existing bookings. Which destination interests you?`,
    'aircraft': `Our private aircraft fleet includes luxury jets and helicopters. As a ${member?.tier} member, you get priority booking and exclusive rates. Would you like to book a flight or learn about our aircraft options?`,
    'cars': `Our luxury car rental service features premium vehicles including Rolls-Royce, Bentley, Mercedes, Lamborghini, and more. All rentals include chauffeur service. Which type of vehicle do you need?`,
    'help': `I'm here to assist with all your luxury travel needs. I can help with bookings, account information, service inquiries, travel planning, or connect you with your personal concierge. What do you need help with?`
  }

  const getResponse = (message: string) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
      return memberResponses.booking
    } else if (lowerMessage.includes('service') || lowerMessage.includes('benefit')) {
      return memberResponses.services
    } else if (lowerMessage.includes('account') || lowerMessage.includes('membership')) {
      return memberResponses.account
    } else if (lowerMessage.includes('upgrade') || lowerMessage.includes('tier')) {
      return memberResponses.upgrade
    } else if (lowerMessage.includes('concierge') || lowerMessage.includes('assistant')) {
      return memberResponses.concierge
    } else if (lowerMessage.includes('travel') || lowerMessage.includes('trip')) {
      return memberResponses.travel
    } else if (lowerMessage.includes('hotel') || lowerMessage.includes('room')) {
      return memberResponses.hotels
    } else if (lowerMessage.includes('aircraft') || lowerMessage.includes('jet') || lowerMessage.includes('helicopter')) {
      return memberResponses.aircraft
    } else if (lowerMessage.includes('car') || lowerMessage.includes('vehicle') || lowerMessage.includes('chauffeur')) {
      return memberResponses.cars
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return memberResponses.help
    } else {
      return `Thank you for your message. As your ${member?.tier} concierge assistant, I'm here to help with all luxury services. You can ask me about bookings, travel planning, exclusive services, or your membership benefits. How may I assist you further?`
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  if (!member) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--color-brand-navy)] pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-brand-gold)]/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-400/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-[var(--color-brand-gold)]/3 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
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
              💬 Exclusive Member Chat
            </h1>
            <p className="text-gray-300">Your dedicated {member.tier} concierge assistant</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Chat Container */}
        <div className="relative bg-gradient-to-br from-slate-900/90 to-[var(--color-brand-navy)]/90 backdrop-blur-2xl rounded-3xl border-2 border-[var(--color-brand-gold)]/40 overflow-hidden shadow-2xl">
          {/* Animated Luxury Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-gold)]/20 via-yellow-400/10 to-[var(--color-brand-gold)]/20 rounded-3xl animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--color-brand-gold)]/5 to-transparent rounded-3xl"></div>
          
          {/* Royal Crown Pattern */}
          <div className="absolute top-4 right-4 text-[var(--color-brand-gold)]/20 text-6xl animate-pulse">
            👑
          </div>
          
          {/* Chat Header */}
          <div className="relative bg-gradient-to-r from-[var(--color-brand-gold)]/40 via-yellow-500/30 to-[var(--color-brand-gold)]/40 p-8 border-b-2 border-[var(--color-brand-gold)]/50">
            {/* Header Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-brand-gold)]/10 to-transparent animate-pulse"></div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="relative">
                {/* Animated Ring */}
                <div className="absolute inset-0 w-20 h-20 border-2 border-[var(--color-brand-gold)]/50 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-brand-gold)] via-yellow-400 to-[var(--color-brand-gold)] rounded-full flex items-center justify-center shadow-2xl border-2 border-yellow-300/50 relative z-10">
                  <div className="text-2xl animate-pulse">👑</div>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white animate-bounce shadow-lg">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-green-300 to-emerald-300 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-bold text-2xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {member.tier} Royal Concierge
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-4 py-1 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 text-[var(--color-brand-navy)] rounded-full text-xs font-bold shadow-lg animate-pulse">
                      EXCLUSIVE
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-bold">
                      AI POWERED
                    </span>
                  </div>
                </div>
                <p className="text-[var(--color-brand-gold)] text-sm flex items-center gap-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg"></span>
                  <span className="font-medium">Online & Ready</span>
                  <span className="text-white/70">•</span>
                  <span className="text-white/90">Dedicated to {member.name}</span>
                </p>
              </div>
              
              <div className="text-right bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-2xl border border-[var(--color-brand-gold)]/30 backdrop-blur-sm">
                <p className="text-white/70 text-xs font-medium mb-1">MEMBER PROFILE</p>
                <p className="text-[var(--color-brand-gold)] font-mono text-sm font-bold">{member.membershipId}</p>
                <p className="text-white/60 text-xs mt-1">{member.tier} Tier</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-transparent via-black/5 to-black/20 relative">
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-1 h-1 bg-[var(--color-brand-gold)] rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
              <div className="absolute top-20 right-20 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-[var(--color-brand-gold)] rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            </div>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md relative ${
                  message.sender === 'user' ? 'ml-12' : 'mr-12'
                }`}>
                  {message.sender === 'bot' && (
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-[var(--color-brand-gold)] text-xs font-medium">{member.tier} Assistant</span>
                    </div>
                  )}
                  <div className={`px-6 py-4 rounded-2xl shadow-2xl relative overflow-hidden ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-br from-[var(--color-brand-gold)] via-yellow-400 to-[var(--color-brand-gold)] text-[var(--color-brand-navy)] border-2 border-yellow-300/70 shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
                      : 'bg-gradient-to-br from-white/20 to-white/5 text-white border-2 border-white/30 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  }`}>
                    {/* Message Glow Effect */}
                    <div className={`absolute inset-0 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-yellow-300/20 via-transparent to-yellow-300/20'
                        : 'bg-gradient-to-r from-white/10 via-transparent to-white/10'
                    } animate-pulse`}></div>
                    <p className="text-sm leading-relaxed relative z-10 font-medium">{message.text}</p>
                    <p className={`text-xs mt-2 flex items-center gap-1 ${
                      message.sender === 'user' ? 'text-[var(--color-brand-navy)]/70 justify-end' : 'text-gray-400'
                    }`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mr-12">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="bg-gradient-to-br from-white/15 to-white/5 text-white px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <div className="flex items-center gap-1 text-[var(--color-brand-gold)] text-xs mb-2">
                      <span>Assistant is typing</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[var(--color-brand-gold)] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[var(--color-brand-gold)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[var(--color-brand-gold)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="relative p-8 border-t-2 border-[var(--color-brand-gold)]/40 bg-gradient-to-r from-black/30 via-black/20 to-black/30">
            {/* Input Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-gold)]/5 via-transparent to-[var(--color-brand-gold)]/5 animate-pulse"></div>
            
            <div className="flex gap-6 relative z-10">
              <div className="flex-1 relative group">
                {/* Input Field Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-gold)]/20 to-yellow-400/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="👑 Share your royal request..."
                  className="w-full px-8 py-5 bg-gradient-to-r from-white/15 to-white/10 border-2 border-[var(--color-brand-gold)]/40 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-gold)]/30 focus:border-[var(--color-brand-gold)] backdrop-blur-xl transition-all duration-300 font-medium shadow-2xl relative z-10"
                />
                
                {/* Animated Input Icon */}
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-[var(--color-brand-gold)] animate-pulse">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              
              <button
                onClick={handleSendMessage}
                className="relative bg-gradient-to-br from-[var(--color-brand-gold)] via-yellow-400 to-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-10 py-5 rounded-2xl font-bold transition-all transform hover:scale-110 shadow-2xl border-2 border-yellow-300/70 group overflow-hidden"
              >
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 via-transparent to-yellow-300/30 animate-pulse"></div>
                
                <div className="relative z-10">
                  <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <div className="text-center mb-6">
            <h3 className="text-white/90 text-lg font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              ✨ Royal Quick Actions ✨
            </h3>
            <p className="text-[var(--color-brand-gold)]/70 text-sm">Instant access to premium services</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { text: 'My Bookings', icon: '📋', gradient: 'from-blue-500 to-purple-600' },
              { text: 'New Reservation', icon: '🏨', gradient: 'from-emerald-500 to-teal-600' },
              { text: 'Travel Planning', icon: '✈️', gradient: 'from-orange-500 to-red-600' },
              { text: 'Account Info', icon: '👑', gradient: 'from-[var(--color-brand-gold)] to-yellow-500' }
            ].map((action, index) => (
              <button
                key={action.text}
                onClick={() => {
                  const userMessage = {
                    id: messages.length + 1,
                    text: action.text,
                    sender: 'user',
                    timestamp: new Date()
                  }
                  setMessages(prev => [...prev, userMessage])
                  setIsTyping(true)
                  setTimeout(() => {
                    const botResponse = {
                      id: messages.length + 2,
                      text: getResponse(action.text),
                      sender: 'bot',
                      timestamp: new Date()
                    }
                    setMessages(prev => [...prev, botResponse])
                    setIsTyping(false)
                  }, 1500)
                }}
                className="relative bg-gradient-to-br from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 text-white p-6 rounded-3xl text-sm font-medium transition-all transform hover:scale-110 hover:-translate-y-2 border-2 border-white/20 hover:border-[var(--color-brand-gold)]/50 backdrop-blur-xl group shadow-2xl overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Action Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl`}></div>
                
                {/* Floating Icon */}
                <div className="text-3xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative z-10">
                  {action.icon}
                </div>
                
                {/* Action Text */}
                <div className="group-hover:text-[var(--color-brand-gold)] transition-colors duration-300 font-semibold relative z-10">
                  {action.text}
                </div>
                
                {/* Sparkle Effect */}
                <div className="absolute top-2 right-2 text-[var(--color-brand-gold)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse">
                  ✨
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}