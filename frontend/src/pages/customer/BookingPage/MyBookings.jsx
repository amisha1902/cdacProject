import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Card, Badge, Button, Spinner, Modal, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import notify from "../../../utils/notify";
import "bootstrap/dist/css/bootstrap.min.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("/api/bookings", {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (bookingId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "/api/payments/initiate",
        {},
        {
          params: { bookingId, userId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // If backend returns a gateway URL
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        alert("Payment initiated successfully");
        fetchBookings();
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  const handleOpenRatingModal = (booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setHover(0);
    setComment("");
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedBooking(null);
    setRating(0);
    setComment("");
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      notify.error("Please select a rating");
      return;
    }

    const token = localStorage.getItem("token");
    setSubmittingRating(true);

    try {
      await axios.post(
        "/api/reviews",
        {
          bookingId: selectedBooking.bookingId,
          rating: rating,
          comment: comment || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      notify.success("Thank you for your feedback!");
      handleCloseRatingModal();
      fetchBookings(); // Refresh bookings to update hasReview status
    } catch (err) {
      console.error("Failed to submit rating:", err);
      notify.error(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading)
    return (
      <Container className="py-5 text-center">
        <Spinner />
      </Container>
    );

  return (
    <Container className="py-4" style={{ maxWidth: "900px" }}>
      <h5 className="mb-3 fw-semibold">My Bookings</h5>

      {bookings.length === 0 ? (
        <p className="text-muted">No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <Card key={booking.bookingId} className="mb-3 shadow-sm border-0">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <div className="fw-medium small">
                    Booking #{booking.bookingId}
                  </div>
                  <div className="text-muted small">
                    {booking.salonName}
                  </div>
                </div>
                <Badge
                  bg={
                    booking.status === "CONFIRMED"
                      ? "success"
                      : booking.status === "CANCELLED"
                      ? "secondary"
                      : "warning"
                  }
                  className="text-uppercase small px-2 py-1"
                >
                  {booking.status.replace("_", " ")}
                </Badge>
              </div>

              {booking.services.map((s, idx) => (
                <div
                  key={idx}
                  className="d-flex justify-content-between small mb-1 text-muted"
                >
                  <div>
                    {s.serviceName} • {s.date} • {s.startTime} - {s.endTime}
                  </div>
                  <div>₹{s.price}</div>
                </div>
              ))}

              <hr className="my-2" />

              <div className="d-flex justify-content-between align-items-center">
                <div className="fw-semibold small">
                  Total: ₹{booking.totalAmount}
                </div>

                <div className="d-flex gap-2">
                  {booking.status === "PENDING_PAYMENT" && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handlePayNow(booking.bookingId)}
                    >
                      Pay Now
                    </Button>
                  )}

                  {(booking.status === "COMPLETED" || booking.status === "CONFIRMED") && !booking.hasReview && (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleOpenRatingModal(booking)}
                    >
                      <FaStar /> Rate Service
                    </Button>
                  )}

                  {(booking.status === "COMPLETED" || booking.status === "CONFIRMED") && booking.hasReview && (
                    <Badge bg="success" className="d-flex align-items-center gap-1">
                      <FaStar /> Reviewed
                    </Badge>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Rating Modal */}
      <Modal show={showRatingModal} onHide={handleCloseRatingModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Rate Your Experience</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <div className="mb-3">
                <h6>{selectedBooking.salonName}</h6>
                <p className="text-muted small mb-0">
                  Booking #{selectedBooking.bookingId}
                </p>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Your Rating</Form.Label>
                <div className="d-flex gap-2 fs-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      style={{ cursor: "pointer" }}
                      color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Your Review (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Tell us about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                />
                <Form.Text className="text-muted">
                  {comment.length}/500 characters
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRatingModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitRating}
            disabled={submittingRating || rating === 0}
          >
            {submittingRating ? "Submitting..." : "Submit Rating"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyBookings;
