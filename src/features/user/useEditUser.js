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
      const { errors } = e.response.data;
      const arrayOfErros = Object.values(errors);
      arrayOfErros.map((error) => toast.error(error));
    },
  });
  return { editUserHandler, isLoading };
}
