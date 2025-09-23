import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { find } from "lodash";
import { useState } from "react";

import { ConversationFilterInput } from "@/schemas/conversation.schema";
import { FullConversationDTO } from "@/types/conversation.type";
import { QUERY_KEYS } from "@/constants/query-keys";
import { CHAT_API_PATH } from "@/constants/routes";

export function useUserConvsQuery(initialFilter?: ConversationFilterInput) {
  const [filter, setFilter] = useState<ConversationFilterInput | undefined>(
    initialFilter
  );

  const query = useQuery({
    queryKey: [QUERY_KEYS.CONVERSATIONS, filter],
    queryFn: async () => {
      if (filter?.keyword === undefined || filter.keyword === null) {
        const result = await betterFetch<FullConversationDTO[]>(
          CHAT_API_PATH.CONVERSATIONS
        );
        return result.data || [];
      }

      if (filter.keyword.length < 2) return null;

      const params = new URLSearchParams();
      if (filter.keyword) params.append("keyword", filter.keyword);
      if (filter?.since) params.append("since", filter.since.toISOString());
      if (filter?.after) params.append("after", filter.after.toISOString());

      const result = await betterFetch<FullConversationDTO[]>(
        CHAT_API_PATH.CONVERSATIONS + "?" + params.toString()
      );
      return result.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { ...query, filter, setFilter };
}

export function extractConvDetails(conv: FullConversationDTO, userId: string) {
  let displayName = conv.name;
  let displayImage: string | null = conv.image ?? null;

  if (!conv.isGroup) {
    const other = find(conv.members, (m) => m.id !== userId);
    displayName = other?.name || "Unknown";
    displayImage = other?.image || null;
  }
  return { displayName, displayImage };
}
