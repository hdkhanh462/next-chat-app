import "server-only";

import { omit, pick } from "lodash";

import { getUserCached } from "@/data/user";
import { prisma } from "@/lib/prisma";
import { ConversationFilterInput } from "@/schemas/conversation.schema";

export async function getConversations(filter?: ConversationFilterInput) {
  const user = await getUserCached();
  const conversations = await prisma.conversation.findMany({
    take: 10,
    orderBy: { updatedAt: "desc" },
    where: {
      members: { some: { id: user.id } },
      ...(filter?.since ? { updatedAt: { lt: filter.since } } : {}),
      ...(filter?.after ? { updatedAt: { gt: filter.after } } : {}),
      ...(filter?.keyword
        ? {
            OR: [
              { name: { contains: filter.keyword, mode: "insensitive" } },
              {
                members: {
                  some: {
                    id: { not: user.id },
                    name: { contains: filter.keyword, mode: "insensitive" },
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
