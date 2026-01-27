import React, { useState } from "react";
import { registerCustomer } from "../../../services/userService"; // ✅ correct path
import "./Register.css";

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });

  // 🔹 INPUT CHANGE HANDLER
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 SUBMIT HANDLER (THIS IS WHERE YOUR CODE GOES)
  const handleSubmit = async (e) => {
    e.preventDefault(); // ❗ stop page reload
    try {
      await registerCustomer(formData);
      alert("Registration successful");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: ""
      });
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Customer Registration</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default CustomerRegister;
