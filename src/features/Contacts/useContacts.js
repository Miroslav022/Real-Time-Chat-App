import { useQuery } from "@tanstack/react-query";
import { getContacts } from "../../Services/apiContacts";
import { useAuth } from "../../context/AuthProvider";

export function useContacts() {
  const { user } = useAuth();
  const userId = user?.sub ? Number(user.sub) : null;

  const {
    data: contacts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["contacts", userId],
    queryFn: async () => {
      const result = await getContacts(userId);

      if (!result || !result.data || !Array.isArray(result.data.value)) {
        throw new Error("Invalid response structure");
      }

      return result.data.value;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
  return { contacts, isLoading, isError, error };
}
