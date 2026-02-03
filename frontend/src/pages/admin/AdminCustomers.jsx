import React, { useEffect, useState } from "react";
import {
  getCustomers,
  blockCustomer,
  unblockCustomer,
} from "../../services/adminService";
import "./AdminDashboard.css";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers(); // GET /api/admin/getAllCustomers
      const data = res.data || [];
      console.log("Customers from API:", data);
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
      alert("Failed to load customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (customer) => {
    const userId = customer.userId;

    try {
      if (customer.isActive) {
        await blockCustomer(userId);

        // update UI only
        setCustomers((prev) =>
          prev.map((c) =>
            c.userId === userId ? { ...c, isActive: false } : c
          )
        );

        alert("Customer blocked successfully");
      } else {
        await unblockCustomer(userId);

        setCustomers((prev) =>
          prev.map((c) =>
            c.userId === userId ? { ...c, isActive: true } : c
          )
        );

        alert("Customer unblocked successfully");
      }
    } catch (err) {
      console.error("Action failed", err);
      alert(
        err?.response?.data ||
          err?.response?.data?.message ||
          "Action failed. Check backend logs."
      );
    }
  };

  if (loading) {
    return (
      <p style={{ padding: "20px", textAlign: "center" }}>
        Loading customers...
      </p>
    );
  }

  return (
    <div className="admin-card">
      <h2 className="section-title">Customers</h2>

      {customers.length === 0 ? (
        <p style={{ padding: "20px", textAlign: "center" }}>
          No customers found
        </p>
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
            {customers.map((c) => (
              <tr key={c.userId}>
                <td>{c.userId}</td>

                <td>
                  {c.firstName} {c.lastName}
                </td>

                <td>{c.email}</td>

                <td>
                  <span
                    className={`badge ${
                      c.isActive ? "active" : "blocked"
                    }`}
                  >
                    {c.isActive ? "Active" : "Blocked"}
                  </span>
                </td>

                <td>
                  <button
                    className={`action-btn ${
                      c.isActive ? "danger" : "success"
                    }`}
                    onClick={() => handleToggle(c)}
                  >
                    {c.isActive ? "Block" : "Unblock"}
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
