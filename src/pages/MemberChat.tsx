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
    'booking': `I can help you book instantly! Tell me what you need: "Book a car", "Book a hotel", "Book spa", "Book dining", "Book yacht", or "Book private jet" and I'll take you there!`,
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
    
    // Greetings
    if (lowerMessage.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup)\b/)) {
      return `Hello ${member?.name}! Welcome back to your ${member?.tier} concierge service. I'm here to assist you with any luxury travel needs. How may I help you today?`
    }
    
    // Goodbye
    if (lowerMessage.match(/\b(bye|goodbye|see you|later|farewell)\b/)) {
      return `Thank you for chatting with us, ${member?.name}! Your ${member?.tier} concierge team is always here for you 24/7. Have a wonderful day!`
    }
    
    // Thanks
    if (lowerMessage.match(/\b(thank|thanks|appreciate|grateful)\b/)) {
      return `You're very welcome, ${member?.name}! It's my pleasure to serve you as your ${member?.tier} concierge. Is there anything else I can help you with today?`
    }
    
    // How are you
    if (lowerMessage.match(/\b(how are you|how r u|hows it going|whats up)\b/)) {
      return `I'm doing excellent, thank you for asking ${member?.name}! I'm here and ready to help you with any luxury travel arrangements. What can I assist you with today?`
    }
    
    // Who are you
    if (lowerMessage.match(/\b(who are you|what are you|your name)\b/)) {
      return `I'm your dedicated ${member?.tier} Royal Concierge AI Assistant, specially trained to help you with luxury travel bookings, exclusive services, and personalized recommendations. I'm available 24/7 to serve you, ${member?.name}!`
    }
    
    // Pricing questions
    if (lowerMessage.match(/\b(price|cost|fee|charge|expensive|cheap|rate|how much)\b/)) {
      return `As a ${member?.tier} member, you enjoy exclusive pricing with ${member?.tier === 'Diamond' ? '35%' : member?.tier === 'Platinum' ? '25%' : member?.tier === 'Gold' ? '15%' : '10%'} discount on all services. Prices vary by service: Hotels start at $200/night, private jets from $5,000/flight, luxury cars from $500/day, and yacht charters from $10,000/day. Would you like specific pricing for any service?`
    }
    
    // Discount questions
    if (lowerMessage.match(/\b(discount|save|savings|deal|offer|promotion|coupon|promo)\b/)) {
      return `Excellent question! Your ${member?.tier} membership includes ${member?.tier === 'Diamond' ? '35%' : member?.tier === 'Platinum' ? '25%' : member?.tier === 'Gold' ? '15%' : '10%'} discount on all bookings. Plus, you get priority access to exclusive deals, complimentary upgrades, and special seasonal promotions. Would you like to see current offers?`
    }
    
    // Payment questions
    if (lowerMessage.match(/\b(pay|payment|credit card|debit|cash|invoice|bill|transaction)\b/)) {
      return `We accept all major credit cards (Visa, Mastercard, Amex), wire transfers, and cryptocurrency. As a ${member?.tier} member, you can also use our flexible payment plans with 0% interest for bookings over $10,000. All transactions are secure and encrypted. Would you like to set up a payment method?`
    }
    
    // Cancellation questions
    if (lowerMessage.match(/\b(cancel|refund|change|modify|reschedule|postpone)\b/)) {
      return `Your ${member?.tier} membership includes flexible cancellation. You can cancel or modify bookings up to 24 hours before with full refund. For same-day changes, we offer 50% credit towards future bookings. Would you like to modify an existing reservation?`
    }
    
    // Location/destination questions
    if (lowerMessage.match(/\b(where|location|destination|city|country|place|destinations)\b/)) {
      return `We serve over 500 luxury destinations worldwide including Paris, Dubai, Maldives, New York, Tokyo, Singapore, London, Bali, Santorini, and more. Our exclusive hotels are in prime locations, and we can arrange private travel to any destination. Where would you like to go?`
    }
    
    // Booking/Availability questions - Instant booking
    if (lowerMessage.match(/\b(book|reserve|rent|get|need)\b.{0,20}\b(car|vehicle|rental|rolls|royce|bentley|mercedes|lamborghini|ferrari|porsche)\b/)) {
      const carMatch = message.match(/\b(rolls royce|rollsroyce|rolls-royce|bentley|mercedes|lamborghini|ferrari|porsche|bmw|audi|tesla)\b/i)
      
      // If no specific car mentioned, show options
      if (!carMatch) {
        return `🚗 Perfect, ${member?.name}! Which luxury vehicle would you like?\n\n1️⃣ Rolls Royce - $2,500/day\n2️⃣ Bentley - $2,000/day\n3️⃣ Mercedes S-Class - $1,500/day\n4️⃣ Lamborghini - $3,500/day\n5️⃣ Ferrari - $4,000/day\n6️⃣ Porsche - $2,200/day\n\nJust tell me the car name or number!`
      }
      
      const dateMatch = message.match(/\b(today|tomorrow|tonight|\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2})\b/i)
      const daysMatch = message.match(/\b(\d+)\s*(day|days|week|weeks)\b/i)
      
      const carType = carMatch[0]
      const bookingDate = dateMatch ? dateMatch[0] : 'today'
      const duration = daysMatch ? daysMatch[0] : '1 day'
      
      const carPrices: any = {
        'rolls royce': 2500,
        'rollsroyce': 2500,
        'rolls-royce': 2500,
        'bentley': 2000,
        'mercedes': 1500,
        'lamborghini': 3500,
        'ferrari': 4000,
        'porsche': 2200,
        'bmw': 1200,
        'audi': 1300,
        'tesla': 1000
      }
      
      const price = carPrices[carType.toLowerCase()] || 1500
      
      const bookingId = 'BK' + Math.floor(10000 + Math.random() * 90000)
      const booking = {
        id: bookingId,
        type: 'car',
        vehicle: carType,
        date: bookingDate,
        duration: duration,
        price: price,
        status: 'Confirmed',
        memberTier: member?.tier,
        bookingDate: new Date().toISOString(),
        timestamp: new Date().toISOString()
      }
      
      const existingBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
      existingBookings.push(booking)
      localStorage.setItem('memberBookings', JSON.stringify(existingBookings))
      
      return `✅ Excellent choice, ${member?.name}! I've instantly booked a ${carType} for you!\n\n📋 Booking Confirmation:\n🚗 Vehicle: ${carType}\n📅 Date: ${bookingDate}\n⏱️ Duration: ${duration}\n💰 Price: $${price.toLocaleString()} (${member?.tier} discount applied)\n🎫 Confirmation: ${bookingId}\n\n✨ Your luxury vehicle will be delivered with a professional chauffeur. Confirmation email sent to your registered address!`
    }
    if (lowerMessage.match(/\b(book|reserve)\b.{0,20}\b(hotel|room|suite)\b/)) {
      navigate('/hotels')
      return `🏨 Taking you to our Hotels page to browse and book your perfect stay...`
    }
    if (lowerMessage.match(/\b(book|charter)\b.{0,20}\b(yacht|boat)\b/)) {
      navigate('/yacht-charter')
      return `🛥️ Taking you to Yacht Charter page...`
    }
    if (lowerMessage.match(/\b(book|charter)\b.{0,20}\b(jet|aircraft|plane)\b/)) {
      navigate('/aircraft-booking')
      return `✈️ Taking you to Aircraft Booking page...`
    }
    if (lowerMessage.match(/\b(book|reserve)\b.{0,20}\b(spa|massage)\b/)) {
      navigate('/wellness-spa')
      return `💆 Taking you to Wellness & Spa page...`
    }
    if (lowerMessage.match(/\b(book|reserve)\b.{0,20}\b(table|restaurant|dining)\b/)) {
      navigate('/dining-reservations')
      return `🍽️ Taking you to Dining Reservations page...`
    }
    if (lowerMessage.match(/\b(available|availability|free|open|vacant)\b/)) {
      return `As a ${member?.tier} member, you have priority access to all services! Tell me what you'd like to book: "Book a car", "Book a hotel", "Book spa", "Book dining", "Book yacht", or "Book private jet" and I'll take you there instantly!`
    }
    
    // Contact questions
    if (lowerMessage.match(/\b(contact|call|phone|email|reach|speak|talk)\b/)) {
      return `You can reach our ${member?.tier} concierge team 24/7 at: Phone: +1 (800) ROYAL-01, Email: concierge@thegrandstay.com, or continue chatting here. We also offer video consultations. Would you like to schedule a call?`
    }
    
    // Time/hours questions
    if (lowerMessage.match(/\b(when|time|hour|schedule|open|close|timing)\b/)) {
      return `Our ${member?.tier} concierge service is available 24/7, 365 days a year. You can reach us anytime, day or night. We guarantee response within 15 minutes for all ${member?.tier} members. What time works best for you?`
    }
    
    // Amenities questions
    if (lowerMessage.match(/\b(amenity|amenities|facility|facilities|feature|include|what do you have)\b/)) {
      return `Our exclusive properties include: Private pools, spa facilities, gourmet restaurants, fitness centers, concierge service, airport transfers, and more. ${member?.tier} members also get complimentary breakfast, late checkout, and room upgrades. Which amenities interest you most?`
    }
    
    // Food/dining questions
    if (lowerMessage.match(/\b(food|restaurant|dining|eat|breakfast|lunch|dinner|meal|cuisine)\b/)) {
      return `We offer world-class dining experiences! Our hotels feature Michelin-starred restaurants, private chef services, and in-room dining. We can also arrange exclusive restaurant reservations worldwide. ${member?.tier} members receive complimentary breakfast and priority seating. What cuisine do you prefer?`
    }
    
    // Spa/wellness questions
    if (lowerMessage.match(/\b(spa|massage|wellness|relax|treatment|therapy)\b/)) {
      return `Our luxury properties feature world-class spa facilities with treatments including massages, facials, body treatments, and wellness programs. ${member?.tier} members receive 20% off all spa services and priority booking. Would you like to book a spa treatment?`
    }
    
    // Airport/transfer questions
    if (lowerMessage.match(/\b(airport|transfer|pickup|drop off|transportation)\b/)) {
      return `We provide complimentary airport transfers for all ${member?.tier} members! Our luxury vehicles will pick you up from any airport and transport you to your hotel. We also offer private jet terminals and VIP lounge access. Need to arrange a transfer?`
    }
    
    // Family/kids questions
    if (lowerMessage.match(/\b(family|kid|child|children|baby|infant)\b/)) {
      return `We're family-friendly! Our properties offer kids clubs, babysitting services, family suites, and child-friendly amenities. Children under 12 stay free with ${member?.tier} members. We can also arrange family activities and excursions. How many children will be traveling?`
    }
    
    // Pet questions
    if (lowerMessage.match(/\b(pet|dog|cat|animal)\b/)) {
      return `Many of our luxury properties are pet-friendly! We welcome well-behaved pets and provide pet amenities including beds, bowls, and treats. ${member?.tier} members receive complimentary pet services. Please let us know your pet's size and breed for the best accommodations.`
    }
    
    // Weather questions
    if (lowerMessage.match(/\b(weather|temperature|climate|season|rain|sunny)\b/)) {
      return `I can help you choose the perfect destination based on weather! Which type of climate do you prefer? Tropical beaches, mountain retreats, desert luxury, or city escapes? I can recommend the best destinations for your preferred season.`
    }
    
    // Romantic/honeymoon questions
    if (lowerMessage.match(/\b(romantic|honeymoon|anniversary|couple|romance|wedding)\b/)) {
      return `How wonderful! We specialize in romantic getaways. Our packages include: Private beach dinners, couples spa treatments, champagne on arrival, rose petal turndown, and more. ${member?.tier} members get complimentary honeymoon upgrades. When is your special occasion?`
    }
    
    // Group/event questions
    if (lowerMessage.match(/\b(group|event|meeting|conference|party|celebration)\b/)) {
      return `We excel at group bookings and events! We can arrange: Corporate meetings, weddings, celebrations, and group travel. ${member?.tier} members receive group discounts starting at 5+ rooms. Our event planners will handle all details. How many guests?`
    }
    
    // Safety/security questions
    if (lowerMessage.match(/\b(safe|safety|security|secure|protection)\b/)) {
      return `Your safety is our priority! All properties have 24/7 security, secure payment systems, travel insurance options, and emergency support. ${member?.tier} members get dedicated security liaison and emergency hotline. We also provide COVID-19 safety protocols. Any specific concerns?`
    }
    
    // Loyalty/points questions
    if (lowerMessage.match(/\b(point|points|reward|loyalty|earn|redeem)\b/)) {
      return `Great question! ${member?.tier} members earn 10 points per dollar spent. Points can be redeemed for free nights, upgrades, and exclusive experiences. You currently have access to exclusive ${member?.tier} rewards. Would you like to check your points balance?`
    }
    
    // Language questions
    if (lowerMessage.match(/\b(language|speak|english|spanish|french|translate)\b/)) {
      return `Our concierge team speaks over 20 languages including English, Spanish, French, German, Italian, Chinese, Japanese, and Arabic. All ${member?.tier} members get multilingual support 24/7. Which language do you prefer?`
    }
    
    // Visa/passport questions
    if (lowerMessage.match(/\b(visa|passport|document|immigration|travel document)\b/)) {
      return `We can assist with visa requirements and travel documentation! Our concierge team can help with visa applications, passport renewals, and provide destination-specific entry requirements. ${member?.tier} members get expedited visa processing assistance. Which country are you traveling to?`
    }
    
    // Insurance questions
    if (lowerMessage.match(/\b(insurance|coverage|protect|medical)\b/)) {
      return `We offer comprehensive travel insurance covering cancellations, medical emergencies, lost baggage, and trip interruptions. ${member?.tier} members receive premium insurance at discounted rates. Would you like to add travel insurance to your booking?`
    }
    
    // Recommendation questions
    if (lowerMessage.match(/\b(recommend|suggest|best|top|popular|favorite)\b/)) {
      return `I'd love to recommend something perfect for you! Based on your ${member?.tier} status, I suggest: Maldives for beaches, Swiss Alps for luxury skiing, Dubai for shopping, Paris for culture, or Tokyo for unique experiences. What type of experience are you looking for?`
    }
    
    // Existing keyword responses - Direct booking actions
    if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
      if (lowerMessage.includes('car') || lowerMessage.includes('vehicle')) {
        navigate('/car-rental')
        return `🚗 Taking you to our Car Rental page to book your luxury vehicle...`
      } else if (lowerMessage.includes('hotel') || lowerMessage.includes('room')) {
        navigate('/hotels')
        return `🏨 Taking you to our Hotels page to browse and book...`
      } else if (lowerMessage.includes('yacht') || lowerMessage.includes('boat')) {
        navigate('/yacht-charter')
        return `🛥️ Taking you to Yacht Charter page...`
      } else if (lowerMessage.includes('jet') || lowerMessage.includes('aircraft') || lowerMessage.includes('plane')) {
        navigate('/aircraft-booking')
        return `✈️ Taking you to Aircraft Booking page...`
      } else if (lowerMessage.includes('spa') || lowerMessage.includes('massage')) {
        navigate('/wellness-spa')
        return `💆 Taking you to Wellness & Spa page...`
      } else if (lowerMessage.includes('dining') || lowerMessage.includes('restaurant') || lowerMessage.includes('table')) {
        navigate('/dining-reservations')
        return `🍽️ Taking you to Dining Reservations page...`
      } else {
        return `I can help you book instantly! Just tell me: "Book a car", "Book a hotel", "Book spa", "Book dining", "Book yacht", or "Book private jet". I'll take you directly to the booking page!`
      }
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
      // Intelligent fallback with context
      const keywords = lowerMessage.match(/\b(\w+)\b/g) || []
      if (keywords.length > 0) {
        return `I understand you're asking about "${message}". As your ${member?.tier} concierge, I can help with: bookings, hotels, flights, cars, yachts, pricing, availability, payments, cancellations, destinations, amenities, dining, spa services, events, and much more. Could you please provide more details so I can assist you better?`
      }
      return `Thank you for your message, ${member?.name}. As your ${member?.tier} concierge assistant, I'm here to help with all your luxury travel needs. You can ask me about: bookings, pricing, availability, destinations, amenities, dining, spa, transfers, events, and more. What would you like to know?`
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
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  style={{
                    width: '100%',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '16px',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
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