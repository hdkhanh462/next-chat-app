"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { CHAT_API_PATH } from "@/constants/routes";
import { QUERY_KEYS } from "@/data/queries/keys";
import { authClient } from "@/lib/auth/client";
import { UserParamsInput } from "@/schemas/user.schema";
import { UserWithFriendShipStatus } from "@/types/user.type";

export async function getUser() {
  const { data } = await authClient.getSession();
  return data?.user || null;
}

export async function getUsers(
  params: UserParamsInput
): Promise<UserWithFriendShipStatus[]> {
  if (params.keyword === undefined || params.keyword === null) {
    const result = await betterFetch<UserWithFriendShipStatus[]>(
      CHAT_API_PATH.USERS
    );
    return result.data ?? [];
  }

  if (params.keyword.length < 2) return [];

  const urlParams = new URLSearchParams();
  if (params.keyword) urlParams.append("keyword", params.keyword);
  if (params.page) urlParams.append("page", params.page.toString());
  if (params.limit) urlParams.append("limit", params.limit.toString());

  const result = await betterFetch<UserWithFriendShipStatus[]>(
    CHAT_API_PATH.USERS + "?" + urlParams.toString()
  );
  return result.data ?? [];
}

export function useUserQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.getCurrent(),
    queryFn: getUser,
  });
}

export function useUsersQuery(initialParams: UserParamsInput = {}) {
  const [params, setParams] = useState<UserParamsInput>(initialParams);

  const query = useQuery({
    queryKey: QUERY_KEYS.USERS.getUsers(params),
    queryFn: () => getUsers(params),
  });

  return { ...query, params, setParams };
}
