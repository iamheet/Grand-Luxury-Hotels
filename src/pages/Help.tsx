import { useState, useRef } from 'react'

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

const defaultQuestions = [
  "How do I make a reservation?",
  "What are your cancellation policies?", 
  "Do you offer room service?",
  "What amenities are included?",
  "How can I modify my booking?",
  "What payment methods do you accept?"
]

const responses: Record<string, string> = {
  "How do I make a reservation?": "You can make a reservation by visiting our Search page, selecting your dates and preferences, then following the booking process. You'll need to create an account or log in to complete your reservation.",
  "What are your cancellation policies?": "Our cancellation policy varies by rate and hotel. Generally, you can cancel up to 24-48 hours before check-in for a full refund. Premium rates may have stricter policies.",
  "Do you offer room service?": "Yes! Most of our luxury hotels offer 24/7 room service with gourmet dining options. Room service menus and hours vary by property.",
  "What amenities are included?": "Our hotels feature premium amenities including spa services, fitness centers, fine dining restaurants, concierge services, and complimentary Wi-Fi. Specific amenities vary by property.",
  "How can I modify my booking?": "You can modify your booking by logging into your account and accessing your reservations, or by contacting our customer service team directly.",
  "What payment methods do you accept?": "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Payment is typically required at the time of booking."
}

export default function Help() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm here to help you with any questions about The Grand Stay. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatMessagesRef = useRef<HTMLDivElement>(null)

  const handleQuestionClick = (question: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: question,
      isUser: true,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: responses[question] || "Thank you for your question. Our customer service team will get back to you shortly with a detailed response.",
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
      
      setTimeout(() => {
        chatMessagesRef.current?.scrollTo({
          top: chatMessagesRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }, 100)
    }, 1500)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    }

    const currentInput = inputText
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    setTimeout(() => {
      const matchedResponse = Object.entries(responses).find(([key]) => 
        currentInput.toLowerCase().includes(key.toLowerCase().split(' ')[0])
      )

      const botResponse: Message = {
        id: Date.now() + 1,
        text: matchedResponse ? matchedResponse[1] : "I'm sorry, but I'm not trained to answer that specific question. Please try one of the quick questions above or contact our customer service team for personalized assistance.",
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-lg text-gray-600">Get instant answers to your questions</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[var(--color-brand-navy)] via-blue-700 to-indigo-700 text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Grand Stay Assistant</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-blue-100">Online • Ready to help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[var(--color-brand-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h4 className="font-semibold text-gray-800">Quick Questions</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {defaultQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="group text-left p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-[var(--color-brand-gold)] hover:bg-gradient-to-r hover:from-[var(--color-brand-gold)]/5 hover:to-yellow-50 transition-all duration-300 text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[var(--color-brand-navy)] rounded-full mt-2 group-hover:bg-[var(--color-brand-gold)] transition-colors"></div>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900">{question}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={chatMessagesRef} className="h-96 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="flex flex-col max-w-xs lg:max-w-md">
                  <div
                    className={`px-5 py-3 rounded-2xl shadow-sm ${
                      message.isUser
                        ? 'bg-gradient-to-r from-[var(--color-brand-navy)] to-blue-700 text-white rounded-br-md'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <p className={`text-xs mt-2 px-2 ${
                    message.isUser ? 'text-gray-500 text-right' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-brand-navy)] to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-end gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-brand-gold)] to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[var(--color-brand-navy)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col max-w-xs lg:max-w-md">
                  <div className="px-5 py-3 rounded-2xl shadow-sm bg-white border border-gray-200 text-gray-800 rounded-bl-md">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                  <p className="text-xs mt-2 px-2 text-gray-400">Typing...</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-6 border-t bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)] focus:border-[var(--color-brand-navy)] transition-all duration-200 bg-white shadow-sm text-sm"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="px-8 py-4 bg-gradient-to-r from-[var(--color-brand-navy)] to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="font-medium">{isTyping ? 'Wait...' : 'Send'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Additional Help Options */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm mb-3">Speak with our customer service team</p>
            <p className="font-medium text-[var(--color-brand-navy)]">+1 (555) 123-4567</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-3">Send us a detailed message</p>
            <p className="font-medium text-[var(--color-brand-navy)]">support@grandstay.com</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm mb-3">We're here to help anytime</p>
            <p className="font-medium text-[var(--color-brand-navy)]">Always Available</p>
          </div>
        </div>
      </div>
    </div>
  )
}