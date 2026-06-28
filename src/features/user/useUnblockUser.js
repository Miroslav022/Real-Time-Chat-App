import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UnblockUser } from "../../Services/apiUser";
import toast from "react-hot-toast";

export function useUnblockUser() {
  const queryClient = useQueryClient();

  const { mutate: UnblockUserMutation } = useMutation({
    mutationFn: UnblockUser,
    onSuccess: () => {
      toast.success("User has been successfully unblocked");
      queryClient.invalidateQueries({ queryKey: ["Conversations"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (e) => {
      toast.error("Something went wrong");
      console.error(e);
    },
  });
  return { UnblockUserMutation };
}
