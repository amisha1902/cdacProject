import React, { useEffect, useState } from "react";
import {
  getOwners,
  approveOwner,
  rejectOwner,
} from "../../services/adminService";
import "./AdminDashboard.css";

const AdminOwners = () => {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      const res = await getOwners();
      const data = res.data || [];
      console.log("Raw owner data from API:", data);
      
      setOwners(data);
    } catch (err) {
      console.error("Failed to load owners", err);
      setOwners([]);
    }
  };

  return (
    <>
      <h2 className="section-title">Owners</h2>

      {owners.length === 0 ? (
        <p style={{ padding: "20px", textAlign: "center" }}>No owners found</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {owners.map((o) => (
              <tr key={o.ownerId}>
                <td>{o.user?.email}</td>
                <td>
                  <span
                    className={`badge ${o.isApproved ? "active" : "blocked"}`}
                  >
                    {o.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td>
                  {o.isApproved ? (
                    <button
                      className="action-btn danger"
                      onClick={async () => {
                        if (!window.confirm("Are you sure you want to revoke approval for this owner?")) {
                          return;
                        }
                        try {
                          await rejectOwner(o.ownerId);
                          alert("Owner approval revoked");
                          loadOwners();
                        } catch (err) {
                          console.error("Failed to revoke owner", err);
                          alert("Failed to revoke owner approval");
                        }
                      }}
                    >
                      Revoke
                    </button>
                  ) : (
                    <>
                      <button
                        className="action-btn success"
                        onClick={async () => {
                          try {
                            await approveOwner(o.ownerId);
                            alert("Owner approved successfully");
                            loadOwners();
                          } catch (err) {
                            console.error("Failed to approve owner", err);
                            alert("Failed to approve owner");
                          }
                        }}
                      >
                        Approve
                      </button>

                      <button
                        className="action-btn danger"
                        onClick={async () => {
                          if (!window.confirm("Are you sure you want to reject this owner?")) {
                            return;
                          }
                          try {
                            await rejectOwner(o.ownerId);
                            alert("Owner rejected successfully");
                            loadOwners();
                          } catch (err) {
                            console.error("Failed to reject owner", err);
                            alert("Failed to reject owner");
                          }
                        }}
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
