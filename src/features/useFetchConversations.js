import { useQuery } from "@tanstack/react-query";
import { getAllConversations } from "../Services/apiConversation";
import { useAuth } from "../context/AuthProvider";

export function useFetchConversations() {
  // const { data } = useQuery({
  //   queryKey: ["currentUser"],
  // });
  const { user } = useAuth();
  const { data: conversations } = useQuery({
    queryKey: ["Conversations"],
    queryFn: async () => {
      const result = await getAllConversations(user?.sub);
      if (result && result.data && result.data.isFailure) return;
      const conversationsResult = result.data.value;
      console.log(">>>data", conversationsResult);
      const conversations = conversationsResult.sort((a, b) => {
        const aUnread = (a.unreadCount ?? 0) > 0 ? 1 : 0;
        const bUnread = (b.unreadCount ?? 0) > 0 ? 1 : 0;
        if (bUnread !== aUnread) return bUnread - aUnread;
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      });
      console.log(conversations);
      return conversations;
    },

    staleTime: 5 * 60 * 1000,
  });
  return { conversations };
}
