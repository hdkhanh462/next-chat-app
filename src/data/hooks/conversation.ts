import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { FullConversationDTO } from "@/types/conversation.type";
import { ConversationFilterInput } from "@/schemas/conversation.schema";
import { find } from "lodash";

export function useUserConvsQuery(initialFilter?: ConversationFilterInput) {
  const [filter, setFilter] = useState<ConversationFilterInput | undefined>(
    initialFilter
  );

  const query = useQuery({
    queryKey: ["conversations", filter],
    queryFn: async () => {
      if (filter?.keyword === undefined || filter.keyword === null) {
        const result = await betterFetch<FullConversationDTO[]>(
          "/api/conversations"
        );
        return result.data || [];
      }

      if (filter.keyword.length < 2) return null;

      const params = new URLSearchParams();
      if (filter.keyword) params.append("keyword", filter.keyword);
      if (filter?.since) params.append("since", filter.since.toISOString());
      if (filter?.after) params.append("after", filter.after.toISOString());

      const result = await betterFetch<FullConversationDTO[]>(
        "/api/conversations?" + params.toString()
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
