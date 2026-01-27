import api from "./axiosConfig";

// 🔹 Register Customer
export const registerCustomer = (customerData) => {
  return api.post("/users/addCustomer", customerData);
};

// 🔹 Register Owner
export const registerOwner = (ownerData) => {
  return api.post("/users/addOwner", ownerData);
};

// 🔹 Get All Users
export const getAllUsers = () => {
  return api.get("/users/getUsers");
};

// 🔹 Delete User
export const deleteUser = (userId) => {
  return api.delete(`/users/removeUser/${userId}`);
};
