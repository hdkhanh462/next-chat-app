import { betterFetch } from "@better-fetch/fetch";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { FullMessagesWithCursorDTO } from "@/types/message.type";
import { CHAT_API_PATH } from "@/constants/routes";
import { CursorPaginationInput } from "@/schemas/query.schema";
import { QUERY_KEYS } from "@/data/queries/keys";

async function getMessages(
  convId: string,
  params: CursorPaginationInput
): Promise<FullMessagesWithCursorDTO> {
  const urlParams = new URLSearchParams();
  if (params.cursor) urlParams.append("cursor", params.cursor);
  if (params.limit) urlParams.append("limit", params.limit.toString());

  const result = await betterFetch<FullMessagesWithCursorDTO>(
    CHAT_API_PATH.CONVERSATIONS + `/${convId}/messages?` + params.toString()
  );

  return result.data ?? { messages: [], nextCursor: null };
}

export function useMessagesQuery(convId: string) {
  return useInfiniteQuery<
    FullMessagesWithCursorDTO,
    Error,
    InfiniteData<FullMessagesWithCursorDTO>,
    string[],
    string | undefined
  >({
    enabled: !!convId,
    initialPageParam: undefined,
    queryKey: QUERY_KEYS.CONVERSATIONS.getMessages(convId),
    queryFn: ({ pageParam: cursor }) => getMessages(convId, { cursor }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
