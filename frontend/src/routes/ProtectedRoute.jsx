import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.jsx";
import Spinner from "../components/Spinner.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spinner label="Loading your workspace..." />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

