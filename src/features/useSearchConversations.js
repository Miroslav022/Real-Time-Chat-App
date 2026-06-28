import { useQuery } from "@tanstack/react-query";
import { searchConversations } from "../Services/apiConversation";

function sortConversations(conversations) {
  return [...conversations].sort((a, b) => {
    const aUnread = (a.unreadCount ?? 0) > 0 ? 1 : 0;
    const bUnread = (b.unreadCount ?? 0) > 0 ? 1 : 0;

    if (bUnread !== aUnread) return bUnread - aUnread;

    return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
  });
}

export function useSearchConversations(searchTerm) {
  const normalizedSearchTerm = searchTerm?.trim();

  const { data: conversations = [], isFetching: isSearchingConversations } =
    useQuery({
      queryKey: ["Conversations", "search", normalizedSearchTerm],
      enabled: Boolean(normalizedSearchTerm),
      queryFn: async () => {
        const result = await searchConversations(normalizedSearchTerm);

        if (result?.data?.isFailure) return [];

        const conversationsResult = result?.data?.value ?? [];

        return sortConversations(conversationsResult);
      },
      staleTime: 60 * 1000,
    });

  return { conversations, isSearchingConversations };
}
