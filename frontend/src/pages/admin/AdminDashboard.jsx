import React, { useState } from "react";
import { FaUsers, FaUserTie, FaStore, FaSignOutAlt } from "react-icons/fa";
import AdminCustomers from "./AdminCustomers";
import AdminOwners from "./AdminOwners";
import ManageSalons from "./ManageSalons";
import { logout } from "../../services/auth";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("customers");

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            <FaUsers className="nav-icon" />
            <span>Customers</span>
          </button>
          
          <button
            className={`nav-item ${activeTab === "owners" ? "active" : ""}`}
            onClick={() => setActiveTab("owners")}
          >
            <FaUserTie className="nav-icon" />
            <span>Owners</span>
          </button>
          
          <button
            className={`nav-item ${activeTab === "salons" ? "active" : ""}`}
            onClick={() => setActiveTab("salons")}
          >
            <FaStore className="nav-icon" />
            <span>Salons</span>
          </button>
          
          <button
            className="nav-item logout-btn"
            onClick={logout}
          >
            <FaSignOutAlt className="nav-icon" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="content-header">
          <h1>
            {activeTab === "customers" && "Customer Management"}
            {activeTab === "owners" && "Owner Management"}
            {activeTab === "salons" && "Salon Management"}
          </h1>
          <p className="content-subtitle">
            {activeTab === "customers" && "Manage and monitor all registered customers"}
            {activeTab === "owners" && "Approve or reject salon owner registrations"}
            {activeTab === "salons" && "Review and approve salon listings"}
          </p>
        </div>

        <div className="content-body">
          {activeTab === "customers" && <AdminCustomers />}
          {activeTab === "owners" && <AdminOwners />}
          {activeTab === "salons" && <ManageSalons />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
