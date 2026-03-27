// src/admin/fakeAuth.js

export const loginAdmin = (email, password) => {
  if (email === "admin@huriacollection.com" && password === "Huria12345@") {
    localStorage.setItem("adminToken", "fake-admin-token");
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
};

export const isAdminLoggedIn = () => {
  return !!localStorage.getItem("adminToken");
};