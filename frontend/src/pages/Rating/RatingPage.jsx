import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RatingPage.css';

const RatingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!booking) {
      alert('No booking found. Please select a booking first.');
      navigate('/my-bookings');
    }
  }, [booking, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      navigate('/my-bookings');
    }, 2500);
  };

  if (!booking) {
    return null;
  }

  const getRatingText = () => {
    switch(rating) {
      case 5: return 'Excellent!';
      case 4: return 'Great!';
      case 3: return 'Good';
      case 2: return 'Fair';
      case 1: return 'Poor';
      default: return '';
    }
  };

  if (submitted) {
    return (
      <div className="rating-success-page">
        <div className="success-card">
          <div className="success-icon-rating">⭐</div>
          <h2>Thank You!</h2>
          <p>Your feedback helps us improve</p>
          <div className="stars-display">
            {[...Array(rating)].map((_, i) => (
              <span key={i} className="star-filled">⭐</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rating-page">
      <div className="rating-container">
        {/* Back Button */}
        <button
          onClick={() => navigate('/my-bookings')}
          className="back-button"
        >
          ← Back to Bookings
        </button>

        <div className="rating-card">
          {/* Header */}
          <div className="rating-header">
            <div className="sparkle-icon-large">✨</div>
            <h1>Rate Your Experience</h1>
            <p>We'd love to hear your feedback!</p>
          </div>

          {/* Booking Info */}
          <div className="booking-info">
            <div className="service-icon-box">
              <span>✨</span>
            </div>
            <div className="service-details">
              <h3>{booking.service}</h3>
              <p>with {booking.staff}</p>
            </div>
          </div>
          <div className="booking-datetime">
            <div className="datetime-item">
              <span>📅</span>
              <span>{booking.date}</span>
            </div>
            <div className="datetime-item">
              <span>⏰</span>
              <span>{booking.time}</span>
            </div>
          </div>

          {/* Rating Form */}
          <form onSubmit={handleSubmit} className="rating-form">
            {/* Star Rating */}
            <div className="star-rating-section">
              <label>How would you rate this service?</label>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="star-button"
                  >
                    <span className={star <= (hover || rating) ? 'star-filled' : 'star-empty'}>
                      {star <= (hover || rating) ? '⭐' : '☆'}
                    </span>
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="rating-text">{getRatingText()}</p>
              )}
            </div>

            {/* Comment */}
            <div className="comment-section">
              <label>Share your experience (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="5"
                placeholder="Tell us what you loved or how we can improve..."
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-rating-button">
              Submit Rating
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingPage;