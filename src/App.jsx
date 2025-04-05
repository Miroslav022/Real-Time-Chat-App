import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import UserDetails from "./Pages/UserDetails";
import Home from "./Pages/Home";
import Auth from "./Ui/Auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ProtectedRoute from "./Ui/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import EditAccount from "./Ui/EditAccount";
import WelcomeToHome from "./Ui/WelcomeToHome";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route path="auth" element={<Auth />}>
            <Route index element={<Navigate replace to="login" />} />
            <Route path="login" element={<Login />} />
            <Route path="registration" element={<UserDetails />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="home" element={<Home />}>
              <Route index element={<WelcomeToHome />} />
              <Route path="edituser" element={<EditAccount />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
