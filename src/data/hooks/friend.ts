import { betterFetch } from "@better-fetch/fetch";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

import { QUERY_KEYS } from "@/constants/query-keys";
import { CHAT_API_PATH } from "@/constants/routes";
import { FriendFilterInput } from "@/schemas/friend.schema";
import { UsersWithCursorDTO } from "@/types/user.type";

async function getFriends(
  params?: FriendFilterInput
): Promise<UsersWithCursorDTO> {
  if (params?.keyword === undefined || params.keyword === null) {
    const result = await betterFetch<UsersWithCursorDTO>(CHAT_API_PATH.FRIENDS);
    return result.data || { users: [], nextCursor: null };
  }

  if (params.keyword.length < 2) return { users: [], nextCursor: null };

  const urlParams = new URLSearchParams();
  if (params?.keyword) urlParams.append("keyword", params.keyword);
  if (params?.cursor) urlParams.append("cursor", params.cursor);

  const result = await betterFetch<UsersWithCursorDTO>(
    CHAT_API_PATH.FRIENDS + "?" + urlParams.toString()
  );
  return result.data || { users: [], nextCursor: null };
}

export function useFriends(initalParams: FriendFilterInput = { limit: 20 }) {
  const [params, setParams] = useState<FriendFilterInput>(initalParams);

  const query = useInfiniteQuery<
    UsersWithCursorDTO,
    Error,
    InfiniteData<UsersWithCursorDTO>,
    [string, FriendFilterInput],
    string | undefined
  >({
    queryKey: [QUERY_KEYS.FRIENDS, params],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => getFriends({ ...params, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });
  return { ...query, params, setParams };
}
