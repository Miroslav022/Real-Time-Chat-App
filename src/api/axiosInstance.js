import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7257/Api",
  withCredentials: true,
});

export default axiosInstance;
