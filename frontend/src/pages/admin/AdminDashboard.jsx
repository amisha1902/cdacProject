import React from "react";
import AdminCustomers from "./AdminCustomers";
import AdminOwners from "./AdminOwners";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-card">
        <AdminCustomers />
      </div>

      <div className="admin-card">
        <AdminOwners />
      </div>
    </div>
  );
};

export default AdminDashboard;
