import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

// Only lets admins through. Logged-in non-admins are bounced to the shop;
// signed-out users go to login.
export default function AdminRoute({ children }) {
  const { user, booting } = useAuth();
  if (booting) return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: "/admin" }} replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
