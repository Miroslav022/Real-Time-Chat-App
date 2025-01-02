import axiosInstance from "../api/axiosInstance";

export async function createConversation(data) {
  const response = await axiosInstance.post("/conversation/conversation", data);

  return response;
}

export async function getAllConversations(id) {
  const chats = await axiosInstance.get(
    `https://localhost:7257/api/Conversation/conversations?id=${id}`
  );

  return chats;
}

export async function getMessages(conversationId) {
  const messages = await axiosInstance.get(
    `https://localhost:7257/api/Message?conversationId=${conversationId}`
  );

  return messages.data.value;
}
