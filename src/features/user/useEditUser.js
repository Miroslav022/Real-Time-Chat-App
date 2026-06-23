import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditUser } from "../../Services/apiUser";
import toast from "react-hot-toast";

export function useEditUser() {
  const queryClient = useQueryClient();

  const { mutate: editUserHandler, isLoading } = useMutation({
    mutationFn: EditUser,
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("You've successfully updated your account");
    },
    onError: (e) => {
      const errors = e?.response?.data?.errors;
      if (errors) {
        Object.values(errors).forEach((error) => {
          const message =
            typeof error === "string"
              ? error
              : error?.description || error?.message || "Something went wrong";
          toast.error(message);
        });
      } else {
        const message =
          e?.response?.data?.message ||
          e?.response?.data?.title ||
          "Something went wrong";
        toast.error(String(message));
      }
    },
  });
  return { editUserHandler, isLoading };
}
