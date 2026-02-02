import React, { useState } from "react";
import "./RegisterSalon.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterSalon = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="register-page">
      <div className="register-box">

        <h2 className="title">Register Salon</h2>
        <p className="subtitle">Join Glamora Partners Network</p>

        <form className="form">

          {/* Owner & Salon Name */}
          <div className="row-group">
            <div className="form-group">
              <label>Owner Name</label>
              <input type="text" placeholder="Enter owner name" />
            </div>

            <div className="form-group">
              <label>Salon Name</label>
              <input type="text" placeholder="Enter salon name" />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="Enter phone number" />
          </div>

          {/* Salon Category */}
          <div className="form-group">
            <label>Salon Category</label>
            <select>
              <option value="">Select Category</option>
              <option>Hair Styling</option>
              <option>Makeup Studio</option>
              <option>Bridal Salon</option>
              <option>Spa & Wellness</option>
              <option>Kids Salon</option>
              <option>Nail Studio</option>
            </select>
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Full Address</label>
            <textarea placeholder="Enter full address"></textarea>
          </div>

          {/* Upload Logo */}
          <div className="form-group">
            <label>Upload Salon Logo</label>
            <input type="file" className="file-input" />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Terms */}
          <div className="terms">
            <input type="checkbox" />
            <p>
              I agree to the{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </p>
          </div>

          {/* Button */}
          <button className="submit-btn">Register Salon</button>
        </form>

        <p className="login-text">
          Already registered? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterSalon;
