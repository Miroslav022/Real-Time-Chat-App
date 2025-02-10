import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../Services/apiAuth";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      navigate("/", { replace: true });
      queryClient.removeQueries();
    },
    onError: () => console.error("there is an error while logging out"),
  });
  return { logout, isLoading };
}
