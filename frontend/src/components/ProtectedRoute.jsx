import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to login
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  // All good → show the page
  return children;
}