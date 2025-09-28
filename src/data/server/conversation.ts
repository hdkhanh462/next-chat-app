import "server-only";

import { omit, pick } from "lodash";

import { getUserCached } from "@/data/server/user";
import { prisma } from "@/lib/prisma";
import { ConversationParamsInput } from "@/schemas/conversation.schema";
import { FullConversationDTO } from "@/types/conversation.type";

export async function getConversations(
  params: ConversationParamsInput
): Promise<FullConversationDTO[]> {
  const user = await getUserCached();
  const skip =
    params.page && params.limit ? (params.page - 1) * params.limit : 0;

  const conversations = await prisma.conversation.findMany({
    take: params.limit,
    skip,
    orderBy: { lastMessageAt: "desc" },
    where: {
      members: { some: { id: user.id } },
      ...(params.since ? { updatedAt: { lt: params.since } } : {}),
      ...(params.after ? { updatedAt: { gt: params.after } } : {}),
      ...(params.keyword
        ? {
            OR: [
              { name: { contains: params.keyword, mode: "insensitive" } },
              {
                members: {
                  some: {
                    id: { not: user.id },
                    name: { contains: params.keyword, mode: "insensitive" },
                  },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      members: true,
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        include: { sender: true },
      },
    },
  });

  const conversationsDto = conversations.map((conv) =>
    omit(
      {
        ...conv,
        members: conv.members.map((m) => pick(m, ["id", "name", "image"])),
        messages: conv.messages.map((msg) =>
          omit(
            {
              ...msg,
              sender: pick(msg.sender, ["id", "name", "image"]),
            },
            ["updatedAt", "senderId"]
          )
        ),
      },
      ["createdAt", "updatedAt", "memberIds"]
    )
  );

  return conversationsDto;
}

export async function getConversationById(conversationId: string) {
  const user = await getUserCached();
  const conv = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
      members: { some: { id: user.id } },
    },
    include: {
      members: true,
      messages: { include: { sender: true } },
    },
  });

  if (!conv) return null;

  const convDto = omit(
    {
      ...conv,
      members: conv.members.map((m) => pick(m, ["id", "name", "image"])),
      messages: conv.messages.map((msg) =>
        omit(
          {
            ...msg,
            sender: pick(msg.sender, ["id", "name", "image"]),
          },
          ["updatedAt", "senderId"]
        )
      ),
    },
    ["createdAt", "updatedAt", "memberIds"]
  );

  return convDto;
}
