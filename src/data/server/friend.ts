import "server-only";

import { Prisma } from "@prisma/client";
import { pick } from "lodash";

import { getUserCached } from "@/data/server/user";
import { prisma } from "@/lib/prisma";
import { UserParamsInput } from "@/schemas/user.schema";
import { UserDTO } from "@/types/user.type";

export async function getFriends(params: UserParamsInput): Promise<UserDTO[]> {
  const user = await getUserCached();
  const skip =
    params.page && params.limit ? (params.page - 1) * params.limit : 0;

  const friends = await prisma.friendship.findMany({
    take: params.limit,
    skip,
    where: {
      status: "ACCEPTED",
      AND: [
        {
          OR: [{ requesterId: user.id }, { addresseeId: user.id }],
        },
        ...(params.keyword
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

  return friends.map((f) =>
    f.requesterId === user.id
      ? pick(f.addressee, ["id", "name", "image"])
      : pick(f.requester, ["id", "name", "image"])
  );
}
