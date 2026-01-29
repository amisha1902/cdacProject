// import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom'; 

import HomePage from './pages/customer/Home/HomePage';
import Navbar from './components/Navbar/Navbar';
// import Footer from './components/Footer/Footer';
// import SalonList from './pages/customer/SalonList/SalonList';
// import SalonDetails from './pages/customer/SalonDetailPage/SalonDetailPage';
// import ProfilePage from './pages/customer/Profile/ProfilePage';
// import './App.css'
// import Register from './pages/auth/Register/Register'
import CartPage from './pages/customer/Cart/CartPage';
// import AdminDashboard from './pages/owner/AdminDashboard';
// import RegisterSalon from './pages/owner/RegisterSalon';
// import Login from './pages/auth/Login/Login';
// import PageNotFound from './pages/PageNotFound';
// import MyBookingsPage from './pages/customer/MyBookings/MyBookingsPage';
// import PaymentPage from './pages/customer/Payment/PaymentPage'
// import RatingPage from './pages/customer/Rating/RatingPage';
// import "./App.css";
// import BookingPage from "./pages/customer/BookingForm/BookingPage";
import BookingConfirmation from './pages/customer/BookingPage/BookingConfirmation';
import SalonList from './pages/customer/Salons/SalonList';
import SalonDetails from './pages/customer/Salons/SalonDetails';
import Footer from './components/Footer/Footer';

function App() {
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuthRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/salons" element={<SalonList />} />
        <Route path="/salons/:salonId" element={<SalonDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/confirmBooking" element={<BookingConfirmation/>}/>
        
      </Routes>

      {!isAuthRoute && <Footer />}
    </>
  );
}

export default App;
