import "server-only";

import { Prisma } from "@prisma/client";
import { pick } from "lodash";

import { getUserCached } from "@/data/server/user";
import { prisma } from "@/lib/prisma";
import { UserParamsInput } from "@/schemas/user.schema";

export async function getFriends(params?: UserParamsInput) {
  const user = await getUserCached();

  const friends = await prisma.friendship.findMany({
    take: params?.limit,
    ...(params?.cursor && {
      skip: 1,
      cursor: { id: params.cursor },
    }),
    where: {
      status: "ACCEPTED",
      AND: [
        {
          OR: [{ requesterId: user.id }, { addresseeId: user.id }],
        },
        ...(params?.keyword
          ? [
              {
                OR: [
                  {
                    requester: {
                      name: {
                        contains: params.keyword,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                  {
                    addressee: {
                      name: {
                        contains: params.keyword,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  },
                ],
              },
            ]
          : []),
      ],
    },
    include: {
      requester: true,
      addressee: true,
    },
  });
  const nextCursor =
    friends.length === params?.limit ? friends[friends.length - 1].id : null;
  const friendsDto = friends.map((f) =>
    f.requesterId === user.id
      ? pick(f.addressee, ["id", "name", "image"])
      : pick(f.requester, ["id", "name", "image"])
  );
  return { users: friendsDto, nextCursor };
}
