import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConversation as createConversationApi } from "../Services/apiConversation";

export function useConversation() {
  const queryClient = useQueryClient();

  const { mutate: createConversation, isLoading } = useMutation({
    mutationFn: (data) => createConversationApi(data),
    onSuccess: async (conversation) => {
      if (!conversation && !conversation.data) return;
      if (conversation.data.isFailure) return;

      const newData = conversation.data.value;

      queryClient.setQueryData(["Conversations"], (old) => {
        if (!old) return [newData];
        return [...old, newData];
      });
    },
  });
  return { createConversation, isLoading };
}
