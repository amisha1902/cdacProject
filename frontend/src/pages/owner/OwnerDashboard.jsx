import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaCalendarCheck, FaMoneyBillWave, FaStar, FaSyncAlt } from 'react-icons/fa';
import OwnerNavbar from '../../components/OwnerNavbar/OwnerNavbar';
import { getOwnerDashboardStats } from '../../services/ownerService';
import './OwnerDashboard.css';
import notify from '../../utils/notify';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSalons: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    recentBookings: [],
    topSalons: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchDashboardStats(true); // Silent refresh
    }, 30000);
    
    // Listen for booking updates
    const handleBookingUpdate = () => {
      fetchDashboardStats(true);
    };
    window.addEventListener('bookingUpdated', handleBookingUpdate);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('bookingUpdated', handleBookingUpdate);
    };
  }, []);

  const fetchDashboardStats = async (silent = false) => {
    if (!silent) {
      setRefreshing(true);
    }
    try {
      const response = await getOwnerDashboardStats();
      setStats(response.data);
      if (!silent) {
        notify.success('Dashboard updated!');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      if (!silent) {
        notify.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <div className="owner-layout">
        <OwnerNavbar />
        <div className="owner-content">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-layout">
      <OwnerNavbar />
      
      <div className="owner-content">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening with your salons today.</p>
          </div>
          <button 
            onClick={handleManualRefresh} 
            className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
            disabled={refreshing}
            title="Refresh dashboard"
          >
            <FaSyncAlt /> {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">
              <FaStore />
            </div>
            <div className="stat-details">
              <h3>{stats.totalSalons}</h3>
              <p>Total Salons</p>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">
              <FaCalendarCheck />
            </div>
            <div className="stat-details">
              <h3>{stats.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">
              <FaMoneyBillWave />
            </div>
            <div className="stat-details">
              <h3>₹{stats.totalRevenue?.toLocaleString() || 0}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">
              <FaStar />
            </div>
            <div className="stat-details">
              <h3>{stats.averageRating || '0.0'}</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Bookings</h2>
            <button onClick={() => navigate('/owner/bookings')} className="view-all-btn">
              View All
            </button>
          </div>
          
          <div className="bookings-table">
            {stats.recentBookings && stats.recentBookings.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Salon</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>{booking.customerName}</td>
                      <td>{booking.salonName}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>{booking.time}</td>
                      <td>
                        <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>₹{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No recent bookings</div>
            )}
          </div>
        </div>

        {/* Top Performing Salons */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Top Performing Salons</h2>
          </div>
          
          <div className="salons-grid">
            {stats.topSalons && stats.topSalons.length > 0 ? (
              stats.topSalons.map((salon) => (
                <div key={salon.id} className="salon-card" onClick={() => navigate(`/owner/salon/${salon.id}`)}>
                  <div className="salon-image">
                    <img 
                      src={salon.logo && salon.logo.startsWith('http') ? salon.logo : (salon.logo ? `http://localhost:8080/${salon.logo}` : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Logo%3C/text%3E%3C/svg%3E')} 
                      alt={salon.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Logo%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="salon-info">
                    <h3>{salon.name}</h3>
                    <div className="salon-stats">
                      <span><FaStar /> {salon.ratingAverage?.toFixed(1) || '0.0'}</span>
                      <span>{salon.totalBookings || 0} bookings</span>
                    </div>
                    <div className="salon-revenue">
                      <span>₹{salon.totalRevenue || 0}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No salons registered yet</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button onClick={() => navigate('/owner/add-salon')} className="action-btn primary">
            Add New Salon
          </button>
          <button onClick={() => navigate('/owner/my-salons')} className="action-btn secondary">
            Manage Salons
          </button>
          <button onClick={() => navigate('/owner/bookings')} className="action-btn secondary">
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
