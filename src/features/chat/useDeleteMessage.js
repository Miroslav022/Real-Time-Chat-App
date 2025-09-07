import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteMessage } from "../../Services/apiMessage";

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  const { mutate: deleteMessageHandler } = useMutation({
    mutationFn: DeleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });
  return { deleteMessageHandler };
}
