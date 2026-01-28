import React from "react";
import "./ProfilePage.css";
import profile from "../../../../images/profile.jpeg";

function ProfilePage() {
  return (
    <div className="profile-bg d-flex align-items-center justify-content-center py-4">
      <div
        className="container blur-box shadow-lg p-4 mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="text-center mb-4">
          <img
            src={profile}
            alt="Profile"
            className="rounded-circle border border-light"
            style={{ width: "115px", height: "115px", objectFit: "cover" }}
          />

          <h2 className="mt-3">Alex Carey</h2>
          <p className="mb-1 opacity-75">alex@gmail.com</p>
          <p className="opacity-75">+91 • 9876543210</p>

          <div className="d-flex justify-content-center gap-2 mt-3">
            <button className="btn btn-light btn-sm">Edit Profile</button>
            <button className="btn btn-light btn-sm">Change Photo</button>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <div className="p-3 rounded bg-light bg-opacity-50 border h-100">
              <h5 className="text-center mb-3">Address</h5>
              <p className="mb-1">N-12/5, Pune</p>
              <p>Maharashtra – 411045</p>
              <button className="btn btn-light btn-sm">Edit</button>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-3 rounded bg-light bg-opacity-50 border h-100">
              <h5 className="text-center mb-3">Upcoming Appointment</h5>
              <p className="mb-1">Haircut — 12 Jan 2025</p>
              <p>11:30 AM — Salon Service</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded bg-light">

        </div>

        <div className="p-3 rounded bg-dark bg-opacity-10 border">
          <h5 className="text-center mb-3">Appointment History</h5>

          <div className="d-flex justify-content-between bg-dark bg-opacity-10 p-2 rounded mb-2">
            <p className="mb-0">Facial — 10 Dec 2024 — Completed</p>
            <p className="mb-0">₹800</p>
          </div>

          <div className="d-flex justify-content-between bg-dark bg-opacity-10 p-2 rounded mb-2">
            <p className="mb-0">Haircut — 05 Sep 2024 — Completed</p>
            <p className="mb-0">₹200</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
