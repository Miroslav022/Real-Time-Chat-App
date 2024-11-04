import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../Services/apiAuth";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });
  return { user, isLoading };
}
