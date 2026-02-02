// index.js
import './index.css';
import { Route, Routes, useLocation } from 'react-router-dom'; 

// Customer Pages
import HomePage from './pages/customer/Home/HomePage';
import SalonList from './pages/customer/Salons/SalonList';
import SalonDetails from './pages/customer/Salons/SalonDetails';
import CartPage from './pages/customer/Cart/CartPage';
import BookingConfirmation from './pages/customer/BookingPage/BookingConfirmation';
import ProfilePage from './pages/customer/Profile/ProfilePage';
import PaymentPage from './pages/customer/Payment/PaymentPage';
import MyBookingsPage from './pages/customer/BookingPage/MyBookings';
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Owner Pages
import RegisterSalon from './pages/owner/RegisterSalon';
import OwnerBookings from './pages/owner/OwnerBookings';

// Auth Pages
import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import PageNotFound from "../src/utils/PageNotFound";
import OwnerRegister from './pages/auth/OwnerRegistration/OwnerRegister';
import CustomerRegister from './pages/auth/CustomerRegistration/CustomerRegister';
import MyBookings from './pages/customer/BookingPage/MyBookings';
function App() {
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register" ||location.pathname === "/cart" || location.pathname === "/confirmBooking" || location.pathname === "/registerCustomer" || location.pathname === "/registerOwner";

  return (
    <>
      {!isAuthRoute && <Navbar />}

      <Routes>
      {/* Public Routes */}
       <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerCustomer" element={<CustomerRegister />} />
        <Route path="/salonList" element={<SalonList />} />
        <Route path="/salons/:salonId" element={<SalonDetails />} />
        <Route path="/salons" element={<SalonList />} />
        <Route path="/registerOwner" element={<OwnerRegister />} />


       {/* Customer Routes */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/confirmBooking" element={<BookingConfirmation/>}/>
        <Route path="/my-bookings" element={<MyBookings/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/bookings" element={<PaymentPage/>} />
         {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Owner Routes */}
        <Route path="/owner/register" element={<RegisterSalon />} />
        <Route path="/owner/bookings" element={<OwnerBookings />} />
        
        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {!isAuthRoute && <Footer />}
    </>
  );
}

export default App;
