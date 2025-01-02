import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../Services/apiConversation";

export function useMessages(conversationId) {
  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessages(conversationId),
  });

  return { messages, isLoading };
}