import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        const data = await axiosInstance.post("/Auth/refresh_token");
        console.log(data);
        if (data.status === 401) {
          const navigation = useNavigate();
          navigation("/");
        }
        return axiosInstance(orginalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        //redirect
        const navigation = useNavigate();
        navigation("/");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
