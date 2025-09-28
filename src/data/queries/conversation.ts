import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { find } from "lodash";
import { useState } from "react";

import { ConversationParamsInput } from "@/schemas/conversation.schema";
import { FullConversationDTO } from "@/types/conversation.type";
import { CHAT_API_PATH } from "@/constants/routes";
import { QUERY_KEYS } from "@/data/queries/keys";

export async function getConversations(
  params: ConversationParamsInput
): Promise<FullConversationDTO[]> {
  if (params.keyword === undefined || params.keyword === null) {
    const result = await betterFetch<FullConversationDTO[]>(
      CHAT_API_PATH.CONVERSATIONS
    );
    return result.data ?? [];
  }

  if (params.keyword.length < 2) return [];

  const urlParams = new URLSearchParams();
  if (params.keyword) urlParams.append("keyword", params.keyword);
  if (params.limit) urlParams.append("limit", params.limit.toString());
  if (params.page) urlParams.append("page", params.page.toString());
  if (params.since) urlParams.append("since", params.since.toISOString());
  if (params.after) urlParams.append("after", params.after.toISOString());

  const result = await betterFetch<FullConversationDTO[]>(
    CHAT_API_PATH.CONVERSATIONS + "?" + params.toString()
  );
  return result.data ?? [];
}

export function useConversationsQuery(initialParams: ConversationParamsInput) {
  const [params, setParams] = useState<ConversationParamsInput>(initialParams);

  const query = useQuery({
    queryKey: QUERY_KEYS.CONVERSATIONS.getConversations(params),
    queryFn: () => getConversations(params),
  });

  return { ...query, params, setParams };
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
