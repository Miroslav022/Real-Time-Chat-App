import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeContact } from "../../Services/apiContacts";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";

export function useRemoveContact() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.sub ? Number(user.sub) : null;

  const { mutate: removeContactMutation, isPending } = useMutation({
    mutationFn: removeContact,
    onSuccess: () => {
      toast.success("Contact removed");
      queryClient.invalidateQueries({ queryKey: ["contacts", userId] });
    },
    onError: () => {
      toast.error("Failed to remove contact");
    },
  });

  return { removeContactMutation, isPending };
}
