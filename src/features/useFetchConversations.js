import { useQuery } from "@tanstack/react-query";
import { getAllConversations } from "../Services/apiConversation";

export function useFetchConversations() {
  const { data } = useQuery({
    queryKey: ["currentUser"],
  });

  const { data: conversations } = useQuery({
    queryKey: ["Conversations"],
    queryFn: async () => {
      const result = await getAllConversations(data.id);
      return result.data.value;
    },
  });
  return { conversations };
}
