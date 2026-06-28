import axiosInstance from "../api/axiosInstance";

export async function getContacts(id) {
  const result = await axiosInstance.get(
    `https://localhost:7257/api/Contact?id=${id}`,
  );

  return result;
}

export async function addContact(contactUserId) {
  const result = await axiosInstance.post(
    `https://localhost:7257/api/contact`,
    contactUserId,
    { headers: { "Content-Type": "application/json" } },
  );

  return result;
}

export async function removeContact(contactUserId) {
  const result = await axiosInstance.delete(
    `https://localhost:7257/api/contact/${contactUserId}`,
  );

  return result;
}
