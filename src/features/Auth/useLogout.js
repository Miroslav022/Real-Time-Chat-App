import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../Services/apiAuth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logoutUser } = useAuth();
  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logoutUser();
      navigate("/", { replace: true });
      queryClient.removeQueries();
    },
    onError: () => console.error("there is an error while logging out"),
  });
  return { logout, isLoading };
}
