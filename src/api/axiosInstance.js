import axios from "axios";

export const API_ORIGIN = "https://localhost:7257";

const axiosInstance = axios.create({
  baseURL: `${API_ORIGIN}/Api`,
  withCredentials: true,
});

export default axiosInstance;
