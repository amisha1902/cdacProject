import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCalendar, FaEdit, FaCut, FaPlus, FaSyncAlt } from 'react-icons/fa';
import OwnerNavbar from '../../components/OwnerNavbar/OwnerNavbar';
import { getSalonById, getSalonCategories, addCategoryToSalon, generateSlots } from '../../services/ownerService';
import api from '../../services/api';
import notify from '../../utils/notify';
import './SalonDetails.css';

const API_BASE_URL = 'http://localhost:8080';

const SalonDetails = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    description: '',
    services: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [generatingSlots, setGeneratingSlots] = useState(false);

  useEffect(() => {
    fetchSalonDetails();
    fetchReviews();
  }, [salonId]);

  const fetchReviews = async () => {
    try {
      const [reviewsRes, avgRes] = await Promise.all([
        api.get(`/api/reviews/salon/${salonId}`),
        api.get(`/api/reviews/salon/${salonId}/average`)
      ]);
      setReviews(reviewsRes.data || []);
      setAverageRating(avgRes.data || 0);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  const fetchSalonDetails = async () => {
    try {
      const response = await getSalonById(salonId);
      setSalon(response.data);
      
      // Fetch categories and services
      try {
        const categoriesResponse = await getSalonCategories(salonId);
        setCategories(categoriesResponse.data || []);
      } catch (catError) {
        console.error('Failed to fetch categories:', catError);
        // Don't show error to user, just log it
      }
    } catch (error) {
      console.error('Failed to fetch salon details:', error);
      notify.error('Failed to load salon details');
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    setNewCategory({
      ...newCategory,
      services: [
        ...newCategory.services,
        {
          serviceName: '',
          description: '',
          basePrice: '',
          durationMinutes: '',
          serviceCapacity: 5
        }
      ]
    });
  };

  const updateService = (index, field, value) => {
    const updated = [...newCategory.services];
    updated[index][field] = value;
    setNewCategory({ ...newCategory, services: updated });
  };

  const removeService = (index) => {
    const updated = newCategory.services.filter((_, i) => i !== index);
    setNewCategory({ ...newCategory, services: updated });
  };

  const handleSubmitCategory = async () => {
    if (!newCategory.categoryName.trim()) {
      notify.error('Category name is required');
      return;
    }

    if (newCategory.services.length === 0) {
      notify.error('At least one service is required');
      return;
    }

    for (const service of newCategory.services) {
      if (!service.serviceName.trim() || !service.basePrice || !service.durationMinutes) {
        notify.error('All service fields are required');
        return;
      }
    }

    setSubmitting(true);
    try {
      await addCategoryToSalon(salonId, newCategory);
      notify.success('Category and services added successfully!');
      setShowAddModal(false);
      setNewCategory({
        categoryName: '',
        description: '',
        services: []
      });
      fetchSalonDetails(); // Refresh
    } catch (error) {
      console.error('Failed to add category:', error);
      notify.error('Failed to add category. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateSlots = async () => {
    setGeneratingSlots(true);
    try {
      await generateSlots();
      notify.success('Slots generated successfully for next 30 days!');
    } catch (error) {
      console.error('Failed to generate slots:', error);
      notify.error('Failed to generate slots. Please try again.');
    } finally {
      setGeneratingSlots(false);
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

  if (!salon) {
    return (
      <div className="owner-layout">
        <OwnerNavbar />
        <div className="owner-content">
          <div className="error-message">Salon not found</div>
        </div>
      </div>
    );
  }

  const workingDaysDisplay = salon.workingDays ? salon.workingDays.join(', ') : 'Not specified';

  return (
    <div className="owner-layout">
      <OwnerNavbar />
      
      <div className="owner-content">
        <div className="detail-header">
          <button onClick={() => navigate('/owner/my-salons')} className="back-btn">
            ← Back to My Salons
          </button>
          <button onClick={() => navigate(`/owner/edit-salon/${salonId}`)} className="edit-header-btn">
            <FaEdit /> Edit Salon
          </button>
        </div>

        <div className="salon-detail-container">
          {/* Salon Header */}
          <div className="salon-header-section">
            <div className="salon-logo-large">
              {salon.logo ? (
                <img 
                  src={salon.logo.startsWith('http') ? salon.logo : `${API_BASE_URL}/${salon.logo}`} 
                  alt={salon.salonName}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'no-logo';
                    placeholder.textContent = 'No Logo';
                    e.target.parentElement.appendChild(placeholder);
                  }}
                />
              ) : (
                <div className="no-logo">No Logo</div>
              )}
            </div>
            
            <div className="salon-header-info">
              <h1>{salon.salonName}</h1>
              
              <div className="approval-status">
                {salon.isApproved === 1 ? (
                  <span className="status approved">✓ Approved</span>
                ) : (
                  <span className="status pending">⏳ Pending Approval</span>
                )}
              </div>

              <div className="rating-display">
                <FaStar />
                <span className="rating-value">{salon.ratingAverage || '0.0'}</span>
                <span className="review-count">({salon.totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="info-section">
            <h2>Contact Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <FaPhone className="info-icon" />
                <div>
                  <label>Phone</label>
                  <p>{salon.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div>
                  <label>Email</label>
                  <p>{salon.email || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div>
                  <label>Address</label>
                  <p>{salon.address}, {salon.city}, {salon.state} - {salon.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="info-section">
            <h2>Operating Hours</h2>
            <div className="info-grid">
              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <label>Timings</label>
                  <p>{salon.openingTime} - {salon.closingTime}</p>
                </div>
              </div>
              
              <div className="info-item">
                <FaCalendar className="info-icon" />
                <div>
                  <label>Working Days</label>
                  <p>{workingDaysDisplay}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          {salon.galleryImages && salon.galleryImages.length > 0 && (
            <div className="info-section">
              <h2>Gallery</h2>
              <div className="gallery-grid">
                {(() => {
                  try {
                    const images = typeof salon.galleryImages === 'string' 
                      ? JSON.parse(salon.galleryImages) 
                      : salon.galleryImages;
                    return images.map((image, index) => (
                      <div key={index} className="gallery-item">
                        <img 
                          src={image.startsWith('http') ? image : `${API_BASE_URL}/${image}`} 
                          alt={`Gallery ${index + 1}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ));
                  } catch (error) {
                    console.error('Error parsing gallery images:', error);
                    return <p>Unable to load gallery images</p>;
                  }
                })()}
              </div>
            </div>
          )}

          {/* Services */}
          <div className="info-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2><FaCut /> Services Offered</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-success"
                  onClick={handleGenerateSlots}
                  disabled={generatingSlots}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                >
                  <FaSyncAlt className={generatingSlots ? 'spinning' : ''} /> 
                  {generatingSlots ? 'Generating...' : 'Generate Slots'}
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                >
                  <FaPlus /> Add Category
                </button>
              </div>
            </div>
            {categories && categories.length > 0 ? (
              <div className="services-list">
                {categories.map((category) => (
                  <div key={category.categoryId} className="service-category">
                    <h3>{category.categoryName}</h3>
                    {category.description && (
                      <p className="category-description">{category.description}</p>
                    )}
                    {category.services && category.services.length > 0 ? (
                      <div className="services-grid">
                        {category.services.map((service) => (
                          <div key={service.serviceId} className="service-item">
                            <div className="service-info">
                              <p className="service-name">{service.serviceName}</p>
                              {service.description && (
                                <p className="service-desc">{service.description}</p>
                              )}
                            </div>
                            <div className="service-details">
                              <span className="service-price">₹{service.basePrice}</span>
                              <span className="service-duration">{service.durationMinutes} mins</span>
                              {service.serviceCapacity && (
                                <span className="service-capacity">Capacity: {service.serviceCapacity}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-services">No services added for this category yet.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-services">No service categories added yet. Click "Add Category" to get started.</p>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="info-section">
            <h2>Customer Reviews ({reviews.length})</h2>
            {averageRating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <FaStar color="#ffc107" size={24} />
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{averageRating.toFixed(1)}</span>
                <span style={{ color: '#666' }}>out of 5</span>
              </div>
            )}
            
            {reviews.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No reviews yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {reviews.map((review) => (
                  <div key={review.reviewId} style={{
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <strong>{review.customerName || 'Customer'}</strong>
                        <div style={{ display: 'flex', gap: '3px', marginTop: '5px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={14}
                              color={star <= review.rating ? '#ffc107' : '#e4e5e9'}
                            />
                          ))}
                        </div>
                      </div>
                      <small style={{ color: '#666' }}>
                        {new Date(review.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </small>
                    </div>
                    {review.comment && (
                      <p style={{ margin: '8px 0 0 0', color: '#444' }}>{review.comment}</p>
                    )}
                    {review.isVerified && (
                      <span style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        padding: '2px 8px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}>
                        Verified
                      </span>
                    )}
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                      Booking #{review.bookingId}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Service Category</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCategory.categoryName}
                  onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                  placeholder="e.g., Hair, Skin, Nails"
                />
              </div>

              <div className="form-group">
                <label>Category Description</label>
                <textarea
                  className="form-control"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Describe this category"
                  rows="3"
                />
              </div>

              <div className="services-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3>Services *</h3>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={addService}>
                    <FaPlus /> Add Service
                  </button>
                </div>

                {newCategory.services.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#666' }}>No services added. Click "Add Service" to start.</p>
                )}

                {newCategory.services.map((service, index) => (
                  <div key={index} className="service-form-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4>Service {index + 1}</h4>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-danger"
                        onClick={() => removeService(index)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Service Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={service.serviceName}
                          onChange={(e) => updateService(index, 'serviceName', e.target.value)}
                          placeholder="e.g., Haircut, Facial"
                        />
                      </div>

                      <div className="form-group">
                        <label>Price (₹) *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={service.basePrice}
                          onChange={(e) => updateService(index, 'basePrice', e.target.value)}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Duration (minutes) *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={service.durationMinutes}
                          onChange={(e) => updateService(index, 'durationMinutes', e.target.value)}
                          placeholder="30"
                          min="15"
                          step="15"
                        />
                      </div>

                      <div className="form-group">
                        <label>Capacity *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={service.serviceCapacity}
                          onChange={(e) => updateService(index, 'serviceCapacity', e.target.value)}
                          placeholder="5"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        placeholder="Describe this service"
                        rows="2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowAddModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmitCategory}
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonDetails;
