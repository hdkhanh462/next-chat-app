import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  ConversationWithMessagesDTO,
  ConversationWithStatusDTO,
} from "@/types/conversation.type";
import { useParams } from "next/navigation";

export function useSeachUserConversationsQuery(initialKeyword?: string) {
  const [keyword, setKeyword] = useState<string | undefined>(initialKeyword);

  const query = useQuery({
    queryKey: ["conversations", keyword],
    queryFn: async () => {
      let conversations: ConversationWithStatusDTO[] = [];
      if (keyword === undefined) {
        // No keyword, fetch all conversations
        const result1 = await betterFetch<ConversationWithStatusDTO[]>(
          "/api/conversations"
        );
        return result1.data || [];
      }

      // If keyword is too short, return no results
      if (keyword.length < 2) return null;

      // Fetch conversations matching the keyword
      const result2 = await betterFetch<ConversationWithStatusDTO[]>(
        "/api/conversations?keyword=" + keyword
      );
      conversations = result2.data || [];
      return conversations || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { ...query, keyword, setKeyword };
}

export function useConversationQuery() {
  const params = useParams();
  const conversationId = useMemo(
    () => (params?.id as string) || "",
    [params.id]
  );
  const query = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const result = await betterFetch<ConversationWithMessagesDTO | null>(
        "/api/conversations/" + conversationId
      );
      return result.data || null;
    },
  });

  return { ...query, conversationId };
}
