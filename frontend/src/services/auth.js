export const getToken = () => localStorage.getItem("token");

export const getRole = () => localStorage.getItem("role");

export const isAdmin = () => getRole() === "ADMIN";

export const isAdminOrOwner = () => {
  const role = getRole();
  return role === "ADMIN" || role === "OWNER";
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};
