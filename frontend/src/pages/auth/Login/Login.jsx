import React, { useState } from "react";
import { loginUser } from "../../../services/userService";
import notify from "../../../utils/notify";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.email) {
      notify.error("Email is required");
      return;
    }
    if (!formData.password) {
      notify.error("Password is required");
      return;
    }

    try {
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      const { role, userId, token } = res.data;

      // ✅ STORE AUTH DATA
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("userRole", role); // For consistency

      notify.success("Logged in successfully! Redirecting...");

      // ✅ ROLE BASED REDIRECT with slight delay for toast to show
      setTimeout(() => {
        if (role === "CUSTOMER") {
          navigate("/");
        } else if (role === "OWNER") {
          navigate("/owner/dashboard");
        } else if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/login");
        }
      }, 1000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Invalid email or password";
      notify.error(errorMessage);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit}>

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="login-options">
            <label className="remember">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>

            <Link to="/forgot-password" className="forgot">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>

        </form>

        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/registerCustomer" className="signup-link">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
