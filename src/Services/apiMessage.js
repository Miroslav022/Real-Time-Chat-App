import axiosInstance from "../api/axiosInstance";

export async function DeleteMessage(id) {
  return axiosInstance.delete(`https://localhost:7257/api/message/${id}`);
}
