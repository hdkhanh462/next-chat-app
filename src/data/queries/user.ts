"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { CHAT_API_PATH } from "@/constants/routes";
import { QUERY_KEYS } from "@/data/queries/keys";
import { authClient } from "@/lib/auth/client";
import { UserParamsInput } from "@/schemas/user.schema";
import { UsersWithPaginationDTO } from "@/types/user.type";

export async function getUser() {
  const { data } = await authClient.getSession();
  return data?.user || null;
}

export async function getUsers(
  params: UserParamsInput
): Promise<UsersWithPaginationDTO> {
  if (params.keyword === undefined || params.keyword === null) {
    const result = await betterFetch<UsersWithPaginationDTO>(
      CHAT_API_PATH.FRIENDS
    );
    return result.data || { users: [], hasNext: false, hasPrevious: false };
  }

  if (params.keyword.length < 2)
    return { users: [], hasNext: false, hasPrevious: false };

  const urlParams = new URLSearchParams();
  if (params.keyword) urlParams.append("keyword", params.keyword);
  if (params.page) urlParams.append("page", params.page.toString());
  if (params.limit) urlParams.append("limit", params.limit.toString());

  const result = await betterFetch<UsersWithPaginationDTO>(
    CHAT_API_PATH.FRIENDS + "?" + urlParams.toString()
  );
  return result.data || { users: [], hasNext: false, hasPrevious: false };
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
