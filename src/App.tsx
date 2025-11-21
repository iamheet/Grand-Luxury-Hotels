import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import HotelDetails from './pages/HotelDetails'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Checkout from './pages/Checkout'
import BookingSuccess from './pages/BookingSuccess'
import Membership from './pages/Membership'
import Help from './pages/Help'
import MemberLogin from './pages/MemberLogin'
import MemberDashboard from './pages/MemberDashboard'
import MemberCheckout from './pages/MemberCheckout'
import MembershipPayment from './pages/MembershipPayment'
import MembershipSuccess from './pages/MembershipSuccess'
import MyBookings from './pages/MyBookings'
import RoyalConcierge from './pages/RoyalConcierge'
import AircraftBooking from './pages/AircraftBooking'
import CarRental from './pages/CarRental'
import TravelServices from './pages/TravelServices'
import AirportVIP from './pages/AirportVIP'
import YachtCharter from './pages/YachtCharter'
import TravelPlanning from './pages/TravelPlanning'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/member-login" element={<MemberLogin />} />
        <Route path="/member-dashboard" element={<MemberDashboard />} />
        <Route path="/member-checkout" element={<MemberCheckout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/royal-concierge" element={<RoyalConcierge />} />
        <Route path="/aircraft-booking" element={<AircraftBooking />} />
        <Route path="/car-rental" element={<CarRental />} />
        <Route path="/travel-services" element={<TravelServices />} />
        <Route path="/airport-vip" element={<AirportVIP />} />
        <Route path="/yacht-charter" element={<YachtCharter />} />
        <Route path="/travel-planning" element={<TravelPlanning />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="hotel/:id" element={<HotelDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="booking-success" element={<BookingSuccess />} />
          <Route path="membership" element={<Membership />} />
          <Route path="membership-payment" element={<MembershipPayment />} />
          <Route path="membership-success" element={<MembershipSuccess />} />
          <Route path="help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


