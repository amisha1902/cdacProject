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

    try {
      await registerCustomer(formData);

      notify.success("Customer registered successfully!");

      // ✅ Redirect to login
      navigate("/login");

    } catch (err) {
      console.error(err);
      notify.error(err.response?.data?.message || "Registration failed");
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
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
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
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
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
