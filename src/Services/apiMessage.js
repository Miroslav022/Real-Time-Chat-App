import axiosInstance from "../api/axiosInstance";

export async function DeleteMessage(id) {
  return axiosInstance.delete(`https://localhost:7257/api/message/${id}`);
}

export async function uploadImages(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const response = await axiosInstance.post(
    "https://localhost:7257/api/message/upload-images",
    formData,
  );
  return response.data;
}
