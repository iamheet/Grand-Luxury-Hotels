import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

declare global {
  interface Window {
    triggerSessionExpired?: () => void
  }
}

export const checkTokenExpiry = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
  if (!token) return false

  try {
    // Decode JWT token to check expiry
    const payload = jwtDecode(token)
    const currentTime = Date.now() / 1000
    
    // Check if token is expired (with 5 minute buffer)
    return payload.exp < (currentTime + 300)
  } catch (error) {
    return true // If can't decode, consider expired
  }
}

const getRedirectPath = () => {
  const currentPath = window.location.pathname
  const isAdmin = localStorage.getItem('adminAuth') === 'true' || localStorage.getItem('adminToken')
  
  // Check if user is admin or on admin pages
  if (isAdmin || currentPath.includes('/admin-dashboard') || currentPath.includes('/admin-login') || currentPath.includes('/subadmin-dashboard')) {
    return '/admin-login'
  }
  
  // Check if user is exclusive member
  if (localStorage.getItem('isExclusiveMember') === 'true') {
    return '/login' // Exclusive member login tab
  }
  
  // Default to normal login
  return '/login'
}

export const setupAxiosInterceptors = () => {
  // Request interceptor to add token
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor to handle 401/403 errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Trigger session expired modal
        window.triggerSessionExpired?.()
      }
      return Promise.reject(error)
    }
  )
}

export const validateToken = async (): Promise<boolean> => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
  if (!token) return false

  try {
    const response = await axios.get('https://thegrandstay.azurewebsites.net/api/auth/validate-token')
    return response.data.valid
  } catch (error) {
    return false
  }
}