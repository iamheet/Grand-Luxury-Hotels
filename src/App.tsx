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
import MemberChat from './pages/MemberChat'
import ConciergeEmail from './pages/ConciergeEmail'
import RoyalRewards from './pages/RoyalRewards'
import DiningReservations from './pages/DiningReservations'
import Entertainment from './pages/Entertainment'
import PrivateChef from './pages/PrivateChef'
import WineCellar from './pages/WineCellar'
import TheaterTickets from './pages/TheaterTickets'
import PrivateEvents from './pages/PrivateEvents'
import LuxuryWedding from './pages/LuxuryWedding'
import BirthdayCelebration from './pages/BirthdayCelebration'
import AnniversaryDinner from './pages/AnniversaryDinner'
import ProductLaunch from './pages/ProductLaunch'
import CharityFundraiser from './pages/CharityFundraiser'
import CorporateGala from './pages/CorporateGala'
import WellnessSpa from './pages/WellnessSpa'
import PersonalTrainer from './pages/PersonalTrainer'
import MedicalServices from './pages/MedicalServices'
import BeautyGrooming from './pages/BeautyGrooming'
import PersonalShopping from './pages/PersonalShopping'
import RedCarpetStyling from './pages/RedCarpetStyling'
import BusinessServices from './pages/BusinessServices'
import CorporateEvent from './pages/CorporateEvent'
import ExecutiveMeetingRooms from './pages/ExecutiveMeetingRooms'
import BusinessTravelConcierge from './pages/BusinessTravelConcierge'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import NormalHotelsDashboard from './pages/NormalHotelsDashboard'

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
        <Route path="/member-chat" element={<MemberChat />} />
        <Route path="/concierge-email" element={<ConciergeEmail />} />
        <Route path="/royal-rewards" element={<RoyalRewards />} />
        <Route path="/dining-reservations" element={<DiningReservations />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/private-chef" element={<PrivateChef />} />
        <Route path="/wine-cellar" element={<WineCellar />} />
        <Route path="/theater-tickets" element={<TheaterTickets />} />
        <Route path="/private-events" element={<PrivateEvents />} />
        <Route path="/luxury-wedding" element={<LuxuryWedding />} />
        <Route path="/birthday-celebration" element={<BirthdayCelebration />} />
        <Route path="/anniversary-dinner" element={<AnniversaryDinner />} />
        <Route path="/product-launch" element={<ProductLaunch />} />
        <Route path="/charity-fundraiser" element={<CharityFundraiser />} />
        <Route path="/corporate-gala" element={<CorporateGala />} />
        <Route path="/wellness-spa" element={<WellnessSpa />} />
        <Route path="/personal-trainer" element={<PersonalTrainer />} />
        <Route path="/medical-services" element={<MedicalServices />} />
        <Route path="/beauty-grooming" element={<BeautyGrooming />} />
        <Route path="/personal-shopping" element={<PersonalShopping />} />
        <Route path="/red-carpet-styling" element={<RedCarpetStyling />} />
        <Route path="/business-services" element={<BusinessServices />} />
        <Route path="/corporate-event" element={<CorporateEvent />} />
        <Route path="/executive-meeting-rooms" element={<ExecutiveMeetingRooms />} />
        <Route path="/business-travel-concierge" element={<BusinessTravelConcierge />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/normal-hotels-dashboard" element={<NormalHotelsDashboard />} />
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


