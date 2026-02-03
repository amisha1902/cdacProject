import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import OwnerNavbar from "../../components/OwnerNavbar/OwnerNavbar";
import { createSalon, uploadSalonLogo, uploadSalonGallery } from "../../services/ownerService";
import notify from "../../utils/notify";
import "./RegisterSalon.css";

const RegisterSalon = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    salonName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    openingTime: "",
    closingTime: "",
    workingDays: [],
    categories: []
  });

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        notify.error("Logo file size must be less than 5MB");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + galleryFiles.length > 5) {
      notify.error("You can upload maximum 5 gallery images");
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        notify.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });

    setGalleryFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  // Category and Service Management
  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, {
        categoryName: "",
        description: "",
        services: []
      }]
    }));
  };

  const removeCategory = (categoryIndex) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== categoryIndex)
    }));
  };

  const updateCategory = (categoryIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === categoryIndex ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const addService = (categoryIndex) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === categoryIndex 
          ? { 
              ...cat, 
              services: [...cat.services, {
                serviceName: "",
                description: "",
                basePrice: "",
                durationMinutes: "",
                serviceCapacity: 5
              }]
            }
          : cat
      )
    }));
  };

  const removeService = (categoryIndex, serviceIndex) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === categoryIndex
          ? { ...cat, services: cat.services.filter((_, si) => si !== serviceIndex) }
          : cat
      )
    }));
  };

  const updateService = (categoryIndex, serviceIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === categoryIndex
          ? {
              ...cat,
              services: cat.services.map((srv, si) =>
                si === serviceIndex ? { ...srv, [field]: value } : srv
              )
            }
          : cat
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.workingDays.length === 0) {
      notify.error("Please select at least one working day");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create salon
      const salonResponse = await createSalon(formData);
      const salonId = salonResponse.data.salonId;

      // Step 2: Upload logo if provided
      if (logoFile) {
        try {
          await uploadSalonLogo(salonId, logoFile);
        } catch (error) {
          console.error("Failed to upload logo:", error);
          notify.warning("Salon created but logo upload failed");
        }
      }

      // Step 3: Upload gallery images if provided
      if (galleryFiles.length > 0) {
        try {
          await uploadSalonGallery(salonId, galleryFiles);
        } catch (error) {
          console.error("Failed to upload gallery:", error);
          notify.warning("Salon created but gallery upload failed");
        }
      }

      notify.success("Salon registered successfully! Waiting for admin approval.");
      navigate("/owner/my-salons");
    } catch (error) {
      console.error("Failed to register salon:", error);
      notify.error(error.response?.data?.message || "Failed to register salon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="owner-layout">
      <OwnerNavbar />

      <div className="owner-content">
        <div className="register-salon-header">
          <h1>Register New Salon</h1>
          <p>Add your salon to Glamora Beauty network</p>
        </div>

        <div className="register-salon-container">
          <form onSubmit={handleSubmit} className="salon-form">

            {/* Basic Information */}
            <div className="form-section">
              <h2>Basic Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>Salon Name *</label>
                  <input
                    type="text"
                    name="salonName"
                    placeholder="Enter salon name"
                    value={formData.salonName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="salon@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="form-section">
              <h2>Address Information</h2>

              <div className="form-group">
                <label>Full Address *</label>
                <textarea
                  name="address"
                  placeholder="Enter complete address"
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
                    placeholder="City"
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
                    placeholder="State"
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
                    placeholder="Pincode"
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

            {/* Salon Images */}
            <div className="form-section">
              <h2>Salon Images</h2>

              {/* Logo Upload */}
              <div className="form-group">
                <label>Salon Logo</label>
                <div className="file-upload-area">
                  {!logoPreview ? (
                    <label htmlFor="logo-upload" className="upload-label">
                      <FaCloudUploadAlt className="upload-icon" />
                      <p>Click to upload logo</p>
                      <span>Max size: 5MB</span>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  ) : (
                    <div className="image-preview-container">
                      <img src={logoPreview} alt="Logo preview" className="logo-preview" />
                      <button type="button" onClick={removeLogo} className="remove-image-btn">
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Upload */}
              <div className="form-group">
                <label>Gallery Images (Max 5)</label>
                <div className="file-upload-area">
                  <label htmlFor="gallery-upload" className="upload-label">
                    <FaCloudUploadAlt className="upload-icon" />
                    <p>Click to upload gallery images</p>
                    <span>Max 5 images, 5MB each</span>
                    <input
                      id="gallery-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryChange}
                      style={{ display: 'none' }}
                      disabled={galleryFiles.length >= 5}
                    />
                  </label>
                </div>

                {galleryPreviews.length > 0 && (
                  <div className="gallery-previews">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="gallery-preview-item">
                        <img src={preview} alt={`Gallery ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="remove-image-btn"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Service Categories Section */}
            <div className="form-section">
              <div className="section-header">
                <h2>Service Categories & Services</h2>
                <button type="button" onClick={addCategory} className="add-category-btn">
                  <FaPlus /> Add Category
                </button>
              </div>

              {formData.categories.map((category, catIndex) => (
                <div key={catIndex} className="category-block">
                  <div className="category-header">
                    <h3>Category {catIndex + 1}</h3>
                    <button 
                      type="button" 
                      onClick={() => removeCategory(catIndex)}
                      className="remove-btn"
                    >
                      <FaTrash /> Remove Category
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Category Name *</label>
                      <input
                        type="text"
                        placeholder="e.g., Hair Care, Skin Care, Nails"
                        value={category.categoryName}
                        onChange={(e) => updateCategory(catIndex, 'categoryName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        placeholder="Brief description"
                        value={category.description}
                        onChange={(e) => updateCategory(catIndex, 'description', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Services for this category */}
                  <div className="services-section">
                    <div className="services-header">
                      <h4>Services</h4>
                      <button 
                        type="button" 
                        onClick={() => addService(catIndex)}
                        className="add-service-btn"
                      >
                        <FaPlus /> Add Service
                      </button>
                    </div>

                    {category.services.map((service, srvIndex) => (
                      <div key={srvIndex} className="service-block">
                        <div className="service-row">
                          <div className="form-group">
                            <label>Service Name *</label>
                            <input
                              type="text"
                              placeholder="e.g., Haircut, Facial"
                              value={service.serviceName}
                              onChange={(e) => updateService(catIndex, srvIndex, 'serviceName', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Price (₹) *</label>
                            <input
                              type="number"
                              placeholder="500"
                              value={service.basePrice}
                              onChange={(e) => updateService(catIndex, srvIndex, 'basePrice', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Duration (min) *</label>
                            <input
                              type="number"
                              placeholder="30"
                              value={service.durationMinutes}
                              onChange={(e) => updateService(catIndex, srvIndex, 'durationMinutes', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Capacity *</label>
                            <input
                              type="number"
                              placeholder="5"
                              min="1"
                              max="10"
                              value={service.serviceCapacity}
                              onChange={(e) => updateService(catIndex, srvIndex, 'serviceCapacity', e.target.value)}
                              required
                            />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeService(catIndex, srvIndex)}
                            className="remove-service-btn"
                            title="Remove Service"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            placeholder="Service description"
                            value={service.description}
                            onChange={(e) => updateService(catIndex, srvIndex, 'description', e.target.value)}
                            rows="2"
                          />
                        </div>
                      </div>
                    ))}

                    {category.services.length === 0 && (
                      <p className="no-services-text">No services added yet. Click "Add Service" to add services.</p>
                    )}
                  </div>
                </div>
              ))}

              {formData.categories.length === 0 && (
                <p className="no-categories-text">
                  No categories added yet. Click "Add Category" to start adding service categories.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="button" onClick={() => navigate("/owner/dashboard")} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Registering..." : "Register Salon"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterSalon;

