import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../Services/apiAuth";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await fetchCurrentUser();
      return result.value;
    },
  });
  return { user, isLoading };
}
