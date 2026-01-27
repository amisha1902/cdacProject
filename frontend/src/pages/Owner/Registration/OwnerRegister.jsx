import React, { useState } from "react";
import { registerOwner } from "../../../services/userService";
import "./Register.css";

const OwnerRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerOwner(formData);
      alert("Owner registered successfully");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: ""
      });
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Owner registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Owner Registration</h2>
      <p className="subtitle">Register your salon and start managing bookings</p>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="field">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="field">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Create Owner Account
        </button>

        <p className="login-link">
          Already registered? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default OwnerRegister;
