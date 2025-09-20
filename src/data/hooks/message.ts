import { betterFetch } from "@better-fetch/fetch";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { FullMessagesWithCursorDTO } from "@/types/message.type";
import { QUERY_KEYS } from "@/constants/query-keys";
import { CHAT_API_PATH } from "@/constants/routes";

async function getMessage(convId: string, cursor?: string) {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);

  const result = await betterFetch<FullMessagesWithCursorDTO>(
    CHAT_API_PATH.CONVERSATIONS + `/${convId}/messages?` + params.toString()
  );

  if (result.error) throw Error("Failed to fetch messages");

  return result.data;
}

export function useMessages(convId: string) {
  return useInfiniteQuery<
    FullMessagesWithCursorDTO,
    Error,
    InfiniteData<FullMessagesWithCursorDTO>,
    [string, string, string],
    string | undefined
  >({
    enabled: !!convId,
    queryKey: [QUERY_KEYS.CONVERSATIONS, convId, QUERY_KEYS.MESSAGES],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => getMessage(convId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
