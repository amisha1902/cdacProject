import api from "./api";

// Get all customers
export const getCustomers = () =>
  api.get("/api/admin/getAllCustomers");

// Block customer
export const blockCustomer = (userId) =>
  api.put(`/api/admin/customer/${userId}/block`);

// Unblock customer
export const unblockCustomer = (userId) =>
  api.put(`/api/admin/customer/${userId}/unblock`);



export const getOwners = () =>
  api.get("/api/admin/owners/pending");

export const approveOwner = (userId) =>
  api.put(`/api/admin/owners/${userId}/approve`);

export const rejectOwner = (userId) =>
  api.put(`/api/admin/owners/${userId}/reject`);
