import { prisma } from "@/lib/prisma";
import { FriendShipStatus, UserWithFriendShipStatus } from "@/types/user.type";

export async function searchUsersWithFriendship(
  currentUserId: string,
  keyword: string
): Promise<UserWithFriendShipStatus[]> {
  const users = await prisma.user.findMany({
    take: 10,
    where: {
      id: { not: currentUserId },
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
        where: { addresseeId: currentUserId }, // người này gửi request đến tôi
        select: { id: true, status: true },
      },
      receivedFriendRequests: {
        where: { requesterId: currentUserId }, // tôi gửi request đến người này
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
