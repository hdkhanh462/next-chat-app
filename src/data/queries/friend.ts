"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { CHAT_API_PATH } from "@/constants/routes";
import { QUERY_KEYS } from "@/data/queries/keys";
import { UserParamsInput } from "@/schemas/user.schema";
import { UserDTO } from "@/types/user.type";

async function getFriends(params: UserParamsInput): Promise<UserDTO[]> {
  const urlParams = new URLSearchParams();
  if (params.keyword) urlParams.append("keyword", params.keyword);
  if (params.page) urlParams.append("page", params.page.toString());
  if (params.limit) urlParams.append("limit", params.limit.toString());

  if (params.keyword === undefined || params.keyword === null) {
    const result = await betterFetch<UserDTO[]>(
      CHAT_API_PATH.FRIENDS + "?" + urlParams.toString()
    );
    return result.data ?? [];
  }

  if (params.keyword.length < 2) return [];

  const result = await betterFetch<UserDTO[]>(
    CHAT_API_PATH.FRIENDS + "?" + urlParams.toString()
  );
  return result.data ?? [];
}

export function useFriendsQuery(initalParams: UserParamsInput = {}) {
  const [params, setParams] = useState<UserParamsInput>(initalParams);

  const query = useQuery({
    queryKey: QUERY_KEYS.USERS.getFriends(params),
    queryFn: () => getFriends(params),
  });
  return { ...query, params, setParams };
}
