import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGroupImage } from "../../Services/apiConversation";
import toast from "react-hot-toast";

export function useUpdateGroupImage() {
  const queryClient = useQueryClient();

  const { mutate: updateGroupImageMutation, isPending: isUpdatingGroupImage } =
    useMutation({
      mutationFn: ({ conversationId, formData }) =>
        updateGroupImage(conversationId, formData),
      onSuccess: () => {
        toast.success("Group image updated successfully");
        queryClient.invalidateQueries({ queryKey: ["Conversations"] });
      },
      onError: () => toast.error("Failed to update group image"),
    });

  return { updateGroupImageMutation, isUpdatingGroupImage };
}
