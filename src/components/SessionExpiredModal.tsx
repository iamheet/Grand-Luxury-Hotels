import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * HOW TO USE:
 * 1. Render <SessionExpiredManager /> ONCE at app root (App.tsx)
 * 2. Call window.triggerSessionExpired() when API returns 401/403
 */

declare global {
  interface Window {
    triggerSessionExpired: () => void
  }
}

export default function SessionExpiredManager() {
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [userType, setUserType] = useState<'admin' | 'user'>('user')

  /* 🔥 REGISTER GLOBAL TRIGGER */
  useEffect(() => {
    window.triggerSessionExpired = () => {
      // 🚨 CAPTURE ROLE BEFORE STORAGE IS CLEARED
      const role: 'admin' | 'user' =
        localStorage.getItem('adminToken') ||
        localStorage.getItem('adminAuth') === 'true'
          ? 'admin'
          : 'user'

      setUserType(role)
      setIsOpen(true)
    }

    return () => {
      delete window.triggerSessionExpired
    }
  }, [])

  /* ⏳ COUNTDOWN LOGIC */
  useEffect(() => {
    if (!isOpen) return

    setCountdown(10)

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleReLogin()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  /* 🧹 CLEAR AUTH */
  const clearAuthData = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('user')
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminType')
    localStorage.removeItem('subAdminData')
    localStorage.removeItem('currentHotel')
  }

  /* 🔁 REDIRECT */
  const handleReLogin = () => {
    clearAuthData()
    setIsOpen(false)

    if (userType === 'admin') {
      navigate('/admin-login')
    } else {
      navigate('/login')
    }
  }

  const handleGoHome = () => {
    clearAuthData()
    setIsOpen(false)
    navigate('/')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Session Expired
          </h2>

          <p className="mb-5 text-gray-600">
            Your session expired for security reasons.
            Please log in again.
          </p>

          <div className="mb-5 rounded-lg bg-orange-50 border border-orange-200 p-3 text-sm text-orange-700">
            Redirecting in <b>{countdown}</b> seconds
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReLogin}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-2.5 text-white transition-all hover:scale-105 hover:shadow-lg"
            >
              Login Now
            </button>

            <button
              onClick={handleGoHome}
              className="flex-1 rounded-lg bg-gray-100 py-2.5 text-gray-700 hover:bg-gray-200"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
