import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import Spinner from "./Spinner";
import { SignalRProvider } from "../context/SignalRContext";

function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) navigate("/");
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <SignalRProvider>
      <Outlet />
    </SignalRProvider>
  );
}

export default ProtectedRoute;
