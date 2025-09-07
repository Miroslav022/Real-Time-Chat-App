import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import propTypes from "prop-types";
import axiosInstance from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(undefined);

function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        await axiosInstance.get("/Auth/current_user");
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // ✅ mark loading finished on first attempt
      }
    }
    fetchMe();
  }, []);

  function loginUser(token) {
    if (!token) return;
    const decryptedToken = jwtDecode(token);
    setToken(token);
    setUser(decryptedToken);
  }

  function logoutUser() {
    setToken(null);
    setUser(null);
  }
  useLayoutEffect(() => {
    const authInterceptor = axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      axiosInstance.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const orginalRequest = error.config;
        console.log("error obj:", error);
        if (
          error.response.status === 401 &&
          orginalRequest.url !== "/Auth/refresh_token"
        ) {
          orginalRequest._retry = true;
          try {
            const response = await axiosInstance.post("/Auth/refresh_token");

            setToken(response.data);
            const decryptedToken = jwtDecode(response.data);
            setUser(decryptedToken);

            orginalRequest.headers.Authorization = `Bearer ${response.data}`;

            return axiosInstance(orginalRequest);
          } catch {
            setToken(null);
            setUser(null);
          } finally {
            setIsLoading(false);
          }

          return Promise.reject(error);
        }
      }
    );
    return () => {
      axiosInstance.interceptors.response.eject(refreshInterceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ setToken, token, user, loginUser, isLoading, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const authContext = useContext(AuthContext);
  if (!authContext)
    throw new Error("useAuth must be used within a AuthProvider");
  return authContext;
}

AuthProvider.propTypes = {
  children: propTypes.oneOfType([
    propTypes.node || propTypes.arrayOf(propTypes.node),
  ]),
};

export default AuthProvider;
