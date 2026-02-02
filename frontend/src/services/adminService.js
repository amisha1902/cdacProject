import api from "./api";

// CUSTOMERS
export const getCustomers = () => api.get("/api/admin/customers");

export const blockCustomer = (userId) =>
  api.put(`/api/admin/customers/${userId}/block`);

export const unblockCustomer = (userId) =>
  api.put(`/api/admin/customers/${userId}/unblock`);

// OWNERS
export const getOwners = () => api.get("/api/admin/owners");

export const approveOwner = (ownerId) =>
  api.put(`/api/admin/owners/${ownerId}/approve`);

export const rejectOwner = (ownerId) =>
  api.put(`/api/admin/owners/${ownerId}/reject`);
