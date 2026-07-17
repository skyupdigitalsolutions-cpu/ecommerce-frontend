import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { user, booting } = useAuth();
  const location = useLocation();

  if (booting) return <Loader />;
  if (!user) {
    // Remember where they were headed so we can return after login.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}
