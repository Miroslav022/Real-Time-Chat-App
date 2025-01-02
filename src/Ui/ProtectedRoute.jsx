import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./Spinner";

function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  if (!user) {
    navigate("/auth/login");
  }
  return <Outlet />;
}

export default ProtectedRoute;
