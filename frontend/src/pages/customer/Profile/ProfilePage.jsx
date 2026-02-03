import React, { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage
} from "../../../services/userService";
import notify from "../../../utils/notify";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfilePage = () => {
  const userId = localStorage.getItem("userId");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: null
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: ""
  });

  /* 🔐 LOAD PROFILE */
  useEffect(() => {
    getProfile()
      .then(res => setProfile(res.data))
      .catch(() => notify.error("Failed to load profile"));
  }, []);

  const initials =
    (profile.firstName?.charAt(0).toUpperCase() || "") +
    (profile.lastName?.charAt(0).toUpperCase() || "");

  /* UPDATE PROFILE */
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(userId, profile);
      notify.success("Profile updated");
    } catch (err) {
      notify.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  /* CHANGE PASSWORD */
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await changePassword(userId, passwordData);
      notify.success("Password updated");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      notify.error(err.response?.data?.message || "Failed to update password");
    }
  };

  /* IMAGE UPLOAD */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadProfileImage(userId, file);
    window.location.reload();
  };

  return (
    <div className="container py-5" style={{ maxWidth: 980 }}>
      <h3 className="fw-semibold mb-4">My Profile</h3>

      <div className="col-lg-12 d-flex">
        {/* LEFT — PROFILE CARD */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 text-center p-4">
            {profile.profileImage ? (
              <img
                src={`http://localhost:8080/images/${profile.profileImage}`}
                alt="profile"
                className="rounded-circle mx-auto mb-3"
                style={{ width: 96, height: 96, objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 96, height: 96, fontSize: 32, fontWeight: 600 }}
              >
                {initials || "U"}
              </div>
            )}

            <h5 className="mb-1 fw-semibold">
              {profile.firstName} {profile.lastName}
            </h5>
            <p className="text-muted mb-1 small">{profile.email}</p>
            <p className="text-muted small">{profile.phone || "—"}</p>

            <label className="btn btn-outline-dark btn-sm mt-2">
              Change Photo
              <input type="file" hidden onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        {/* RIGHT — FORMS */}
        <div className="col-md-12 ms-4">
          <div className="card shadow-sm border-0 p-4 mb-4">
            <h5 className="fw-semibold mb-3">Edit Profile</h5>

            <form onSubmit={handleProfileSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small text-muted">First Name</label>
                  <input
                    className="form-control"
                    name="firstName"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-muted">Last Name</label>
                  <input
                    className="form-control"
                    name="lastName"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-muted">Email</label>
                  <input className="form-control" value={profile.email} disabled />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-muted">Phone</label>
                  <input
                    className="form-control"
                    name="phone"
                    value={profile.phone || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <button className="btn btn-danger mt-4 px-4" type="submit">
                Save Changes
              </button>
            </form>
          </div>

          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-semibold mb-3">Change Password</h5>

            <form onSubmit={handlePasswordChange}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small text-muted">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value
                      })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-muted">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <button className="btn btn-outline-dark mt-4 px-4" type="submit">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
