import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import trainingData from './hotel-training-data.json'

export default function Chatbot() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingDetails, setBookingDetails] = useState({ city: '', checkIn: '', checkOut: '', guests: 1 })
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([])
  const [showGames, setShowGames] = useState(false)
  const navigate = useNavigate()

  const callAI = async (userQuestion: string) => {
    const googleKeys = [
      import.meta.env.VITE_GOOGLE_API_KEY,
      import.meta.env.VITE_GOOGLE_API_KEY_MEMBER,
      import.meta.env.VITE_GOOGLE_API_KEY_3,
      import.meta.env.VITE_GOOGLE_API_KEY_4,
      import.meta.env.VITE_GOOGLE_API_KEY_5
    ].filter(key => key && key !== 'your_google_gemini_api_key_here').sort(() => Math.random() - 0.5)
    
    // Build conversation history for context
    const conversationContext = chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
    const fullPrompt = conversationContext ? `${conversationContext}\nUser: ${userQuestion}` : userQuestion
    
    // Dynamic token allocation based on question complexity
    const lowerQuestion = userQuestion.toLowerCase()
    let maxTokens = 2000 // default
    
    if (lowerQuestion.match(/\b(hi|hello|hey|bye|thanks|yes|no|ok)\b/) && lowerQuestion.split(' ').length < 5) {
      maxTokens = 500 // simple greeting/response
    } else if (lowerQuestion.match(/\b(itinerary|plan|detailed|complete|full|day by day|week|days|tour|trip)\b/) || lowerQuestion.length > 100) {
      maxTokens = 8000 // complex detailed request
    } else if (lowerQuestion.match(/\b(list|all|multiple|several|many|various)\b/)) {
      maxTokens = 4000 // medium-complex list request
    }
    
    // Try each Google API key until one works
    for (const googleKey of googleKeys) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${googleKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are Emma, a friendly and professional luxury hotel concierge at The Grand Stay. Speak naturally like a real person - use casual language, contractions (I'm, you're, we'll), and be warm and conversational. Don't be overly formal or robotic. Show personality and empathy. If asked about itineraries, provide detailed day-by-day plans. For hotel questions, give thorough but friendly descriptions. Remember the conversation context and refer back to it naturally. Never say you're an AI - you're Emma, the concierge. Previous conversation: ${fullPrompt}` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens }
          })
        })
        if (response.ok) {
          const data = await response.json()
          let aiResponse = data.candidates[0]?.content?.parts[0]?.text || 'I can help you with bookings and hotel information.'
          
          // Try continuation with remaining keys if response was cut off
          if (aiResponse.length > 7000 || !aiResponse.match(/[.!?]\s*$/)) {
            const remainingKeys = googleKeys.filter(k => k !== googleKey)
            for (const continueKey of remainingKeys) {
              try {
                const continueResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${continueKey}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: `Continue this response naturally from where it left off. Previous context: "...${aiResponse.slice(-500)}"` }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 8000 }
                  })
                })
                if (continueResponse.ok) {
                  const continueData = await continueResponse.json()
                  const continuation = continueData.candidates[0]?.content?.parts[0]?.text || ''
                  aiResponse = aiResponse + '\n' + continuation
                  if (continuation.match(/[.!?]\s*$/)) break
                }
              } catch (error) {}
            }
          }
          
          return aiResponse
        } else if (response.status === 429) {
          alert('⚠️ API rate limit hit! Rotating to next key...')
        }
      } catch (error) {
        console.warn('API call failed, trying next key...')
      }
    }

    // Fallback to local data
    const result = trainingData.find(item => {
      const itemQ = item.question.toLowerCase()
      return itemQ.includes(userQuestion.toLowerCase()) || userQuestion.toLowerCase().split(' ').some(word => word.length > 3 && itemQ.includes(word))
    })
    return result?.answer || 'I can help you book rooms, check amenities, or answer questions about The Grand Stay.'
  }

  const handleAutoBook = () => {
    const user = localStorage.getItem('user')
    if (!user) {
      setAnswer('Please log in first to complete the booking.')
      setTimeout(() => navigate('/login'), 1500)
      return
    }

    const booking = {
      id: Date.now(),
      hotel: `Grand Hotel ${bookingDetails.city}`,
      location: bookingDetails.city,
      checkIn: bookingDetails.checkIn,
      checkOut: bookingDetails.checkOut,
      guests: bookingDetails.guests,
      price: Math.floor(Math.random() * 300) + 200,
      status: 'confirmed'
    }

    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    existingBookings.push(booking)
    localStorage.setItem('bookings', JSON.stringify(existingBookings))

    setAnswer(`✅ Booking confirmed! ${booking.hotel} for ${bookingDetails.guests} guest(s) from ${bookingDetails.checkIn} to ${bookingDetails.checkOut}. Total: $${booking.price}`)
    setShowBookingForm(false)
    setTimeout(() => navigate('/my-bookings'), 2000)
  }

  const handleAsk = async () => {
    if (!question.trim()) return
    
    setLoading(true)
    const q = question.toLowerCase().trim()
    
    // Check for booking intent
    if (q.includes('book')) {
      const cities = ['paris', 'london', 'tokyo', 'new york', 'dubai', 'singapore', 'rome', 'barcelona']
      const foundCity = cities.find(city => q.includes(city))
      
      if (foundCity) {
        setBookingDetails({ ...bookingDetails, city: foundCity.charAt(0).toUpperCase() + foundCity.slice(1) })
        setShowBookingForm(true)
        setAnswer(`Great! Let me help you book a room in ${foundCity.charAt(0).toUpperCase() + foundCity.slice(1)}. Please fill in the details below:`)
        setLoading(false)
        return
      }
    }
    
    // Use AI for dynamic responses
    const aiResponse = await callAI(question)
    console.log('AI Response:', aiResponse)
    
    // Update chat history
    setChatHistory([...chatHistory, { role: 'User', content: question }, { role: 'Assistant', content: aiResponse }])
    
    setAnswer(aiResponse)
    setQuestion('') // Clear input
    setLoading(false)
    
    // Handle navigation based on response
    if (q.includes('cancel')) {
      setTimeout(() => navigate('/my-bookings'), 2000)
    } else if (q.includes('view') || q.includes('my booking')) {
      setTimeout(() => navigate('/my-bookings'), 1500)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[var(--color-brand-gold)] to-amber-600 text-white p-5 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform duration-300 group"
      >
        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
      {/* <button
        onClick={() => setShowGames(!showGames)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform duration-300 group"
        title="Games"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
        </svg>
      </button> */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-2xl p-6 w-96 z-50 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              Chat with Emma
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!showBookingForm ? (
            <>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="Ask me anything about your stay..."
                className="w-full border-2 border-gray-200 p-3 rounded-xl mb-3 focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors"
              />
              <button onClick={handleAsk} disabled={loading} className="w-full bg-gradient-to-r from-[var(--color-brand-gold)] to-amber-600 text-white p-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50">
                {loading ? 'Thinking...' : 'Ask Question'}
              </button>
              <div className="mt-4 h-72 overflow-auto bg-blue-50 border-l-4 border-[var(--color-brand-gold)] rounded-lg p-4">
                <div className="text-sm text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: (answer || 'Hi there! I\'m Emma, your personal concierge at The Grand Stay. How can I help make your stay extraordinary today? 😊') }} />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">City</label>
                <input
                  type="text"
                  value={bookingDetails.city}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, city: e.target.value })}
                  className="w-full border-2 border-gray-200 p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={bookingDetails.checkIn}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, checkIn: e.target.value })}
                  className="w-full border-2 border-gray-200 p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={bookingDetails.checkOut}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, checkOut: e.target.value })}
                  className="w-full border-2 border-gray-200 p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Guests</label>
                <input
                  type="number"
                  min="1"
                  value={bookingDetails.guests}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, guests: parseInt(e.target.value) })}
                  className="w-full border-2 border-gray-200 p-2 rounded-lg"
                />
              </div>
              <button
                onClick={handleAutoBook}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Complete Booking
              </button>
              <button
                onClick={() => setShowBookingForm(false)}
                className="w-full bg-gray-200 text-gray-700 p-2 rounded-xl font-semibold"
              >
                Cancel
              </button>
              {answer && (
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-[var(--color-brand-gold)] rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">{answer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {showGames && (
        <div className="fixed bottom-24 left-6 bg-gradient-to-br from-purple-900 to-pink-900 shadow-2xl rounded-2xl p-6 w-80 z-50 border-2 border-purple-400">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              Mini Games
            </h3>
            <button onClick={() => setShowGames(false)} className="text-white/70 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-white text-sm mb-4">
            <button
              onClick={() => navigate('/games')}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
            >
              🐍 Play Snake Game
            </button>
          </div>
          <div className="text-white/60 text-xs">
            More games will be added here for your entertainment during your stay.
          </div>
        </div>
      )}
    </>
  )
}
