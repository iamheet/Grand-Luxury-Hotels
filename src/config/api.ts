export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://thegrandstay.azurewebsites.net/api'
  : 'http://localhost:5000/api'
export const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'https://thegrandstay.azurewebsites.net'
  : 'http://localhost:5000'

export const API_ENDPOINTS = {
  bookings: `${API_BASE_URL}/bookings`,
  auth: `${API_BASE_URL}/auth`,
  members: `${API_BASE_URL}/members`,
  hotels: `${API_BASE_URL}/hotels`,
  profile: `${API_BASE_URL}/profile`,
}
