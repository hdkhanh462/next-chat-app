import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import {
  FriendShipStatus,
  UserDTO,
  UserWithFriendShipStatus,
} from "@/types/user.type";

export const getUserCached = cache(async () => {
  const sessionDat = await auth.api.getSession({
    headers: await headers(),
  });
  if (!sessionDat || !sessionDat.user) throw new Error("Unauthenticated");
  return sessionDat.user;
});

export async function searchUsers(
  keyword: string
): Promise<UserWithFriendShipStatus[]> {
  const user = await getUserCached();

  const users = await prisma.user.findMany({
    take: 10,
    where: {
      id: { not: user.id },
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { email: { equals: keyword, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      image: true,
      sentFriendRequests: {
        where: { addresseeId: user.id }, // người này gửi request đến tôi
        select: { id: true, status: true },
      },
      receivedFriendRequests: {
        where: { requesterId: user.id }, // tôi gửi request đến người này
        select: { id: true, status: true },
      },
    },
  });

  return users.map((user) => {
    let friendShip: FriendShipStatus | undefined;

    if (user.sentFriendRequests.length > 0) {
      // Người kia gửi request đến tôi
      friendShip = {
        requestId: user.sentFriendRequests[0].id,
        status: user.sentFriendRequests[0].status,
        direction: "INCOMING",
      };
    } else if (user.receivedFriendRequests.length > 0) {
      // Tôi gửi request đến người kia
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

export async function searchFriends(keyword: string): Promise<UserDTO[]> {
  const user = await getUserCached();

  const friends = await prisma.user.findMany({
    take: 10,
    where: {
      id: { not: user.id },
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { email: { equals: keyword, mode: "insensitive" } },
      ],
      AND: [
        {
          OR: [
            {
              sentFriendRequests: {
                some: { addresseeId: user.id, status: "ACCEPTED" },
              },
            },
            {
              receivedFriendRequests: {
                some: { requesterId: user.id, status: "ACCEPTED" },
              },
            },
          ],
        },
      ],
    },
  });

  return friends.map((user) => ({
    id: user.id,
    name: user.name,
    image: user.image,
  }));
}
