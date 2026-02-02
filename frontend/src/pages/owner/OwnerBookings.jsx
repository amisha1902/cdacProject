import React, { useState, useEffect } from "react";
import axios from "axios";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const salonId = localStorage.getItem("salonId");
      const token = localStorage.getItem("token");
      
      if (!salonId || !token) {
        console.error("Missing salonId or token");
        setLoading(false);
        return;
      }

      const response = await axios.get(`/api/bookings/admin?salonId=${salonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookings(response.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/bookings/admin/${bookingId}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Booking confirmed successfully!");
      fetchBookings();
    } catch (error) {
      console.error("Failed to confirm booking:", error);
      alert("Failed to confirm booking");
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/bookings/admin/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Booking cancelled successfully!");
      fetchBookings();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Failed to cancel booking");
    }
  };

  if (loading) {
    return <div className="container mt-5"><h3>Loading bookings...</h3></div>;
  }

  return (
    <div className="container mt-5">
      <h2>Salon Bookings Management</h2>
      
      {bookings.length === 0 ? (
        <p className="text-muted mt-3">No bookings found</p>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Services</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>Customer #{booking.customerId || "N/A"}</td>
                  <td>
                    {booking.services?.map(s => s.serviceName).join(", ") || "N/A"}
                  </td>
                  <td>₹{booking.totalAmount}</td>
                  <td>
                    <span className={`badge bg-${
                      booking.status === "CONFIRMED" ? "success" :
                      booking.status === "CANCELLED" ? "danger" : "warning"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === "PENDING_PAYMENT" && (
                      <>
                        <button 
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleConfirm(booking.bookingId)}
                        >
                          Confirm
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCancel(booking.bookingId)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;