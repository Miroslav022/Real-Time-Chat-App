import axiosInstance from "../api/axiosInstance";

const BASE_URL = "https://localhost:7257/api/Auth";
export async function loginApi({ email, password }) {
  // const response = await fetch(`${BASE_URL}/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email, password }),
  // });
  const result = await axiosInstance.post("/Auth/login", { email, password });
  return result;
}

export async function refreshAccessToken() {
  const response = await fetch(`${BASE_URL}/refresh_token`, {
    method: "POST",
    credentials: true,
  });
  if (!response.ok) {
    throw new Error("Token refresh failed");
  }
}

export async function fetchCurrentUser() {
  const { data } = await axiosInstance.get("/Auth/current_user");
  return data;
}

export async function logout() {
  const { data } = await axiosInstance.post("/Auth/logout");
  return data;
}
