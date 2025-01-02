import { useQuery } from "@tanstack/react-query";
// import { useDispatch } from "react-redux";
import { getAllConversations } from "../Services/apiConversation";
// import { loadConversationsFromDB } from "./chat/ChatSlice";

export function useFetchConversations() {
  const { data } = useQuery({
    queryKey: ["currentUser"],
  });

  const { data: conversations } = useQuery({
    queryKey: ["Conversations"],
    queryFn: async () => {
      const result = await getAllConversations(data.id);
      return result.data.value;
      // dispatch(loadConversationsFromDB(chats));
    },
  });
  return { conversations };
}
