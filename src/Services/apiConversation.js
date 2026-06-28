import axiosInstance from "../api/axiosInstance";

export async function createConversation(data) {
  const response = await axiosInstance.post("/conversation/conversation", data);

  return response;
}

export async function getAllConversations() {
  const chats = await axiosInstance.get(
    `https://localhost:7257/api/Conversation/conversations`,
  );

  return chats;
}

export async function searchConversations(searchTerm) {
  const chats = await axiosInstance.get(
    `https://localhost:7257/api/conversation/conversations/search`,
    {
      params: { searchTerm },
    },
  );

  return chats;
}

export async function getMessages(conversationId) {
  const messages = await axiosInstance.get(
    `https://localhost:7257/api/message?conversationId=${conversationId}`,
  );

  return messages.data.value;
}

export async function createGroupConversation(formData) {
  const response = await axiosInstance.post(
    "/Conversation/groupchat",
    formData,
  );

  return response;
}

export async function updateGroupImage(conversationId, formData) {
  const response = await axiosInstance.put(
    `/Conversation/groupchat/${conversationId}/image`,
    formData,
  );

  return response;
}
