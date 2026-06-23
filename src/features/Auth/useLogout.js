import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../Services/apiAuth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useSignalRContext } from "../../context/SignalRContext";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logoutUser } = useAuth();
  const connection = useSignalRContext();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: async () => {
      if (connection?.state === "Connected") {
        await connection.invoke("Logout");
      }
      return logoutApi();
    },
    onSuccess: () => {
      logoutUser();
      navigate("/", { replace: true });
      queryClient.removeQueries();
    },
    onError: () => console.error("there is an error while logging out"),
  });
  return { logout, isLoading };
}
