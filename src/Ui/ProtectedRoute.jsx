import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    navigate("/auth/login");
  }
  return <Outlet />;
}

export default ProtectedRoute;
