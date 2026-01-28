import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Payment/PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    if (!booking) {
      alert('No booking found. Please select a booking first.');
      navigate('/my-bookings');
    }
  }, [booking, navigate]);

  const handleCardChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2500);
    }, 2000);
  };

  if (!booking) {
    return null;
  }

  const taxAmount = Math.round(booking.totalAmount * 0.18);
  const totalAmount = booking.totalAmount + taxAmount;

  if (success) {
    return (
      <div className="payment-success-page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed</p>
          <div className="transaction-id">
            <p>Transaction ID: TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Back Button */}
        <button
          onClick={() => navigate('/my-bookings')}
          className="back-button"
        >
          ← Back to Bookings
        </button>

        <div className="payment-layout">
          {/* Booking Summary */}
          <div className="booking-summary">
            <div className="summary-header">
              <h2>Booking Summary</h2>
              <p>{booking.bookingNumber}</p>
            </div>
            
            <div className="summary-content">
              <div className="summary-item">
                <p className="summary-label">Service</p>
                <p className="summary-value">{booking.service}</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Staff</p>
                <p className="summary-value">{booking.staff}</p>
              </div>
              <div className="summary-date-time">
                <div className="summary-item">
                  <p className="summary-label">Date</p>
                  <p className="summary-value-sm">{booking.date}</p>
                </div>
                <div className="summary-item">
                  <p className="summary-label">Time</p>
                  <p className="summary-value-sm">{booking.time}</p>
                </div>
              </div>
              
              <div className="summary-pricing">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{booking.totalAmount}</span>
                </div>
                <div className="price-row">
                  <span>Tax (18%)</span>
                  <span>₹{taxAmount}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form-section">
            <div className="payment-card">
              <h2>Payment Details</h2>

              {/* Payment Methods */}
              <div className="payment-methods">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                >
                  <span className="method-icon">💳</span>
                  <span>Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`}
                >
                  <span className="method-icon">📱</span>
                  <span>UPI</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`payment-method ${paymentMethod === 'cash' ? 'active' : ''}`}
                >
                  <span className="method-icon">💵</span>
                  <span>Cash</span>
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <form onSubmit={handlePayment} className="card-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleCardChange}
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      placeholder="John Doe"
                      value={cardDetails.cardName}
                      onChange={handleCardChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={handleCardChange}
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="pay-button"
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : `Pay ₹${totalAmount}`}
                  </button>
                </form>
              )}

              {/* UPI Payment */}
              {paymentMethod === 'upi' && (
                <div className="upi-payment">
                  <div className="qr-code">
                    <p>QR Code Here</p>
                  </div>
                  <p className="upi-text">Scan QR code to pay with any UPI app</p>
                  <button
                    onClick={handlePayment}
                    className="pay-button"
                  >
                    I've Completed Payment
                  </button>
                </div>
              )}

              {/* Cash Payment */}
              {paymentMethod === 'cash' && (
                <div className="cash-payment">
                  <div className="cash-icon">⚠️</div>
                  <h3>Pay at Salon</h3>
                  <p>You can pay in cash when you visit our salon</p>
                  <button
                    onClick={handlePayment}
                    className="pay-button"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;