import axios from "./api";

/* ================= AUTH ================= */

// LOGIN
export const loginUser = (data) => {
  return axios.post("/users/login", data);
};

// CUSTOMER REGISTRATION
export const registerCustomer = (data) => {
  return axios.post("/users/register/customer", data);
};

// OWNER REGISTRATION
export const registerOwner = (data) => {
  return axios.post("/users/register/owner", data);
};

/* ================= USERS ================= */

// GET ALL USERS (Admin)
export const getAllUsers = () => {
  return axios.get("/users/getUsers");
};

// DELETE USER
export const deleteUser = (id) => {
  return axios.delete(`/users/removeUser/${id}`);
};

/* ================= PROFILE ================= */

export const getProfile = () =>
  axios.get(`/users/profile`);

export const updateProfile = (id, data) =>
  axios.put(`/users/profile/${id}`, data);

export const changePassword = (id, data) =>
  axios.put(`/users/change-password/${id}`, data);

export const uploadProfileImage = (id, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return axios.post(`/users/upload-image/${id}`, formData);
};
