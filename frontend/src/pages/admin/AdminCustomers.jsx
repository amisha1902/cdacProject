import React, { useEffect, useState } from "react";
import {
  getCustomers,
  blockCustomer,
  unblockCustomer,
} from "../../services/adminService";
import "./AdminDashboard.css";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      const data = res.data || [];
      console.log("Raw customer data from API:", data);
      
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
      alert("Failed to load customers");
    }
  };

  const handleToggle = async (customer) => {
    const userId = customer?.user?.id;

    if (!userId) {
      console.error("Invalid customer object:", customer);
      alert("Invalid user id");
      return;
    }

    try {
      const isActive = customer?.user?.isActive;

      if (isActive) {
        await blockCustomer(userId);
        alert("Customer blocked successfully");
      } else {
        await unblockCustomer(userId);
        alert("Customer unblocked successfully");
      }

      fetchCustomers(); // refresh table
    } catch (err) {
      console.error("Action failed", err);
      alert(
        err?.response?.data ||
          err?.response?.data?.message ||
          "Action failed. Check backend logs."
      );
    }
  };

  return (
    <div className="admin-card">
      <h2 className="section-title">Customers</h2>

      {customers.length === 0 ? (
        <p style={{ padding: "20px", textAlign: "center" }}>No customers found</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customerId}>
                <td>{customer.user?.id || customer.customerId}</td>
                <td>
                  {customer.user?.firstName} {customer.user?.lastName}
                </td>
                <td>{customer.user?.email}</td>
                <td>
                  <span
                    className={`badge ${
                      customer.user?.isActive ? "active" : "blocked"
                    }`}
                  >
                    {customer.user?.isActive ? "Active" : "Blocked"}
                  </span>
                </td>
                <td>
                  <button
                    className={`action-btn ${
                      customer.user?.isActive ? "danger" : "success"
                    }`}
                    onClick={() => handleToggle(customer)}
                  >
                    {customer.user?.isActive ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCustomers;
