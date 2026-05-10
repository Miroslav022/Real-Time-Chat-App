import { Navigate, Outlet } from "react-router-dom";
import Spinner from "./Spinner";
import { SignalRProvider } from "../context/SignalRContext";
import { OnlineUsersProvider } from "../context/OnlineUsersContext";
import { useAuth } from "../context/AuthProvider";

function ProtectedRoute() {
  const { isLoading, user } = useAuth();

  if (isLoading && !user) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!user && !isLoading) return <Navigate to="/auth/login" replace />;

  return (
    <SignalRProvider>
      <OnlineUsersProvider>
        <Outlet />
      </OnlineUsersProvider>
    </SignalRProvider>
  );
}

export default ProtectedRoute;
