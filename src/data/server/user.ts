import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { FriendShipStatus, UserWithFriendShipStatus } from "@/types/user.type";
import { UserParamsInput } from "@/schemas/user.schema";

export const getUserCached = cache(async () => {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });
  if (!sessionData || !sessionData.user) throw new Error("Unauthenticated");
  return sessionData.user;
});

export async function getUsers(
  params: UserParamsInput
): Promise<UserWithFriendShipStatus[]> {
  const user = await getUserCached();
  const skip =
    params.page && params.limit ? (params.page - 1) * params.limit : 0;

  const users = await prisma.user.findMany({
    take: params.limit,
    skip,
    where: {
      id: { not: user.id },
      ...(params.keyword
        ? {
            OR: [
              { name: { contains: params.keyword, mode: "insensitive" } },
              { email: { equals: params.keyword, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      image: true,
      sentFriendRequests: {
        where: { addresseeId: user.id },
        select: { id: true, status: true },
      },
      receivedFriendRequests: {
        where: { requesterId: user.id },
        select: { id: true, status: true },
      },
    },
  });

  return users.map((user) => {
    let friendShip: FriendShipStatus | undefined;

    if (user.sentFriendRequests.length > 0) {
      friendShip = {
        requestId: user.sentFriendRequests[0].id,
        status: user.sentFriendRequests[0].status,
        direction: "INCOMING",
      };
    } else if (user.receivedFriendRequests.length > 0) {
      friendShip = {
        requestId: user.receivedFriendRequests[0].id,
        status: user.receivedFriendRequests[0].status,
        direction: "OUTGOING",
      };
    }

    return {
      id: user.id,
      name: user.name,
      image: user.image,
      friendShip,
    };
  });
}
