import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaEdit, FaEye, FaStar, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import OwnerNavbar from '../../components/OwnerNavbar/OwnerNavbar';
import { getOwnerSalons, deleteSalon } from '../../services/ownerService';
import notify from '../../utils/notify';
import './MySalons.css';

const API_BASE_URL = 'http://localhost:8080';

const MySalons = () => {
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOwnerSalons();
  }, []);

  const fetchOwnerSalons = async () => {
    try {
      const response = await getOwnerSalons();
      setSalons(response.data);
    } catch (error) {
      console.error('Failed to fetch salons:', error);
      notify.error('Failed to load salons');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (salonId) => {
    navigate(`/owner/salon/${salonId}`);
  };

  const handleEditSalon = (salonId) => {
    navigate(`/owner/edit-salon/${salonId}`);
  };

  const handleDeleteSalon = async (salonId, salonName) => {
    if (window.confirm(`Are you sure you want to delete "${salonName}"? This action cannot be undone.`)) {
      try {
        await deleteSalon(salonId);
        notify.success('Salon deleted successfully');
        fetchOwnerSalons();
      } catch (error) {
        console.error('Failed to delete salon:', error);
        notify.error('Failed to delete salon');
      }
    }
  };

  const filteredSalons = salons.filter(salon =>
    salon.salonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="owner-layout">
        <OwnerNavbar />
        <div className="owner-content">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-layout">
      <OwnerNavbar />
      
      <div className="owner-content">
        <div className="page-header">
          <div>
            <h1>My Salons</h1>
            <p>Manage all your registered salons</p>
          </div>
          <button onClick={() => navigate('/owner/add-salon')} className="add-salon-btn">
            <FaStore /> Add New Salon
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search salons by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredSalons.length === 0 ? (
          <div className="no-salons">
            <FaStore />
            <h3>No Salons Found</h3>
            <p>You haven't registered any salons yet. Start by adding your first salon!</p>
            <button onClick={() => navigate('/owner/add-salon')} className="add-first-salon-btn">
              Add Your First Salon
            </button>
          </div>
        ) : (
          <div className="salons-grid">
            {filteredSalons.map((salon) => (
              <div key={salon.salonId} className="salon-card">
                <div className="salon-image">
                  {salon.logo ? (
                    <img 
                      src={salon.logo.startsWith('http') ? salon.logo : `${API_BASE_URL}/${salon.logo}`} 
                      alt={salon.salonName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const noImageEl = e.target.parentElement.querySelector('.no-image');
                        if (noImageEl) noImageEl.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="no-image" style={{ display: salon.logo ? 'none' : 'flex' }}>
                    <FaStore />
                  </div>
                  <div className="approval-badge">
                    {salon.isApproved === 1 ? (
                      <span className="approved">Approved</span>
                    ) : (
                      <span className="pending">Pending Approval</span>
                    )}
                  </div>
                </div>

                <div className="salon-details">
                  <h2>{salon.salonName}</h2>
                  
                  <div className="salon-meta">
                    <div className="meta-item">
                      <FaMapMarkerAlt />
                      <span>{salon.city}, {salon.state}</span>
                    </div>
                    
                    <div className="meta-item">
                      <FaPhone />
                      <span>{salon.phone}</span>
                    </div>

                    <div className="meta-item">
                      <FaStar />
                      <span>{salon.ratingAverage || '0.0'} ({salon.totalReviews || 0} reviews)</span>
                    </div>
                  </div>

                  <div className="salon-address">
                    <p>{salon.address}</p>
                  </div>

                  <div className="salon-timing">
                    <p>
                      <strong>Timings:</strong> {salon.openingTime} - {salon.closingTime}
                    </p>
                  </div>

                  <div className="salon-actions">
                    <button 
                      onClick={() => handleViewDetails(salon.salonId)} 
                      className="view-btn"
                      title="View Details"
                    >
                      <FaEye /> View
                    </button>
                    <button 
                      onClick={() => handleEditSalon(salon.salonId)} 
                      className="edit-btn"
                      title="Edit Salon"
                    >
                      <FaEdit /> Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySalons;
