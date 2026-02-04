import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OwnerNavbar from '../../components/OwnerNavbar/OwnerNavbar';
import { getSalonById, updateSalon } from '../../services/ownerService';
import notify from '../../utils/notify';
import './EditSalon.css';

const API_BASE_URL = 'http://localhost:8080';

const EditSalon = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [salon, setSalon] = useState(null);
  const [formData, setFormData] = useState({
    salonName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    openingTime: '',
    closingTime: '',
    workingDays: []
  });

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  useEffect(() => {
    fetchSalonData();
  }, [salonId]);

  const fetchSalonData = async () => {
    try {
      const response = await getSalonById(salonId);
      const salonData = response.data;
      setSalon(salonData);
      setFormData({
        salonName: salonData.salonName || '',
        address: salonData.address || '',
        city: salonData.city || '',
        state: salonData.state || '',
        pincode: salonData.pincode || '',
        phone: salonData.phone || '',
        email: salonData.email || '',
        openingTime: salonData.openingTime || '',
        closingTime: salonData.closingTime || '',
        workingDays: salonData.workingDays || []
      });
    } catch (error) {
      console.error('Failed to fetch salon:', error);
      notify.error('Failed to load salon details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkingDaysChange = (day) => {
    setFormData(prev => {
      const days = prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays: days };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.salonName || !formData.address || !formData.city || !formData.state || 
        !formData.pincode || !formData.phone || !formData.email || 
        !formData.openingTime || !formData.closingTime || formData.workingDays.length === 0) {
      notify.error('Please fill all required fields');
      return;
    }

    // Format times to HH:mm (remove seconds if present)
    const formatTime = (time) => {
      if (!time) return time;
      return time.substring(0, 5); // Extract only HH:mm
    };

    const dataToSend = {
      ...formData,
      openingTime: formatTime(formData.openingTime),
      closingTime: formatTime(formData.closingTime)
    };

    console.log('Submitting form data:', dataToSend);
    
    try {
      const response = await updateSalon(salonId, dataToSend);
      console.log('Update response:', response);
      notify.success('Salon updated successfully');
      navigate(`/owner/salon/${salonId}`);
    } catch (error) {
      console.error('Failed to update salon:', error);
      console.error('Error response:', error.response?.data);
      notify.error(error.response?.data?.message || 'Failed to update salon');
    }
  };

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
        <div className="edit-header">
          <button onClick={() => navigate(`/owner/salon/${salonId}`)} className="back-btn">
            ← Back to Details
          </button>
          <h1>Edit Salon Details</h1>
        </div>

        <div className="edit-salon-container">
          <form onSubmit={handleSubmit} className="edit-salon-form">
            
            {/* Salon Logo */}
            {salon && salon.logo && (
              <div className="form-section">
                <h2>Current Salon Logo</h2>
                <div className="current-logo-display">
                  <img 
                    src={salon.logo.startsWith('http') ? salon.logo : `${API_BASE_URL}/${salon.logo}`}
                    alt="Salon Logo"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const placeholder = document.createElement('div');
                      placeholder.style.cssText = 'width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 8px; color: #999;';
                      placeholder.textContent = 'No Logo';
                      e.target.parentElement.appendChild(placeholder);
                    }}
                  />
                  <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>To update the logo, go to Salon Details page</p>
                </div>
              </div>
            )}
            
            {/* Basic Information */}
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Salon Name *</label>
                  <input
                    type="text"
                    name="salonName"
                    value={formData.salonName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="form-section">
              <h2>Address Information</h2>
              
              <div className="form-group">
                <label>Full Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="form-section">
              <h2>Operating Hours</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Opening Time *</label>
                  <input
                    type="time"
                    name="openingTime"
                    value={formData.openingTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Closing Time *</label>
                  <input
                    type="time"
                    name="closingTime"
                    value={formData.closingTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Working Days *</label>
                <div className="working-days">
                  {daysOfWeek.map(day => (
                    <label key={day} className="day-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.workingDays.includes(day)}
                        onChange={() => handleWorkingDaysChange(day)}
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate(`/owner/salon/${salonId}`)} 
                className="cancel-btn"
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSalon;