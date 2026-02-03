import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import OwnerNavbar from '../../components/OwnerNavbar/OwnerNavbar';
import { getProfile, updateProfile, changePassword } from '../../services/userService';
import notify from '../../utils/notify';
import './OwnerProfile.css';

const OwnerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        email: response.data.email || '',
        phone: response.data.phone || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      notify.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(profile.userId, formData);
      notify.success('Profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      notify.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notify.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      notify.error('Password must be at least 6 characters');
      return;
    }

    try {
      await changePassword(profile.userId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      notify.success('Password changed successfully');
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      notify.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || ''
    });
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
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>

        <div className="profile-container">
          {/* Profile Information Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Profile Information</h2>
              {!editMode && (
                <button onClick={() => setEditMode(true)} className="edit-btn">
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={cancelEdit} className="cancel-btn">
                    <FaTimes /> Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    <FaSave /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <FaUser className="info-icon" />
                  <div>
                    <label>Full Name</label>
                    <p>{profile.firstName} {profile.lastName}</p>
                  </div>
                </div>

                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div>
                    <label>Email Address</label>
                    <p>{profile.email}</p>
                  </div>
                </div>

                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <div>
                    <label>Phone Number</label>
                    <p>{profile.phone}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">👤</div>
                  <div>
                    <label>Role</label>
                    <p className="role-badge">{profile.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Password Change Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Change Password</h2>
              {!showPasswordForm && (
                <button onClick={() => setShowPasswordForm(true)} className="edit-btn">
                  <FaEdit /> Change Password
                </button>
              )}
            </div>

            {showPasswordForm ? (
              <form onSubmit={handleChangePassword} className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }} 
                    className="cancel-btn"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    <FaSave /> Update Password
                  </button>
                </div>
              </form>
            ) : (
              <div className="password-info">
                <p>Keep your account secure by using a strong password.</p>
              </div>
            )}
          </div>

          {/* Account Statistics */}
          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="account-stats">
              <div className="stat-item">
                <label>Account Type</label>
                <p>Owner Account</p>
              </div>
              <div className="stat-item">
                <label>Member Since</label>
                <p>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="stat-item">
                <label>Status</label>
                <p className="status-active">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
