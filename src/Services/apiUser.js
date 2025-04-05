import axiosInstance from "../api/axiosInstance";

export async function EditUser(userData) {
  const response = axiosInstance.patch(`/User/${userData.id}`, userData);
  return response;
}

export async function UploadUserProfileImage(image) {
  const response = axiosInstance.post(`/FileUpload/upload`, image);
  return response;
}

export async function UpdateUserProfileImage(data) {
  const response = axiosInstance.post(`/User/editimage/${data.Id}`, data.File);
  return response;
}

export async function BlockUser(data) {
  const response = axiosInstance.post("/user/block", data);
  return response;
}

export async function UnblockUser(data) {
  console.log(data);
  const response = axiosInstance.post("/user/unblock", data);
  return response;
}
