import { authClient } from "@/lib/auth/client";
import { useQuery } from "@tanstack/react-query";

export async function getUser() {
  const { data, error } = await authClient.getSession();
  if (error) {
    throw new Error("Failed to fetch user session.");
  }
  return data?.user;
}

export function useUserQuery() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
