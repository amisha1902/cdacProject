import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MyBookings/MyBookingPage.css';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  
  const [bookings] = useState([
    {
      bookingId: 1,
      bookingNumber: 'BK-2024-001',
      customerName: 'John Doe',
      service: 'Haircut & Styling',
      staff: 'Sarah Johnson',
      date: '2024-12-15',
      time: '10:00 AM',
      status: 'Confirmed',
      totalAmount: 1200,
      paymentStatus: 'Paid',
      canRate: true
    },
    {
      bookingId: 2,
      bookingNumber: 'BK-2024-002',
      customerName: 'John Doe',
      service: 'Full Body Massage',
      staff: 'Mike Smith',
      date: '2024-12-10',
      time: '02:00 PM',
      status: 'Completed',
      totalAmount: 2000,
      paymentStatus: 'Paid',
      canRate: true,
      rating: null
    },
    {
      bookingId: 3,
      bookingNumber: 'BK-2024-003',
      customerName: 'John Doe',
      service: 'Facial Treatment',
      staff: 'Emily Davis',
      date: '2024-12-20',
      time: '11:00 AM',
      status: 'Pending',
      totalAmount: 800,
      paymentStatus: 'Pending',
      canRate: false
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const handlePayment = (booking) => {
    navigate('/payment', { state: { booking } });
  };

  const handleRating = (booking) => {
    navigate('/rating', { state: { booking } });
  };

  return (
    <div className="my-bookings-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h1 className='text-dark'>My Bookings</h1>
            <p>Manage your salon appointments</p>
          </div>
          <div className="total-badge">
            <span className="sparkle-icon">✨</span>
            <span className="total-count">{bookings.length} Total</span>
          </div>
        </div>
      </div>

      <div className="bookings-container">
        {/* Filters & Search */}
        <div className="filters-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by booking number or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            {['all', 'confirmed', 'completed', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`filter-btn ${filter === status ? 'active' : ''}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="bookings-grid m-2 p-2">
          {filteredBookings.map((booking) => (
            <div key={booking.bookingId} className="booking-card text-light">
              {/* Card Header */}
              <div className="card-header bg-dark p-2">
                <div className="booking-id-section">
                  <p className="booking-label">Booking ID</p>
                  <h3 className="booking-number">{booking.bookingNumber}</h3>
                </div>
                <span className={`status-badge ${getStatusClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="card-body">
                {/* Service Info */}
                <div className="info-row">
                  <div className="info-icon service-icon">✨</div>
                  <div className="info-content">
                    <p className="info-label">Service</p>
                    <p className="info-value">{booking.service}</p>
                  </div>
                </div>

                {/* Staff Info */}
                <div className="info-row">
                  <div className="info-icon staff-icon">👤</div>
                  <div className="info-content">
                    <p className="info-label">Staff Member</p>
                    <p className="info-value">{booking.staff}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="date-time-row">
                  <div className="info-row half">
                    <div className="info-icon date-icon">📅</div>
                    <div className="info-content">
                      <p className="info-label">Date</p>
                      <p className="info-value-sm">{booking.date}</p>
                    </div>
                  </div>
                  <div className="info-row half">
                    <div className="info-icon time-icon">⏰</div>
                    <div className="info-content">
                      <p className="info-label">Time</p>
                      <p className="info-value-sm">{booking.time}</p>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="amount-section">
                  <div>
                    <p className="amount-label">Total Amount</p>
                    <p className="amount-value">₹{booking.totalAmount}</p>
                  </div>
                  <span className={`payment-badge ${booking.paymentStatus === 'Paid' ? 'paid' : 'pending'}`}>
                    {booking.paymentStatus}
                  </span>
                </div>

                {/* Actions */}
                <div className="card-actions">
                  {booking.paymentStatus === 'Pending' && (
                    <button
                      onClick={() => handlePayment(booking)}
                      className="btn-primary"
                    >
                      Pay Now
                    </button>
                  )}
                  {booking.canRate && !booking.rating && booking.status === 'Completed' && (
                    <button
                      onClick={() => handleRating(booking)}
                      className="btn-rating"
                    >
                      ⭐ Rate Service
                    </button>
                  )}
                  {booking.rating && (
                    <div className="rated-badge">
                      ⭐ Rated {booking.rating}/5
                    </div>
                  )}
                  {/* <button className="btn-secondary">
                    Details
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="no-bookings">
            <div className="no-bookings-icon">❌</div>
            <h3>No bookings found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;