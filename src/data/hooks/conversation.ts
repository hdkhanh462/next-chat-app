import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { ConversationWithStatusDTO } from "@/types/conversation.type";

export function useUserConversationsQuery(initialKeyword?: string) {
  const [keyword, setKeyword] = useState<string | undefined>(initialKeyword);

  const query = useQuery({
    queryKey: ["conversations", keyword],
    queryFn: async () => {
      if (keyword === undefined) {
        // No keyword, fetch all conversations
        const result = await betterFetch<ConversationWithStatusDTO[]>(
          "/api/conversations"
        );
        return result.data || [];
      }

      // If keyword is too short, return no results
      if (keyword.length < 2) return null;

      // Fetch conversations matching the keyword
      const result = await betterFetch<ConversationWithStatusDTO[]>(
        "/api/conversations?keyword=" + keyword
      );
      return result.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { ...query, keyword, setKeyword };
}
