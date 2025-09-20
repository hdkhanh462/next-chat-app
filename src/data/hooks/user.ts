"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { authClient } from "@/lib/auth/client";
import { UserDTO, UserWithFriendShipStatus } from "@/types/user.type";
import { QUERY_KEYS } from "@/constants/query-keys";
import { CHAT_API_PATH } from "@/constants/routes";

export async function getUser() {
  const { data } = await authClient.getSession();
  return data?.user || null;
}

export function useUserQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.USER.CURRENT],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSearchUsersQuery() {
  const [keyword, setKeyword] = useState("");

  const query = useQuery({
    queryKey: [QUERY_KEYS.USER.OTHER, keyword],
    queryFn: async () => {
      if (!keyword || keyword.length < 2) return null;

      const users = await betterFetch<UserWithFriendShipStatus[]>(
        CHAT_API_PATH.USERS + "?keyword=" + keyword
      );
      return users.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { ...query, keyword, setKeyword };
}

export function useSearchUserFriendsQuery() {
  const [keyword, setKeyword] = useState("");

  const query = useQuery({
    queryKey: [QUERY_KEYS.FRIENDS, keyword],
    queryFn: async () => {
      if (!keyword || keyword.length < 2) return null;

      const friends = await betterFetch<UserDTO[]>(
        CHAT_API_PATH.FRIENDS + "?keyword=" + keyword
      );
      return friends.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { ...query, keyword, setKeyword };
}
