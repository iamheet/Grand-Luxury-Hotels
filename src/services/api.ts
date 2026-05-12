import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// The interceptors from auth.ts will automatically add Bearer tokens
export default api