import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookingService = {
  // Get all user bookings
  getMyBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export const authService = {
  // Register regular user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user or exclusive member
  login: async (loginData) => {
    try {
      const response = await api.post('/auth/login', loginData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  }
};

export const memberService = {
  // Register exclusive member
  registerMember: async (memberData) => {
    try {
      const response = await api.post('/members/register', memberData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Example usage functions
export const exampleUsage = {
  // Example: Register and create booking
  registerAndBook: async () => {
    try {
      // 1. Register user
      const user = await authService.register({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone: "+1234567890"
      });

      // 2. Create booking
      const booking = await bookingService.createBooking({
        hotelId: "hotel123",
        hotelName: "Grand Hotel",
        location: "New York",
        checkIn: "2024-01-15",
        checkOut: "2024-01-20",
        guests: 2,
        price: 500
      });

      console.log('Booking created:', booking);
      return booking;
    } catch (error) {
      console.error('Error:', error);
    }
  },

  // Example: Login exclusive member and book
  exclusiveMemberBook: async () => {
    try {
      // 1. Login as exclusive member
      const member = await authService.login({
        membershipId: "GS123456",
        password: "password123",
        isExclusive: true
      });

      // 2. Create booking
      const booking = await bookingService.createBooking({
        hotelId: "luxury-suite-001",
        hotelName: "Luxury Grand Suite",
        location: "Beverly Hills",
        checkIn: "2024-02-01",
        checkOut: "2024-02-05",
        guests: 2,
        price: 1200
      });

      console.log('Exclusive booking created:', booking);
      return booking;
    } catch (error) {
      console.error('Error:', error);
    }
  },

  // Example: Get and display bookings
  displayMyBookings: async () => {
    try {
      const data = await bookingService.getMyBookings();
      console.log(`You have ${data.count} bookings:`);
      
      data.bookings.forEach((booking, index) => {
        console.log(`${index + 1}. ${booking.hotelName} - ${booking.bookingType}`);
        console.log(`   Location: ${booking.location}`);
        console.log(`   Dates: ${booking.checkIn} to ${booking.checkOut}`);
        console.log(`   Status: ${booking.status}`);
        if (booking.memberTier) {
          console.log(`   Member Tier: ${booking.memberTier}`);
        }
        console.log('---');
      });
      
      return data.bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }
};

export default { bookingService, authService, memberService, exampleUsage };