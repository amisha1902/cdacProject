import React from "react";
import "./ImageAvatar.css";

const ImageAvatar = ({ name, imageUrl }) => {
  const initials = name
    ? name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="navbar-avatar">
      {imageUrl ? (
        <img src={imageUrl} alt="Profile" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default ImageAvatar;
