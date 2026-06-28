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
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrapAuth() {
      try {
        const response = await axiosInstance.post("/Auth/refresh_token");
        if (response?.data) {
          setToken(response.data);
          setUser(jwtDecode(response.data));
        }
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    bootstrapAuth();
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
      config.headers.Authorization = token
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

        if (!error?.response || !orginalRequest) {
          return Promise.reject(error);
        }

        if (
          error.response.status === 401 &&
          !orginalRequest._retry &&
          orginalRequest.url !== "/Auth/refresh_token"
        ) {
          orginalRequest._retry = true;

          try {
            const response = await axiosInstance.post("/Auth/refresh_token");
            if (!response?.data) return Promise.reject(error);

            setToken(response.data);
            const decryptedToken = jwtDecode(response.data);
            setUser(decryptedToken);

            orginalRequest.headers.Authorization = `Bearer ${response.data}`;

            return axiosInstance(orginalRequest);
          } catch {
            logoutUser();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const authContext = useContext(AuthContext);
  if (!authContext)
    throw new Error("useAuth must be used within a AuthProvider");
  return authContext;
}

AuthProvider.propTypes = {
  children: propTypes.oneOfType([
    propTypes.node,
    propTypes.arrayOf(propTypes.node),
  ]),
};

export default AuthProvider;
