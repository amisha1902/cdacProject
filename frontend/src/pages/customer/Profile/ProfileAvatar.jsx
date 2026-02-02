import React from "react";
import "./ProfileAvatar.css";

const ProfileAvatar = ({ firstName, lastName, imageUrl }) => {
  // 🔹 Generate initials safely
  const initials =
    firstName && lastName
      ? firstName[0].toUpperCase() + lastName[0].toUpperCase()
      : firstName
      ? firstName[0].toUpperCase()
      : "U";

  return (
    <div className="avatar">
      {imageUrl ? (
        <img src={imageUrl} alt="Profile" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default ProfileAvatar;
