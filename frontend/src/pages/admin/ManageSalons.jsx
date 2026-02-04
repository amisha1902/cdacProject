import React, { useEffect, useState } from "react";
import { getAllSalons, approveSalon, rejectSalon } from "../../services/adminService";
import { FaCheckCircle, FaTimesCircle, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import notify from "../../utils/notify";
import "./AdminDashboard.css";

const ManageSalons = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Filter status: all, pending, approved, rejected

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const res = await getAllSalons();
      const data = res.data || [];
      console.log("Salons from API:", data);
      setSalons(data);
    } catch (err) {
      console.error("Failed to fetch salons", err);
      notify.error("Failed to load salons");
      setSalons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSalon = async (salonId) => {
    if (!window.confirm("Are you sure you want to approve this salon?")) return;

    try {
      await approveSalon(salonId);
      
      // Update UI
      setSalons((prev) =>
        prev.map((s) =>
          s.salonId === salonId ? { ...s, isApproved: 1 } : s
        )
      );
      
      notify.success("Salon approved successfully!");
    } catch (err) {
      console.error("Failed to approve salon", err);
      notify.error(err.response?.data?.message || "Failed to approve salon");
    }
  };

  const handleRejectSalon = async (salonId) => {
    if (!window.confirm("Are you sure you want to reject this salon?")) return;

    try {
      await rejectSalon(salonId);
      
      // Update UI
      setSalons((prev) =>
        prev.map((s) =>
          s.salonId === salonId ? { ...s, isApproved: 2 } : s
        )
      );
      
      notify.success("Salon rejected successfully!");
    } catch (err) {
      console.error("Failed to reject salon", err);
      notify.error(err.response?.data?.message || "Failed to reject salon");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <span className="status-badge pending"><FaClock /> Pending</span>;
      case 1:
        return <span className="status-badge approved"><FaCheckCircle /> Approved</span>;
      case 2:
        return <span className="status-badge rejected"><FaTimesCircle /> Rejected</span>;
      default:
        return <span className="status-badge pending"><FaClock /> Pending</span>;
    }
  };

  const filteredSalons = salons.filter((salon) => {
    if (filter === "all") return true;
    if (filter === "pending") return salon.isApproved === 0;
    if (filter === "approved") return salon.isApproved === 1;
    if (filter === "rejected") return salon.isApproved === 2;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading salons...</p>
      </div>
    );
  }

  return (
    <div className="manage-salons">
      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({salons.length})
        </button>
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({salons.filter(s => s.isApproved === 0).length})
        </button>
        <button
          className={`filter-btn ${filter === "approved" ? "active" : ""}`}
          onClick={() => setFilter("approved")}
        >
          Approved ({salons.filter(s => s.isApproved === 1).length})
        </button>
        <button
          className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
          onClick={() => setFilter("rejected")}
        >
          Rejected ({salons.filter(s => s.isApproved === 2).length})
        </button>
      </div>

      {/* Salons Grid */}
      {filteredSalons.length === 0 ? (
        <div className="no-data">
          <FaStore size={48} />
          <p>No salons found</p>
        </div>
      ) : (
        <div className="salons-grid">
          {filteredSalons.map((salon) => (
            <div key={salon.salonId} className="salon-card-admin">
              <div className="salon-header">
                <img
                  src={
                    salon.logo && salon.logo.startsWith('http')
                      ? salon.logo
                      : salon.logo
                        ? `http://localhost:8080/${salon.logo}`
                        : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Logo%3C/text%3E%3C/svg%3E'
                  }
                  alt={salon.salonName}
                  className="salon-logo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Logo%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="salon-header-info">
                  <h3>{salon.salonName}</h3>
                  {getStatusBadge(salon.isApproved)}
                </div>
              </div>

              <div className="salon-details">
                <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span>{salon.address}, {salon.city}, {salon.state} - {salon.pincode}</span>
                </div>
                
                {salon.phone && (
                  <div className="detail-item">
                    <FaPhone className="detail-icon" />
                    <span>{salon.phone}</span>
                  </div>
                )}
                
                {salon.email && (
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <span>{salon.email}</span>
                  </div>
                )}

                <div className="detail-item">
                  <span className="detail-label">Hours:</span>
                  <span>{salon.openingTime?.slice(0, 5)} - {salon.closingTime?.slice(0, 5)}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Rating:</span>
                  <span>{salon.ratingAverage?.toFixed(1) || '0.0'} ⭐ ({salon.totalReviews || 0} reviews)</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Owner:</span>
                  <span>{salon.owner?.user?.firstName} {salon.owner?.user?.lastName}</span>
                </div>
              </div>

              {salon.isApproved === 0 && (
                <div className="salon-actions">
                  <button
                    className="action-btn approve"
                    onClick={() => handleApproveSalon(salon.salonId)}
                  >
                    <FaCheckCircle /> Approve
                  </button>
                  <button
                    className="action-btn reject"
                    onClick={() => handleRejectSalon(salon.salonId)}
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </div>
              )}

              {salon.isApproved === 2 && (
                <div className="salon-actions">
                  <button
                    className="action-btn approve"
                    onClick={() => handleApproveSalon(salon.salonId)}
                  >
                    <FaCheckCircle /> Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageSalons;
