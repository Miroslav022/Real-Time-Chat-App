import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConversation as createConversationApi } from "../Services/apiConversation";

export function useConversation() {
  const queryClient = useQueryClient();
  const { mutate: createConversation, isLoading } = useMutation({
    mutationFn: (data) => createConversationApi(data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ active: true });
    },
  });
  return { createConversation, isLoading };
}
