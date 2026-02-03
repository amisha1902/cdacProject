import React, { useEffect, useState } from "react";
import {
  getOwners,
  approveOwner,
  rejectOwner,
} from "../../services/adminService";
import "./AdminDashboard.css";

const AdminOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      setLoading(true);
      const res = await getOwners(); // GET /api/admin/owners/pending
      const data = res.data || [];
      console.log("Pending owners:", data);
      setOwners(data);
    } catch (err) {
      console.error("Failed to load owners", err);
      setOwners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveOwner(userId); // PUT /api/admin/owners/{userId}/approve

      // ✅ Update status locally (do NOT remove row)
      setOwners((prev) =>
        prev.map((o) =>
          o.userId === userId ? { ...o, isActive: true } : o
        )
      );

      alert("Owner approved successfully");
    } catch (err) {
      console.error("Failed to approve owner", err);
      alert("Failed to approve owner");
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Are you sure you want to reject this owner?")) return;

    try {
      await rejectOwner(userId); // PUT /api/admin/owners/{userId}/reject

      // ✅ Keep inactive & update UI
      setOwners((prev) =>
        prev.map((o) =>
          o.userId === userId ? { ...o, isActive: false } : o
        )
      );

      alert("Owner rejected successfully");
    } catch (err) {
      console.error("Failed to reject owner", err);
      alert("Failed to reject owner");
    }
  };

  if (loading) {
    return (
      <p style={{ padding: "20px", textAlign: "center" }}>
        Loading pending owners...
      </p>
    );
  }

  return (
    <>
      <h2 className="section-title">Owners</h2>

      {owners.length === 0 ? (
        <p style={{ padding: "20px", textAlign: "center" }}>
          No owners found
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {owners.map((o) => (
              <tr key={o.userId}>
                {/* NAME */}
                <td>
                  {o.firstName} {o.lastName}
                </td>

                {/* EMAIL */}
                <td>{o.email}</td>

                {/* STATUS */}
                <td>
                  <span
                    className={`badge ${o.isActive ? "active" : "blocked"}`}
                  >
                    {o.isActive ? "Approved" : "Pending"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td>
                  {!o.isActive && (
                    <>
                      <button
                        className="action-btn success"
                        onClick={() => handleApprove(o.userId)}
                      >
                        Approve
                      </button>

                      <button
                        className="action-btn danger"
                        onClick={() => handleReject(o.userId)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default AdminOwners;
