import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom'; 

import HomePage from './pages/customer/Home/HomePage';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import SalonList from './pages/customer/SalonList/SalonList';
import SalonDetails from './pages/customer/SalonDetailPage/SalonDetailPage';
import ProfilePage from './pages/customer/Profile/ProfilePage';
import './App.css'
import Register from './pages/auth/Register/Register'
import CartPage from './pages/customer/Cart/CartPage';
import AdminDashboard from './pages/owner/AdminDashboard';
import RegisterSalon from './pages/owner/RegisterSalon';
import Login from './pages/auth/Login/Login';
import PageNotFound from './pages/PageNotFound';
import MyBookingsPage from './pages/customer/MyBookings/MyBookingsPage';
import PaymentPage from './pages/customer/Payment/PaymentPage'
import RatingPage from './pages/customer/Rating/RatingPage';
import "./App.css";
import BookingPage from "./pages/customer/BookingForm/BookingPage";

function App() {
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuthRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/salonList" element={<SalonList />} />
        <Route path="/salon/:id" element={<SalonDetails />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />


          
          <Route path='/myBookings'
          element={<MyBookingsPage/>}/>
          <Route path='/payment'
          element={<PaymentPage/>}/>
          <Route path='/rating'
          element={<RatingPage/>}/>
        <Route path="/register_salon" element={<RegisterSalon />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {!isAuthRoute && <Footer />}
    </>
  );
}

export default App;
