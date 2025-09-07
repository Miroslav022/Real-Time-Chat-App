import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupConversation } from "../../Services/apiConversation";
import toast from "react-hot-toast";

export function useGroupConverstaion() {
  const queryClient = useQueryClient();

  const { mutate: createGroup, isLoading } = useMutation({
    mutationFn: (data) => createGroupConversation(data),
    onSuccess: (data) => {
      console.log("isSuccess data>>>", data);
      queryClient.invalidateQueries({ queryKey: ["Conversations"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { createGroup, isLoading };
}
