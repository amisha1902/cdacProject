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

// Get pending owners
export const getOwners = () =>
  api.get("/api/admin/owners/pending");

export const approveOwner = (userId) =>
  api.put(`/api/admin/owners/${userId}/approve`);

export const rejectOwner = (userId) =>
  api.put(`/api/admin/owners/${userId}/reject`);

// Get all salons
export const getAllSalons = () =>
  api.get("/api/admin/salons");

// Approve salon
export const approveSalon = (salonId) =>
  api.put(`/api/admin/salons/${salonId}/approve`);

// Reject salon
export const rejectSalon = (salonId) =>
  api.put(`/api/admin/salons/${salonId}/reject`);
