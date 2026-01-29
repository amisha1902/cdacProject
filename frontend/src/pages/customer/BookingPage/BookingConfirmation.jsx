import React from "react";
import axios from "axios";
import { Card, Button, ListGroup, Badge } from "react-bootstrap";

const dummyBooking = {
  bookingId: 5,
  salonName: "Glow Salon & Spa",
  salonAddress: "MG Road, Pune",
  status: "PENDING_PAYMENT",
  services: [
   
    {
      serviceId: 2,
      serviceName: "Facial",
      date: "2026-02-01",
      startTime: "10:30",
      endTime: "11:30",
      price: 600,
    },
  ],
  totalAmount: 1700,
};

const BookingConfirmation = () => {
  const booking = dummyBooking;

 const handlePayNow = async () => {
  if (!booking.bookingId) {
    alert("Booking ID not found. Please go back and select a booking.");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:8080/api/payments/create",
      { bookingId: booking.bookingId }
    );

    const { razorpayOrderId, key, amount, currency } = res.data;

    const options = {
      key: key,
      amount: amount,
      currency: currency,
      name: "Salon Booking",
      description: "Service Booking Payment",
      order_id: razorpayOrderId,
      handler: async function (response) {
        try {
          await axios.post("http://localhost:8080/api/payments/verify", {
            bookingId: booking.bookingId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          alert("Payment successful 🎉");
        } catch (verifyErr) {
          console.error("Payment verification failed", verifyErr);
          alert("Payment verification failed. Contact support!");
        }
      },
      theme: { color: "#0d6efd" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    console.error("Error creating payment order", err);
    alert("Failed to create payment order. Please try again.");
  }
};

  return (
    <div className="container my-5">
      <h2 className="mb-4">Booking Summary</h2>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>{booking.salonName}</Card.Title>
          <Card.Text>
            <strong>Address:</strong> {booking.salonAddress} <br />
            <strong>Status:</strong>{" "}
            <Badge bg="warning">{booking.status}</Badge>
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Header>Selected Services</Card.Header>
        <ListGroup variant="flush">
          {booking.services.map((service) => (
            <ListGroup.Item key={service.serviceId}>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{service.serviceName}</strong> <br />
                  {service.startTime} - {service.endTime} | {service.date}
                </div>
                <div>₹{service.price}</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Footer className="text-end">
          <strong>Total: ₹{booking.totalAmount}</strong>
        </Card.Footer>
      </Card>

      <Button variant="success" size="lg" className="w-100" onClick={handlePayNow}>
        Pay Now
      </Button>
    </div>
  );
};

export default BookingConfirmation;
