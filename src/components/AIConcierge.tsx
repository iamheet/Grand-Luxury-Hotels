import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Message {
  type: 'user' | 'ai' | 'action'
  text: string
  action?: {
    type: 'view' | 'cancel' | 'modify' | 'book'
    bookingId?: string
    data?: any
  }
}

export default function AIConcierge() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { type: 'ai', text: 'Hello! I\'m your luxury concierge AI. I can help you book, view, modify, or cancel reservations. How may I assist you today?' }
  ])
  const [input, setInput] = useState('')
  const [awaitingAction, setAwaitingAction] = useState<{type: string, data?: any} | null>(null)

  const quickReplies = [
    'View my bookings',
    'Book a hotel',
    'Book a car',
    'Book spa',
    'Book dining'
  ]

  const performAction = (actionType: string, data?: any) => {
    switch(actionType) {
      case 'view-bookings':
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: '✅ Redirecting you to My Bookings page where you can view all your reservations...'
        }])
        setTimeout(() => navigate('/my-bookings'), 1000)
        break
      
      case 'book-hotel':
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: '✅ Taking you to our Hotels page to browse and book your perfect stay...'
        }])
        setTimeout(() => navigate('/hotels'), 1000)
        break
      
      case 'cancel-booking':
        if (data?.bookingId) {
          const bookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
          const updatedBookings = bookings.filter((b: any) => b.id !== data.bookingId)
          localStorage.setItem('memberBookings', JSON.stringify(updatedBookings))
          setMessages(prev => [...prev, { 
            type: 'ai', 
            text: `✅ Booking #${data.bookingId} has been cancelled successfully! Refund will be processed within 5-7 business days. You'll receive a confirmation email shortly.`
          }])
        } else {
          setAwaitingAction({type: 'cancel'})
          setMessages(prev => [...prev, { 
            type: 'ai', 
            text: 'Please provide your booking confirmation number (e.g., BK12345) to cancel:'
          }])
        }
        break
      
      case 'modify-booking':
        if (data?.bookingId) {
          setMessages(prev => [...prev, { 
            type: 'ai', 
            text: `✅ Redirecting you to modify booking #${data.bookingId}. You can change dates, room type, or guest details.`
          }])
          setTimeout(() => navigate('/my-bookings'), 1000)
        } else {
          setAwaitingAction({type: 'modify'})
          setMessages(prev => [...prev, { 
            type: 'ai', 
            text: 'Please provide your booking confirmation number (e.g., BK12345) to modify:'
          }])
        }
        break
      
      case 'check-status':
        if (data?.bookingId) {
          const bookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
          const booking = bookings.find((b: any) => b.id === data.bookingId)
          if (booking) {
            setMessages(prev => [...prev, { 
              type: 'ai', 
              text: `📋 Booking Status:\n\n🏨 Hotel: ${booking.hotel}\n📅 Check-in: ${booking.checkIn}\n📅 Check-out: ${booking.checkOut}\n👥 Guests: ${booking.guests}\n💰 Total: $${booking.total}\n✅ Status: ${booking.status || 'Confirmed'}\n\nNeed to modify or cancel? Just ask!`
            }])
          } else {
            setMessages(prev => [...prev, { 
              type: 'ai', 
              text: `❌ Booking #${data.bookingId} not found. Please check your confirmation number and try again.`
            }])
          }
        } else {
          setAwaitingAction({type: 'status'})
          setMessages(prev => [...prev, { 
            type: 'ai', 
            text: 'Please provide your booking confirmation number (e.g., BK12345) to check status:'
          }])
        }
        break
      
      case 'membership':
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: '✅ Taking you to our Membership page to explore exclusive benefits and join today!'
        }])
        setTimeout(() => navigate('/membership'), 1000)
        break
      
      case 'book-car':
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: '🚗 Taking you to our Car Rental page to book your luxury vehicle...'
        }])
        setTimeout(() => navigate('/car-rental'), 1000)
        break
      
      case 'book-yacht':
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: '🛥️ Taking you to Yacht Charter page to book your exclusive experience...'
        }])
        setTimeout(() => navigate('/yacht-charter'), 1000)
        break
      
      case 'book-jet':
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: '✈️ Taking you to Aircraft Booking page for private jet reservations...'
        }])
        setTimeout(() => navigate('/aircraft-booking'), 1000)
        break
      
      case 'book-spa':
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: '💆 Taking you to Wellness & Spa page to book your relaxation session...'
        }])
        setTimeout(() => navigate('/wellness-spa'), 1000)
        break
      
      case 'book-dining':
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: '🍽️ Taking you to Dining Reservations page to book your table...'
        }])
        setTimeout(() => navigate('/dining-reservations'), 1000)
        break
      
      case 'book-event':
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: '🎉 Taking you to Private Events page to plan your celebration...'
        }])
        setTimeout(() => navigate('/private-events'), 1000)
        break
    }
  }

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    // Handle awaiting actions (booking IDs, etc.)
    if (awaitingAction) {
      const bookingIdMatch = input.match(/\b(BK|bk)?\s*\d{5,}\b/)
      if (bookingIdMatch) {
        const bookingId = bookingIdMatch[0].toUpperCase().replace(/\s/g, '')
        const actionType = awaitingAction.type
        setAwaitingAction(null)
        
        if (actionType === 'cancel') {
          performAction('cancel-booking', { bookingId })
          return ''
        } else if (actionType === 'modify') {
          performAction('modify-booking', { bookingId })
          return ''
        } else if (actionType === 'status') {
          performAction('check-status', { bookingId })
          return ''
        }
      }
    }
    
    // ACTION COMMANDS - SPECIFIC SERVICES FIRST (to avoid generic matches)
    
    // Book Car - Direct booking with details extraction
    if (input.match(/\b(book|rent|get|reserve|need)\b.{0,20}\b(car|vehicle|rental|auto|rolls|royce|bentley|mercedes|lamborghini|ferrari|porsche)\b/)) {
      const carMatch = input.match(/\b(rolls royce|rollsroyce|rolls-royce|bentley|mercedes|lamborghini|ferrari|porsche|bmw|audi|tesla)\b/i)
      
      // If no specific car mentioned, show options
      if (!carMatch) {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: `🚗 Perfect! Which luxury vehicle would you like?\n\n1️⃣ Rolls Royce - $2,500/day\n2️⃣ Bentley - $2,000/day\n3️⃣ Mercedes S-Class - $1,500/day\n4️⃣ Lamborghini - $3,500/day\n5️⃣ Ferrari - $4,000/day\n6️⃣ Porsche - $2,200/day\n\nJust tell me the car name or number!`
        }])
        return ''
      }
      
      const dateMatch = input.match(/\b(today|tomorrow|tonight|\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2})\b/i)
      const daysMatch = input.match(/\b(\d+)\s*(day|days|week|weeks)\b/i)
      
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
        bookingDate: new Date().toISOString(),
        timestamp: new Date().toISOString()
      }
      
      const existingBookings = JSON.parse(localStorage.getItem('memberBookings') || '[]')
      existingBookings.push(booking)
      localStorage.setItem('memberBookings', JSON.stringify(existingBookings))
      
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: `✅ Perfect! I've booked a ${carType} for you!\n\n📋 Booking Confirmation:\n🚗 Vehicle: ${carType}\n📅 Date: ${bookingDate}\n⏱️ Duration: ${duration}\n💰 Price: $${price.toLocaleString()}\n🎫 Confirmation: ${bookingId}\n\n✨ Your luxury vehicle will be ready with a professional chauffeur. Confirmation email sent!`
      }])
      return ''
    }
    
    // Book Yacht
    if (input.match(/\b(book|charter|rent|reserve)\b.{0,20}\b(yacht|boat)\b/)) {
      performAction('book-yacht')
      return ''
    }
    
    // Book Private Jet
    if (input.match(/\b(book|charter|rent)\b.{0,20}\b(jet|aircraft|plane)\b/) || input.includes('private jet') || input.includes('private flight')) {
      performAction('book-jet')
      return ''
    }
    
    // Book Spa
    if (input.match(/\b(book|reserve|schedule|get)\b.{0,20}\b(spa|massage|wellness|treatment)\b/)) {
      performAction('book-spa')
      return ''
    }
    
    // Book Dining
    if (input.match(/\b(book|reserve|make|get)\b.{0,20}\b(table|restaurant|dining|dinner|lunch)\b/)) {
      performAction('book-dining')
      return ''
    }
    
    // Book Event
    if (input.match(/\b(book|plan|organize|arrange)\b.{0,20}\b(event|party|celebration|wedding|birthday|anniversary)\b/)) {
      performAction('book-event')
      return ''
    }
    
    // Book Hotel (after specific services)
    if (input.match(/\b(book|reserve|find|get)\b.{0,20}\b(hotel|room|suite|accommodation)\b/)) {
      performAction('book-hotel')
      return ''
    }
    
    // View Bookings
    if (input.match(/\b(view|show|see|check|display)\b.{0,20}\b(my|all)\b.{0,20}\b(booking|bookings|reservation|reservations)\b/)) {
      performAction('view-bookings')
      return ''
    }
    
    // Cancel Booking
    if (input.match(/\b(cancel|delete|remove)\b.{0,20}\b(booking|reservation)\b/)) {
      const bookingIdMatch = input.match(/\b(BK|bk)?\s*\d{5,}\b/)
      if (bookingIdMatch) {
        const bookingId = bookingIdMatch[0].toUpperCase().replace(/\s/g, '')
        performAction('cancel-booking', { bookingId })
        return ''
      } else {
        performAction('cancel-booking')
        return ''
      }
    }
    
    // Modify Booking
    if (input.match(/\b(modify|change|update|edit|reschedule)\b.{0,20}\b(booking|reservation)\b/)) {
      const bookingIdMatch = input.match(/\b(BK|bk)?\s*\d{5,}\b/)
      if (bookingIdMatch) {
        const bookingId = bookingIdMatch[0].toUpperCase().replace(/\s/g, '')
        performAction('modify-booking', { bookingId })
        return ''
      } else {
        performAction('modify-booking')
        return ''
      }
    }
    
    // Check Booking Status
    if (input.match(/\b(status|check|track)\b.{0,20}\b(booking|reservation)\b/) || input.includes('booking status')) {
      const bookingIdMatch = input.match(/\b(BK|bk)?\s*\d{5,}\b/)
      if (bookingIdMatch) {
        const bookingId = bookingIdMatch[0].toUpperCase().replace(/\s/g, '')
        performAction('check-status', { bookingId })
        return ''
      } else {
        performAction('check-status')
        return ''
      }
    }
    
    // Join Membership
    if (input.match(/\b(join|signup for|get)\b.{0,20}\b(membership|member)\b/)) {
      performAction('membership')
      return ''
    }
    
    // GREETINGS & GENERAL
    if (input.match(/\b(hello|hi|hey|good morning|good evening|greetings)\b/)) {
      return 'Hello! Welcome to The Grand Stay - your premier luxury hospitality destination. I can help you with hotels, memberships, events, travel, dining, wellness, and all our exclusive services. What would you like to know?'
    }
    if (input.includes('what is') && (input.includes('grand stay') || input.includes('this'))) {
      return 'The Grand Stay is a luxury hospitality platform offering premium hotels worldwide, exclusive memberships, concierge services, event planning, travel arrangements, dining experiences, wellness services, and much more. We cater to discerning travelers seeking exceptional experiences.'
    }
    if (input.includes('who are you') || input.includes('what are you')) {
      return 'I\'m your AI Concierge assistant for The Grand Stay. I\'m here 24/7 to answer questions, help you book services, provide information about our offerings, and ensure you have the best luxury experience possible.'
    }
    
    // HOTELS & ACCOMMODATIONS
    if (input.match(/\b(hotel|hotels|room|rooms|suite|suites|accommodation|stay|lodging)\b/)) {
      return 'We offer luxury hotels worldwide with premium suites, world-class amenities, and exceptional service. Browse our Hotels List to view properties, check availability, see photos, read reviews, and book directly. Each hotel features concierge services, fine dining, spa facilities, and more.'
    }
    if (input.includes('where') && input.includes('hotel')) {
      return 'Our hotels are located in prime destinations worldwide including major cities, beach resorts, mountain retreats, and exclusive locations. Visit our Hotels List page to explore all locations and find your perfect destination.'
    }
    if (input.includes('amenities') || input.includes('facilities')) {
      return 'Our hotels feature: luxury suites, 24/7 concierge, fine dining restaurants, spa & wellness centers, fitness facilities, swimming pools, business centers, meeting rooms, valet parking, airport transfers, and premium in-room amenities.'
    }
    if (input.includes('check in') || input.includes('check out') || input.includes('checkout time')) {
      return 'Standard check-in is 3:00 PM and check-out is 12:00 PM. Early check-in and late check-out are available upon request and subject to availability. Members receive priority and flexible timing.'
    }
    
    // BOOKING PROCESS (only if no specific service was matched)
    if (input.match(/\b(how to book|booking process|make a booking)\b/)) {
      return 'I can help you book instantly! Just tell me what you need: "Book a hotel", "Book a car", "Book spa", "Book dining", "Book yacht", or "Book private jet". I\'ll take you directly to the booking page!'
    }
    if (input.includes('cancel') || input.includes('cancellation') || input.includes('refund')) {
      return 'I can cancel your booking instantly! Just say "Cancel booking BK12345" with your confirmation number, or say "Cancel my booking" and I\'ll guide you. Free cancellation up to 48 hours before arrival. Refunds processed in 5-7 days.'
    }
    if (input.includes('modify') || input.includes('change booking') || input.includes('reschedule')) {
      return 'I can help modify your booking! Say "Modify booking BK12345" with your confirmation number, or say "Change my booking" and I\'ll assist you. You can change dates, room type, or guest details instantly.'
    }
    if (input.includes('confirmation') || input.includes('booking confirmation')) {
      return 'You\'ll receive instant booking confirmation via email with all details including confirmation number, hotel information, dates, and special requests. You can also view confirmations in My Bookings dashboard.'
    }
    
    // MEMBERSHIP & REWARDS
    if (input.match(/\b(member|membership|join|sign up|royal rewards|loyalty|points)\b/)) {
      return 'Join our exclusive membership program! Benefits include: Priority booking, Special discounts (10-30% off), Royal Rewards points, 24/7 concierge access, Room upgrades, Late checkout, Welcome amenities, and Exclusive experiences. Visit Membership page to explore tiers and join today!'
    }
    if (input.includes('membership tier') || input.includes('membership level')) {
      return 'We offer multiple membership tiers: Silver (Entry level with basic perks), Gold (Enhanced benefits and discounts), Platinum (Premium access and upgrades), and Diamond (Ultimate luxury with all privileges). Each tier offers increasing benefits and rewards.'
    }
    if (input.includes('how much') && input.includes('membership')) {
      return 'Membership pricing varies by tier. Visit our Membership page for detailed pricing and benefits comparison. We offer monthly and annual payment options with savings on annual plans. Investment starts from affordable rates with exceptional value.'
    }
    if (input.includes('points') || input.includes('rewards')) {
      return 'Earn Royal Rewards points on every booking and service! Points can be redeemed for free nights, room upgrades, dining credits, spa treatments, and exclusive experiences. Members earn 10 points per dollar spent. Check your points balance in Member Dashboard.'
    }
    
    // EVENTS & CELEBRATIONS
    if (input.match(/\b(wedding|weddings|marry|marriage|bride|groom)\b/)) {
      return 'Plan your dream Luxury Wedding with us! We offer complete wedding planning including venue selection, catering, decoration, photography, entertainment, accommodation for guests, and honeymoon packages. Our wedding specialists handle every detail for your perfect day.'
    }
    if (input.match(/\b(birthday|bday|birth day)\b/)) {
      return 'Celebrate with our Birthday Celebration service! We arrange everything: venue decoration, custom cakes, catering, entertainment, photography, party favors, and special surprises. Perfect for milestone birthdays, kids parties, or intimate gatherings.'
    }
    if (input.match(/\b(anniversary|anniversaries)\b/)) {
      return 'Make your anniversary unforgettable with our Anniversary Dinner service! Includes: romantic private dining, custom menu by chef, premium wine selection, floral arrangements, live music, photography, and special room setup. Perfect for celebrating love.'
    }
    if (input.match(/\b(corporate event|company event|corporate party|business event)\b/)) {
      return 'Host impressive Corporate Events with full planning: venue selection, AV equipment, catering, team building activities, entertainment, accommodation, and event coordination. Perfect for conferences, seminars, product launches, and company celebrations.'
    }
    if (input.includes('gala') || input.includes('formal event')) {
      return 'Our Corporate Gala service creates spectacular formal events with elegant venues, gourmet catering, premium entertainment, red carpet experience, professional photography, and complete event management. Impress clients and celebrate achievements in style.'
    }
    if (input.includes('product launch') || input.includes('launch event')) {
      return 'Make your Product Launch memorable! We provide: strategic venue selection, media coordination, AV production, catering, guest management, promotional materials, and post-event coverage. Create buzz and showcase your brand perfectly.'
    }
    if (input.includes('charity') || input.includes('fundraiser') || input.includes('fundraising')) {
      return 'Organize successful Charity Fundraisers with our support: venue arrangement, donor management, auction coordination, entertainment, catering, marketing, and event execution. We help maximize impact for your cause.'
    }
    if (input.includes('private event') || input.includes('special occasion')) {
      return 'Host exclusive Private Events tailored to your vision! Whether intimate gatherings or grand celebrations, we handle venue, catering, entertainment, decoration, and all logistics. Every detail customized for your special occasion.'
    }
    
    // BUSINESS SERVICES
    if (input.match(/\b(business travel|corporate travel|work travel)\b/)) {
      return 'Our Business Travel Concierge handles everything: flight booking, hotel reservations, ground transportation, meeting room arrangements, itinerary planning, and 24/7 support. Perfect for executives, teams, and frequent business travelers.'
    }
    if (input.includes('meeting room') || input.includes('conference room')) {
      return 'Book Executive Meeting Rooms equipped with: high-speed WiFi, video conferencing, presentation screens, whiteboards, premium seating, catering options, and technical support. Available hourly, daily, or long-term. Perfect for presentations and team meetings.'
    }
    if (input.includes('business service') && !input.includes('travel')) {
      return 'Business Services include: secretarial support, printing & copying, translation services, courier services, IT support, virtual office, and administrative assistance. Everything you need for productive business operations.'
    }
    
    // TRAVEL SERVICES
    if (input.match(/\b(travel planning|trip planning|itinerary)\b/)) {
      return 'Our Travel Planning service creates perfect itineraries including: destination research, activity booking, restaurant reservations, transportation, accommodation, and 24/7 travel support. We handle all details so you just enjoy the journey.'
    }
    if (input.includes('airport') || input.includes('vip airport')) {
      return 'Airport VIP Services include: fast-track security, lounge access, meet & greet, baggage handling, immigration assistance, and luxury transfers. Skip queues and travel in comfort. Available at major airports worldwide.'
    }
    if (input.includes('private jet') || input.includes('aircraft') || input.includes('charter flight')) {
      return 'Book private Aircraft for ultimate travel luxury! Choose from light jets to large cabin aircraft. Services include: flexible scheduling, custom catering, ground transportation, and complete privacy. Perfect for business or leisure travel.'
    }
    if (input.includes('car rental') || input.includes('luxury car') || input.includes('vehicle')) {
      return 'Luxury Car Rental offers premium vehicles: sports cars, SUVs, sedans, and exotic cars. All vehicles are latest models with insurance, GPS, and 24/7 roadside assistance. Chauffeur service available. Book by day, week, or month.'
    }
    if (input.includes('yacht') || input.includes('boat') || input.includes('cruise')) {
      return 'Yacht Charter provides exclusive experiences: luxury yachts with crew, custom itineraries, gourmet catering, water sports equipment, and complete privacy. Perfect for celebrations, corporate events, or relaxing getaways.'
    }
    
    // DINING & CULINARY
    if (input.match(/\b(restaurant|dining|dinner|lunch|breakfast|eat|food)\b/)) {
      return 'Dining Reservations at exclusive restaurants worldwide! We secure tables at Michelin-starred establishments, celebrity chef restaurants, and hidden gems. Includes: priority booking, special table selection, dietary accommodations, and sommelier recommendations.'
    }
    if (input.includes('private chef') || input.includes('personal chef')) {
      return 'Hire a Private Chef for intimate dining experiences! Services include: custom menu planning, grocery shopping, meal preparation, table service, and cleanup. Perfect for special occasions, dinner parties, or daily meal preparation.'
    }
    if (input.includes('wine') || input.includes('wine cellar') || input.includes('sommelier')) {
      return 'Access our Wine Cellar featuring rare and vintage wines from around the world! Services include: wine tasting events, sommelier consultations, cellar tours, wine pairing dinners, and bottle purchases. Perfect for connoisseurs and collectors.'
    }
    
    // WELLNESS & SPA
    if (input.match(/\b(spa|massage|wellness|relaxation|treatment)\b/)) {
      return 'Wellness & Spa services include: therapeutic massages, facials, body treatments, hydrotherapy, aromatherapy, and holistic wellness programs. Our expert therapists use premium products. Book individual treatments or full-day packages.'
    }
    if (input.includes('beauty') || input.includes('grooming') || input.includes('salon')) {
      return 'Beauty & Grooming services offer: haircuts & styling, coloring, manicures, pedicures, makeup application, skincare treatments, and grooming for men. Expert stylists use luxury products. Perfect for special occasions or regular maintenance.'
    }
    if (input.includes('personal trainer') || input.includes('fitness') || input.includes('gym')) {
      return 'Personal Trainer services provide: customized workout plans, one-on-one training, nutrition guidance, fitness assessments, and goal tracking. Train at our facilities or your location. Perfect for all fitness levels and goals.'
    }
    if (input.includes('medical') || input.includes('doctor') || input.includes('health')) {
      return 'Medical Services include: 24/7 doctor on call, health consultations, prescription delivery, medical concierge, specialist referrals, and emergency assistance. We ensure your health and wellbeing during your stay.'
    }
    
    // ENTERTAINMENT & ACTIVITIES
    if (input.includes('theater') || input.includes('show') || input.includes('broadway') || input.includes('tickets')) {
      return 'Theater Tickets service secures premium seats for: Broadway shows, concerts, opera, ballet, sporting events, and exclusive performances. We get sold-out tickets and VIP access. Includes: best seats, meet & greet options, and transportation.'
    }
    if (input.includes('entertainment') && !input.includes('theater')) {
      return 'Entertainment services arrange: live music, DJs, performers, celebrity appearances, magic shows, and custom entertainment for events. We book top talent and handle all logistics for unforgettable experiences.'
    }
    
    // SHOPPING & STYLING
    if (input.includes('personal shopping') || input.includes('shopper') || input.includes('shopping')) {
      return 'Personal Shopping service provides: expert stylist consultation, store appointments, wardrobe planning, trend advice, and shopping assistance. We help you find perfect pieces for any occasion. Available at luxury boutiques and department stores.'
    }
    if (input.includes('styling') || input.includes('red carpet') || input.includes('stylist')) {
      return 'Red Carpet Styling creates show-stopping looks! Services include: designer outfit selection, accessories, hair & makeup, fitting coordination, and style consultation. Perfect for galas, premieres, weddings, and special events.'
    }
    
    // ACCOUNT & LOGIN
    if (input.match(/\b(login|log in|sign in|signin)\b/)) {
      return 'Login to your account to access: booking history, saved preferences, Royal Rewards points, exclusive offers, and member benefits. New users can Register for free. Members use Member Login, admins use Admin Login.'
    }
    if (input.match(/\b(register|sign up|signup|create account)\b/)) {
      return 'Register for free to: save bookings, earn rewards, access member rates, receive exclusive offers, and enjoy faster checkout. Registration takes 2 minutes. Upgrade to paid membership anytime for premium benefits.'
    }
    if (input.includes('forgot password') || input.includes('reset password')) {
      return 'Reset your password easily! Click "Forgot Password" on login page, enter your email, and you\'ll receive a reset link instantly. Follow the link to create a new password. Contact support if you need assistance.'
    }
    if (input.includes('dashboard') || input.includes('my account')) {
      return 'Your Member Dashboard shows: upcoming bookings, booking history, Royal Rewards points, membership status, saved preferences, exclusive offers, and quick access to all services. Login to access your personalized dashboard.'
    }
    if (input.includes('my booking') || input.includes('view booking')) {
      return 'I can show you your bookings right now! Just say "View my bookings" and I\'ll take you there. You\'ll see: upcoming reservations, past stays, booking details, confirmation numbers, and payment history. You can also modify or cancel from there.'
    }
    
    // PRICING & PAYMENT
    if (input.match(/\b(price|cost|rate|fee|charge|expensive|cheap|affordable)\b/)) {
      return 'Pricing varies by service and season. Hotels start from competitive rates, memberships have tiered pricing, and concierge services are individually priced. Members save 10-30% on all bookings. We accept all major credit cards, PayPal, and bank transfers.'
    }
    if (input.includes('payment') || input.includes('pay') || input.includes('checkout')) {
      return 'We accept: Visa, Mastercard, American Express, Discover, PayPal, bank transfers, and cryptocurrency. All payments are secure with SSL encryption. You can save payment methods for faster checkout. Invoices provided for all transactions.'
    }
    if (input.includes('discount') || input.includes('promo') || input.includes('coupon') || input.includes('offer')) {
      return 'Special offers available! Members receive: 10-30% discounts, seasonal promotions, early bird rates, last-minute deals, and exclusive packages. Check your Member Dashboard for personalized offers. Subscribe to our newsletter for latest deals.'
    }
    if (input.includes('free') || input.includes('complimentary')) {
      return 'Complimentary services include: WiFi, welcome drinks, daily newspaper, basic concierge, and fitness center access. Members receive additional perks: room upgrades, late checkout, welcome amenities, and priority services.'
    }
    
    // CONCIERGE & SUPPORT
    if (input.includes('concierge') || input.includes('royal concierge')) {
      return 'Our Royal Concierge provides 24/7 personalized assistance for: travel arrangements, restaurant reservations, event planning, special requests, local recommendations, and anything you need. Available via chat, phone, or email. Members get priority service.'
    }
    if (input.match(/\b(help|support|assistance|contact|question|problem|issue)\b/)) {
      return 'Need help? We\'re here 24/7! Contact us via: Live chat (instant response), Email (support@thegrandstay.com), Phone (toll-free), or visit our Help page for FAQs. Members receive priority support with dedicated assistance.'
    }
    if (input.includes('24/7') || input.includes('available') || input.includes('hours')) {
      return 'We\'re available 24/7/365! Our concierge team, customer support, and emergency assistance are always ready to help. Chat, call, or email anytime - we never close. Your comfort and satisfaction are our priority.'
    }
    if (input.includes('complaint') || input.includes('feedback') || input.includes('review')) {
      return 'Your feedback matters! Share your experience via: email, phone, or feedback form on our website. We take all feedback seriously and respond within 24 hours. Positive reviews help us grow, and we address concerns immediately.'
    }
    
    // LOCATION & DESTINATIONS
    if (input.includes('where') || input.includes('location') || input.includes('destination')) {
      return 'We serve destinations worldwide including: major cities, beach resorts, mountain retreats, island paradises, cultural capitals, and exclusive locations. Browse our Hotels List to explore all destinations and find your perfect getaway.'
    }
    if (input.includes('popular') || input.includes('best') || input.includes('recommend')) {
      return 'Popular destinations include: Paris, Dubai, Maldives, New York, Tokyo, London, Bali, Swiss Alps, Caribbean islands, and more! Each offers unique experiences. Our concierge can recommend based on your preferences and travel dates.'
    }
    
    // SPECIAL REQUESTS
    if (input.includes('special request') || input.includes('custom') || input.includes('personalize')) {
      return 'We love special requests! Whether it\'s dietary needs, room preferences, celebration arrangements, accessibility requirements, or unique experiences - just ask! Our concierge team makes it happen. Nothing is too big or small.'
    }
    if (input.includes('pet') || input.includes('dog') || input.includes('cat')) {
      return 'Many of our hotels are pet-friendly! We welcome your furry companions with: pet beds, bowls, treats, walking services, and pet-sitting. Pet fees may apply. Contact us to confirm pet policies for your chosen hotel.'
    }
    if (input.includes('child') || input.includes('kid') || input.includes('family') || input.includes('baby')) {
      return 'Family-friendly services include: connecting rooms, cribs, high chairs, babysitting, kids activities, children\'s menus, and family packages. Many hotels offer kids clubs and family entertainment. We make family travel easy and enjoyable!'
    }
    if (input.includes('accessible') || input.includes('disability') || input.includes('wheelchair')) {
      return 'We ensure accessibility with: wheelchair-accessible rooms, elevators, ramps, accessible bathrooms, visual/hearing assistance, and mobility equipment. Contact us in advance to arrange specific accommodations. Your comfort is our priority.'
    }
    
    // SAFETY & SECURITY
    if (input.includes('safe') || input.includes('security') || input.includes('covid') || input.includes('hygiene')) {
      return 'Your safety is paramount! We maintain: enhanced cleaning protocols, contactless check-in, 24/7 security, secure payment systems, data privacy protection, and health safety measures. All hotels meet international safety standards.'
    }
    
    // THANK YOU & GOODBYE
    if (input.includes('thank') || input.includes('thanks')) {
      return 'You\'re very welcome! It\'s my pleasure to assist you. If you have any other questions or need help with bookings, feel free to ask anytime. Enjoy your luxury experience with The Grand Stay! 🏨✨'
    }
    if (input.includes('bye') || input.includes('goodbye')) {
      return 'Goodbye! Thank you for choosing The Grand Stay. I\'m here 24/7 whenever you need assistance. Have a wonderful day and we look forward to serving you soon! 👋'
    }
    
    // DEFAULT RESPONSE
    return 'I can help you with: 🏨 Hotels & Bookings, 👑 Membership & Rewards, 🎉 Events & Celebrations, ✈️ Travel Services, 🍽️ Dining Experiences, 💆 Wellness & Spa, 🎭 Entertainment, 👔 Business Services, 🛍️ Shopping & Styling, and more! What would you like to know?'
  }

  const handleSend = () => {
    if (!input.trim()) return
    
    const userMessage = input
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setInput('')
    
    setTimeout(() => {
      const response = getAIResponse(userMessage)
      if (response) {
        setMessages(prev => [...prev, { type: 'ai', text: response }])
      }
    }, 800)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(251, 191, 36, 0.4)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '120px',
          right: '30px',
          width: '350px',
          height: '500px',
          background: 'rgba(0, 0, 0, 0.95)',
          borderRadius: '20px',
          border: '2px solid #fbbf24',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
            color: '#1a1a2e',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            🏨 Luxury Concierge AI
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                background: msg.type === 'user' 
                  ? 'linear-gradient(45deg, #3b82f6, #1d4ed8)' 
                  : 'rgba(251, 191, 36, 0.1)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '18px',
                maxWidth: '80%',
                fontSize: '14px',
                border: msg.type === 'ai' ? '1px solid rgba(251, 191, 36, 0.3)' : 'none'
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div style={{
            padding: '10px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(reply)
                  setTimeout(() => {
                    setMessages(prev => [...prev, { type: 'user', text: reply }])
                    setTimeout(() => {
                      const response = getAIResponse(reply)
                      if (response) {
                        setMessages(prev => [...prev, { type: 'ai', text: response }])
                      }
                    }, 800)
                    setInput('')
                  }, 100)
                }}
                style={{
                  background: 'rgba(251, 191, 36, 0.2)',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  color: '#fbbf24',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '20px',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '12px',
                color: 'white',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                cursor: 'pointer',
                color: '#1a1a2e',
                fontWeight: 'bold'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}