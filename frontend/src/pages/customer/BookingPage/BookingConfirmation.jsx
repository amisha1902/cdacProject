import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, ListGroup, Badge, Spinner, Alert } from "react-bootstrap";
import ProgressTracker from "../../../components/ProgressTracker";
import { FaMapMarkerAlt, FaCalendarCheck, FaRegClock } from "react-icons/fa";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState("");

  const fetchBooking = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/bookings/${bookingId}`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
        
        
      });
      console.log(res.data);
      setBooking(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Unable to retrieve booking details. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    if (!booking && bookingId) fetchBooking();
  }, [booking, bookingId, fetchBooking]);

  const handlePayNow = async () => {
    const token = localStorage.getItem("token");
    if (!booking?.bookingId) {
      alert("Booking information not found. Please try again.");
      return;
    }

    console.log("Starting payment for booking:", booking);

    try {
      // Create Razorpay order
      const res = await axios.post(
        "http://localhost:8080/api/payments/create",
        { bookingId: booking.bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Razorpay order created:", res.data);
      const { razorpayOrderId, key, amount, currency } = res.data;

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        console.error("Razorpay script not loaded");
        alert("Payment gateway not available. Please refresh the page and try again.");
        return;
      }

      const options = {
        key,
        amount,
        currency,
        name: "Salon Booking Payment",
        description: `Payment for Booking #${booking.bookingId}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          console.log("Payment successful:", response);
          try {
            await axios.post(
              "http://localhost:8080/api/payments/verify",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Trigger cart update event to refresh navbar cart count
            window.dispatchEvent(new Event('cartUpdated'));
            // Trigger booking update event for owner dashboard
            window.dispatchEvent(new Event('bookingUpdated'));
            
            alert("Payment successful! 🎉");
            navigate("/my-bookings");
          } catch (verifyErr) {
            console.error("Payment verification failed", verifyErr);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: `${booking.customerFirstName || ""} ${booking.customerLastName || ""}`.trim(),
          email: booking.customerEmail || "",
          contact: booking.customerPhone || ""
        },
        theme: { 
          color: "#667eea"
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal closed by user");
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      console.log("Opening Razorpay with options:", options);
      const razor = new window.Razorpay(options);
      
      razor.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description || 'Please try again'}`);
      });
      
      razor.open();
    } catch (err) {
      console.error("Payment initiation failed", err);
      
      // Fallback to demo payment if Razorpay order creation fails
      const useDemo = window.confirm(
        "Payment gateway is currently unavailable. Would you like to proceed with demo payment?"
      );
      
      if (useDemo) {
        await processDemoPayment();
      }
    }
  };

  const processDemoPayment = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/payments/process-demo",
        {
          bookingId: booking.bookingId,
          amount: booking.totalAmount,
          paymentMethod: "DEMO",
          transactionId: `DEMO_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Trigger cart update event to refresh navbar cart count
        window.dispatchEvent(new Event('cartUpdated'));
        // Trigger booking update event for owner dashboard
        window.dispatchEvent(new Event('bookingUpdated'));
        
        alert("Demo payment successful! 🎉\n\nTransaction ID: " + response.data.transactionId);
        navigate("/my-bookings");
      } else {
        alert("Payment failed: " + response.data.message);
      }
    } catch (err) {
      console.error("Demo payment processing error", err);
      alert("Payment processing failed. Please try again or contact support.");
    }
  };

  if (loading)
    return (
      <div className="text-center my-5 p-5">
        <Spinner animation="border" variant="secondary" />
        <p className="mt-3 text-muted small">Fetching your booking details...</p>
      </div>
    );

  if (error || !booking)
    return (
      <div className="container my-5">
        <Alert variant="danger" className="small">{error || "No booking data found."}</Alert>
        <Button variant="secondary" size="sm" onClick={() => navigate("/cart")}>
          Go Back to Cart
        </Button>
      </div>
    );

  return (
    <div className="container my-4" style={{ maxWidth: "700px" }}>
      <ProgressTracker currentStep={1} />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <h5 className="fw-semibold mb-0" style={{ fontSize: "1rem" }}>Booking Summary</h5>
        <Badge bg="light" text="dark" className="fs-7 py-1 px-2" style={{ fontSize: "0.75rem" }}>
          {booking.status.replace("_", " ")}
        </Badge>
      </div>

      {/* Salon Details
      <Card className="mb-3 shadow-sm border-0 rounded-3 bg-white">
        <Card.Body className="p-3">
          <h6 className="fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>{booking.salonName || "Salon"}</h6>
          <p className="text-muted mb-0 small d-flex align-items-center">
            <FaMapMarkerAlt className="me-1" style={{ fontSize: "0.8rem" }} /> {booking.salonAddress || "Address unavailable"}
          </p>
        </Card.Body>
      </Card> */}

      {/* Services Breakdown */}
      <Card className="mb-3 shadow-sm border-0 rounded-3">
        <Card.Header className="bg-white py-2 px-3">
          <h6 className="mb-0 fw-semibold" style={{ fontSize: "0.9rem" }}>Services</h6>
        </Card.Header>
        <ListGroup variant="flush">
          {booking.services.map((service) => (
            <ListGroup.Item key={service.serviceId} className="py-2 px-3 border-0 d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold" style={{ fontSize: "0.85rem" }}>{service.serviceName}</div>
                <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                  <span className="me-2 d-flex align-items-center">
                    <FaCalendarCheck className="me-1" style={{ fontSize: "0.7rem" }} /> {service.date}
                  </span>
                  <span className="d-flex align-items-center">
                    <FaRegClock className="me-1" style={{ fontSize: "0.7rem" }} /> {service.startTime} - {service.endTime}
                  </span>
                </div>
              </div>
              <div className="fw-semibold" style={{ fontSize: "0.85rem" }}>₹{service.price}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Footer className="bg-white py-2 px-3 border-0 d-flex justify-content-between">
          <span className="text-muted small">Total</span>
          <span className="fw-semibold" style={{ fontSize: "0.9rem" }}>₹{booking.totalAmount}</span>
        </Card.Footer>
      </Card>

      {/* Cancellation Policy */}
      <Card className="mb-3 border-0 bg-light p-2 rounded-3">
        <p className="small text-muted mb-0" style={{ fontSize: "0.7rem" }}>
          <strong>Cancellation Policy:</strong> Free cancellations if done more than 12 hrs before the service or if a professional isn’t assigned. A fee will be charged otherwise.
        </p>
      </Card>

      {/* Action Buttons */}
      <div className="d-grid gap-2">
        <Button variant="secondary" size="sm" className="fw-semibold py-2" onClick={handlePayNow}>
          Pay ₹{booking.totalAmount}
        </Button>
        <Button variant="link" className="text-muted small p-0" onClick={() => navigate("/cart")}>
          Cancel and return to cart
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
