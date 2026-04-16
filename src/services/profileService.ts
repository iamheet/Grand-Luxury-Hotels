import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  emailVerified: boolean
  phoneVerified: boolean
  isMember: boolean
  membershipTier?: string
  membershipId?: string
  points: number
  membershipDate?: string
  createdAt: string
}

export interface Booking {
  id: string
  type: string
  hotelId?: string
  hotelName?: string
  roomTitle?: string
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  nights?: number
  price?: number
  total: number
  hotelTotal?: number
  aircraftTotal?: number
  carTotal?: number
  travelTotal?: number
  diningTotal?: number
  entertainmentTotal?: number
  chefTotal?: number
  wineTotal?: number
  ticketTotal?: number
  eventTotal?: number
  status: string
  paymentStatus: string
  paymentMethod?: string
  bookingType?: string
  memberTier?: string
  bookingDate: string
  createdAt: string
  room?: any
  aircraft?: any
  car?: any
  travel?: any
  services?: any[]
  guest?: any
  member?: any
}

export interface ProfileStats {
  totalBookings: number
  totalSpent: number
  confirmedBookings: number
  pendingBookings: number
}

export interface ProfileData {
  user: User
  bookings: Booking[]
  stats: ProfileStats
}

export interface ProfileResponse {
  success: boolean
  data: ProfileData
  message?: string
}

export const profileService = {
  // Get user profile with all bookings
  async getProfile(): Promise<ProfileData> {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.get<ProfileResponse>(API_ENDPOINTS.profile, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch profile data')
      }

      return response.data.data
    } catch (error: any) {
      console.error('Profile fetch error:', error)
      
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        throw new Error('Session expired. Please login again.')
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch profile data')
    }
  },

  // Update user profile
  async updateProfile(data: { name: string; phone?: string }): Promise<User> {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.put<{ success: boolean; data: { user: User }; message?: string }>(
        API_ENDPOINTS.profile,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update profile')
      }

      return response.data.data.user
    } catch (error: any) {
      console.error('Profile update error:', error)
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        throw new Error('Session expired. Please login again.')
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to update profile')
    }
  },

  // Get specific booking details
  async getBooking(bookingId: string): Promise<Booking> {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.get<{ success: boolean; data: Booking; message?: string }>(
        `${API_ENDPOINTS.profile}/booking/${bookingId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch booking details')
      }

      return response.data.data
    } catch (error: any) {
      console.error('Booking fetch error:', error)
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        throw new Error('Session expired. Please login again.')
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch booking details')
    }
  }
}