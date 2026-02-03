// App.js
import React from "react";
import "./index.css";
import { Route, Routes, useLocation } from "react-router-dom";

// Customer Pages
import HomePage from "./pages/customer/Home/HomePage";
import SalonList from "./pages/customer/Salons/SalonList";
import SalonDetails from "./pages/customer/Salons/SalonDetails";
import CartPage from "./pages/customer/Cart/CartPage";
import BookingConfirmation from "./pages/customer/BookingPage/BookingConfirmation";
import ProfilePage from "./pages/customer/Profile/ProfilePage";
import PaymentPage from "./pages/customer/Payment/PaymentPage";
import MyBookings from "./pages/customer/BookingPage/MyBookings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Owner Pages
import RegisterSalon from "./pages/owner/RegisterSalon";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import MySalons from "./pages/owner/MySalons";
import SalonDetailsOwner from "./pages/owner/SalonDetails";
import EditSalon from "./pages/owner/EditSalon";
import OwnerProfile from "./pages/owner/OwnerProfile";

// Auth Pages
import Login from "./pages/auth/Login/Login";
import OwnerRegister from "./pages/auth/OwnerRegistration/OwnerRegister";
import CustomerRegister from "./pages/auth/CustomerRegistration/CustomerRegister";

// Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import PageNotFound from "../src/utils/PageNotFound";

function App() {
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/cart" ||
    location.pathname === "/confirmBooking" ||
    location.pathname === "/registerCustomer" ||
    location.pathname === "/registerOwner" ||
    location.pathname.startsWith("/owner/") ||
    location.pathname.startsWith("/admin/")
    ;

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
        <Route path="/confirmBooking" element={<BookingConfirmation />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/bookings" element={<PaymentPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Owner Routes */}
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/my-salons" element={<MySalons />} />
        <Route path="/owner/add-salon" element={<RegisterSalon />} />
        <Route path="/owner/salon/:salonId" element={<SalonDetailsOwner />} />
        <Route path="/owner/edit-salon/:salonId" element={<EditSalon />} />
        <Route path="/owner/bookings" element={<OwnerBookings />} />
        <Route path="/owner/profile" element={<OwnerProfile />} />
        <Route path="/owner/register" element={<RegisterSalon />} />

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {!isAuthRoute && <Footer />}
    </>
  );
}

export default App;
