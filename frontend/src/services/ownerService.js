import axios from "./api";

/* ================= OWNER DASHBOARD ================= */

// Get dashboard statistics
export const getOwnerDashboardStats = () => {
  return axios.get("/api/owner/dashboard/stats");
};

// Get owner bookings
export const getOwnerBookings = () => {
  return axios.get("/api/owner/bookings");
};

/* ================= SALON MANAGEMENT ================= */

// Get all salons for the logged-in owner
export const getOwnerSalons = () => {
  return axios.get("/api/owner/salons");
};

// Get salon by ID
export const getSalonById = (salonId) => {
  return axios.get(`/api/owner/salons/${salonId}`);
};

// Create new salon
export const createSalon = (salonData) => {
  return axios.post("/api/owner/salons", salonData);
};

// Update salon
export const updateSalon = (salonId, salonData) => {
  return axios.put(`/api/owner/salons/${salonId}`, salonData);
};

// Delete salon
export const deleteSalon = (salonId) => {
  return axios.delete(`/api/owner/salons/${salonId}`);
};

// Upload salon logo
export const uploadSalonLogo = (salonId, file) => {
  const formData = new FormData();
  formData.append("logo", file);
  return axios.post(`/api/owner/salons/${salonId}/logo`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

// Upload salon gallery images
export const uploadSalonGallery = (salonId, files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append("images", file);
  });
  return axios.post(`/api/owner/salons/${salonId}/gallery`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

/* ================= BOOKINGS ================= */

// Get bookings for a specific salon
export const getSalonBookings = (salonId) => {
  return axios.get(`/owner/salons/${salonId}/bookings`);
};

// Update booking status
export const updateBookingStatus = (bookingId, status) => {
  return axios.put(`/owner/bookings/${bookingId}/status`, { status });
};

// Confirm booking
export const confirmBooking = (bookingId) => {
  return axios.put(`/owner/bookings/${bookingId}/confirm`);
};

// Cancel booking
export const cancelBooking = (bookingId, reason) => {
  return axios.put(`/owner/bookings/${bookingId}/cancel`, { reason });
};

/* ================= SERVICES ================= */

// Get services for a salon
export const getSalonServices = (salonId) => {
  return axios.get(`/owner/salons/${salonId}/services`);
};

// Add service to salon
export const addService = (salonId, serviceData) => {
  return axios.post(`/owner/salons/${salonId}/services`, serviceData);
};

// Update service
export const updateService = (salonId, serviceId, serviceData) => {
  return axios.put(`/owner/salons/${salonId}/services/${serviceId}`, serviceData);
};

// Delete service
export const deleteService = (salonId, serviceId) => {
  return axios.delete(`/owner/salons/${salonId}/services/${serviceId}`);
};

// Get salon categories with services
export const getSalonCategories = (salonId) => {
  return axios.get(`/api/owner/salons/${salonId}/categories`);
};

// Add category to salon
export const addCategoryToSalon = (salonId, categoryData) => {
  return axios.post(`/api/owner/salons/${salonId}/categories`, categoryData);
};

/* ================= ANALYTICS ================= */

// Get salon analytics
export const getSalonAnalytics = (salonId, period = "month") => {
  return axios.get(`/owner/salons/${salonId}/analytics`, {
    params: { period }
  });
};

// Get revenue reports
export const getRevenueReport = (startDate, endDate) => {
  return axios.get("/owner/reports/revenue", {
    params: { startDate, endDate }
  });
};

// Generate slots for all services
export const generateSlots = () => {
  return axios.post("/api/admin/services/internal/slots/generate-now", {});
};
