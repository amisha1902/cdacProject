import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaStore, FaPlusCircle, FaCalendarAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './OwnerNavbar.css';

const OwnerNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="owner-navbar">
      <div className="owner-navbar-header">
        <h2>Owner Panel</h2>
        <p>Manage your salons</p>
      </div>
      
      <nav className="owner-nav-links">
        <Link 
          to="/owner/dashboard" 
          className={`nav-link ${isActive('/owner/dashboard') ? 'active' : ''}`}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/owner/my-salons" 
          className={`nav-link ${isActive('/owner/my-salons') ? 'active' : ''}`}
        >
          <FaStore />
          <span>My Salons</span>
        </Link>
        
        <Link 
          to="/owner/add-salon" 
          className={`nav-link ${isActive('/owner/add-salon') ? 'active' : ''}`}
        >
          <FaPlusCircle />
          <span>Add New Salon</span>
        </Link>
        
        <Link 
          to="/owner/bookings" 
          className={`nav-link ${isActive('/owner/bookings') ? 'active' : ''}`}
        >
          <FaCalendarAlt />
          <span>Salon Bookings</span>
        </Link>
        
        <Link 
          to="/owner/profile" 
          className={`nav-link ${isActive('/owner/profile') ? 'active' : ''}`}
        >
          <FaUser />
          <span>My Profile</span>
        </Link>
      </nav>
      
      <div className="owner-navbar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default OwnerNavbar;
