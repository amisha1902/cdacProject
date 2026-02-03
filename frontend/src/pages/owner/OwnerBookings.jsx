import React, { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaUser, FaPhone, FaEnvelope, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaStore, FaTag, FaSearch, FaSyncAlt } from 'react-icons/fa';
import OwnerNavbar from '../../components/OwnerNavbar/OwnerNavbar';
import { getOwnerBookings } from '../../services/ownerService';
import notify from '../../utils/notify';
import './OwnerBookings.css';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchBookings(true); // Silent refresh
    }, 30000);
    
    // Listen for booking updates
    const handleBookingUpdate = () => {
      fetchBookings(true);
    };
    window.addEventListener('bookingUpdated', handleBookingUpdate);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('bookingUpdated', handleBookingUpdate);
    };
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, selectedStatus, searchTerm]);

  const fetchBookings = async (silent = false) => {
    if (!silent) {
      setRefreshing(true);
    }
    try {
      const response = await getOwnerBookings();
      setBookings(response.data || []);
      if (!silent) {
        notify.success('Bookings updated!');
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      if (!silent) {
        notify.error('Failed to load bookings');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchBookings();
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === selectedStatus);
    }

    // Filter by search term (customer name, service name, or category)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.customerFirstName.toLowerCase().includes(term) ||
        booking.customerLastName.toLowerCase().includes(term) ||
        booking.customerEmail.toLowerCase().includes(term) ||
        booking.serviceName.toLowerCase().includes(term) ||
        booking.categoryName.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED': return <FaCheckCircle className="status-icon confirmed" />;
      case 'PENDING': return <FaClock className="status-icon pending" />;
      case 'PENDING_PAYMENT': return <FaMoneyBillWave className="status-icon pending-payment" />;
      case 'CANCELLED': return <FaTimesCircle className="status-icon cancelled" />;
      case 'COMPLETED': return <FaCheckCircle className="status-icon completed" />;
      default: return <FaClock className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'confirmed';
      case 'PENDING': return 'pending';
      case 'PENDING_PAYMENT': return 'pending-payment';
      case 'CANCELLED': return 'cancelled';
      case 'COMPLETED': return 'completed';
      default: return 'pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="owner-bookings">
        <OwnerNavbar />
        <div className="bookings-container">
          <div className="loading-spinner">
            <p>Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-bookings">
      <OwnerNavbar />
      <div className="bookings-container">
        <div className="bookings-header">
          <div>
            <h1>Salon Bookings</h1>
            <p>Manage all bookings for your salons</p>
          </div>
          <button 
            onClick={handleManualRefresh} 
            className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
            disabled={refreshing}
            title="Refresh bookings"
          >
            <FaSyncAlt /> {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="bookings-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search customers, services, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PENDING_PAYMENT">Pending Payment</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bookings-stats">
          <div className="stat-card">
            <h3>{filteredBookings.length}</h3>
            <p>Total Bookings</p>
          </div>
          <div className="stat-card">
            <h3>₹{filteredBookings.reduce((sum, booking) => sum + parseFloat(booking.servicePrice || 0), 0).toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
          <div className="stat-card">
            <h3>{filteredBookings.filter(b => b.status === 'CONFIRMED').length}</h3>
            <p>Confirmed</p>
          </div>
          <div className="stat-card">
            <h3>{filteredBookings.filter(b => b.status === 'PENDING').length}</h3>
            <p>Pending</p>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <FaStore className="no-bookings-icon" />
            <h3>No bookings found</h3>
            <p>
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Bookings will appear here once customers make reservations'
              }
            </p>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map((booking, index) => (
              <div key={`${booking.bookingId}-${index}`} className="booking-card">
                <div className="booking-header">
                  <div className="booking-id">
                    <strong>Booking #{booking.bookingId}</strong>
                  </div>
                  <div className={`booking-status ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span>{booking.status.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="booking-content">
                  <div className="customer-section">
                    <h4><FaUser /> Customer Details</h4>
                    <div className="customer-info">
                      <div className="info-item">
                        <span className="label">Name:</span>
                        <span className="value">
                          {booking.customerFirstName} {booking.customerLastName}
                        </span>
                      </div>
                      <div className="info-item">
                        <FaEnvelope />
                        <span className="value">{booking.customerEmail}</span>
                      </div>
                      <div className="info-item">
                        <FaPhone />
                        <span className="value">{booking.customerPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="service-section">
                    <h4><FaTag /> Service Details</h4>
                    <div className="service-info">
                      <div className="service-name">
                        <strong>{booking.serviceName}</strong>
                        <span className="category">({booking.categoryName})</span>
                      </div>
                      <div className="service-details">
                        <div className="detail-item">
                          <FaCalendar />
                          <span>{formatDate(booking.serviceDate)}</span>
                        </div>
                        <div className="detail-item">
                          <FaClock />
                          <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                        </div>
                        <div className="detail-item">
                          <FaMoneyBillWave />
                          <span>₹{booking.servicePrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="booking-summary">
                    <div className="summary-item">
                      <span className="label">Booking Date:</span>
                      <span className="value">{formatDateTime(booking.bookingDate)}</span>
                    </div>
                    <div className="summary-item total">
                      <span className="label">Total Amount:</span>
                      <span className="value">₹{booking.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookings;