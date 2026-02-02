import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Card, Badge, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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

                {booking.status === "PENDING_PAYMENT" && (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handlePayNow(booking.bookingId)}
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default MyBookings;
