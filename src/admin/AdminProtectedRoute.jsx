// src/admin/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "./fakeAuth";

export default function AdminProtectedRoute({ children }) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}