import React from "react";
import "./BookingPage.css";

function BookingPage() {
  return (
    <div className="booking-bg d-flex align-items-center justify-content-center py-5">
      <div
        className="container blur-box shadow-lg"
        style={{ maxWidth: "650px" }}
      >
        <h2 className="text-center mb-1">Book Your Appointment</h2>
        <p className="text-center text-light opacity-75 mb-4">
          Please fill the below form, it will take only a minute
        </p>

        <form>
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control bg-transparent text-light border-light"
                placeholder="Your Name"
              />
            </div>
            <div className="col-md-6 mt-3 mt-md-0">
              <input
                type="email"
                className="form-control bg-transparent text-light border-light"
                placeholder="Email"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="tel"
                className="form-control bg-transparent text-light border-light"
                placeholder="Phone"
              />
            </div>
            <div className="col-md-6 mt-3 mt-md-0">
              <select className="form-select bg-light text-dark">
                <option value="">Select Your Service</option>
                <option value="wash">Hair Wash</option>
                <option value="cutting">Hair Cutting</option>
                <option value="facial">Facial</option>
                <option value="color">Color</option>
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="date"
                className="form-control bg-transparent text-dark border-light"
              />
            </div>
            <div className="col-md-6 mt-3 mt-md-0">
              <input
                type="time"
                className="form-control bg-transparent text-dark border-light"
              />
            </div>
          </div>
          <div className="mb-4">
            <textarea
              className="form-control bg-transparent text-light border-light"
              placeholder="Address"
              rows={3}
            ></textarea>
          </div>

          <div className="text-center">
            <button className="btn btn-light px-5">Book Now</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
