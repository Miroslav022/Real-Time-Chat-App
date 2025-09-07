import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlockUser } from "../../Services/apiUser";
import toast from "react-hot-toast";

export function useBlockUser() {
  const queryClient = useQueryClient();

  const { mutateAsync: blockUserMutation } = useMutation({
    mutationFn: BlockUser,
    onSuccess: () => {
      toast.success("User has been successfully blocked");
      queryClient.invalidateQueries({ queryKey: ["Conversations"] });
    },
    onError: (e) => {
      toast.error("Something went wrong");
      console.error(e);
    },
  });
  return { blockUserMutation };
}
