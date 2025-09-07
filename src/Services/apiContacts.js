import axiosInstance from "../api/axiosInstance";

export async function getContacts(id) {
  const result = await axiosInstance.get(
    `https://localhost:7257/api/Contact?id=${id}`
  );

  return result;
}
