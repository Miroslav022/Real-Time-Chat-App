import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7257/Api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const orginalRequest = error.config;

    if (error.response.status === 401 && !orginalRequest._retry) {
      orginalRequest._retry = true;

      try {
        await axiosInstance.post("/Auth/refresh_token");
        return axiosInstance(orginalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        window.location.href = "/auth/login";
        //redirect
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
