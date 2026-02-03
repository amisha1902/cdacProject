import React, { useState } from "react";
import { registerCustomer } from "../../../services/userService";
import notify from "../../../utils/notify";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./CustomerRegister.css";

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.firstName.trim()) {
      notify.error("First name is required");
      return;
    }
    if (formData.firstName.length < 3 || formData.firstName.length > 20) {
      notify.error("First name must be 3-20 characters");
      return;
    }
    if (!formData.email.trim()) {
      notify.error("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      notify.error("Please enter a valid email address");
      return;
    }
    if (!formData.phone.trim()) {
      notify.error("Phone number is required");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      notify.error("Phone number must be a valid 10-digit Indian number starting with 6-9");
      return;
    }
    if (!formData.password) {
      notify.error("Password is required");
      return;
    }
    if (formData.password.length < 6) {
      notify.error("Password must be at least 6 characters");
      return;
    }

    try {
      await registerCustomer(formData);

      notify.success("Customer registered successfully! Redirecting to login...");

      // ✅ Redirect to login with delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.";
      notify.error(errorMessage);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h2>Customer Registration</h2>
        <hr/>
        <p className="subtitle">Join Glamora Beauty today</p>

        <form onSubmit={handleSubmit}>

          <div className="row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First name (3-20 chars)"
                value={formData.firstName}
                onChange={handleChange}
                minLength={3}
                maxLength={20}
                required
              />
            </div>

            <div className="form-group">
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

          <div className="form-group">
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

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="10-digit number (e.g., 9876543210)"
              value={formData.phone}
              onChange={handleChange}
              pattern="[6-9]\d{9}"
              maxLength={10}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password (min 6 chars)"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create Account
          </button>

          <p className="login-link">
            Already registered? <Link to="/login">Login</Link>
          </p>

        </form>

      </div>
    </div>
  );
};

export default CustomerRegister;
