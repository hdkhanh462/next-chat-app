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
      messages: true,
    },
  });

  if (!conv) return null;

  const convDto = omit(
    {
      ...conv,
      members: conv.members.map((m) => pick(m, ["id", "name", "image"])),
      messages: conv.messages.map((msg) =>
        omit(msg, ["updatedAt", "seenByIds"])
      ),
    },
    ["createdAt", "updatedAt", "memberIds"]
  );

  return convDto;
}

export async function getConversationMessages(
  conversationId: string,
  cursor: string | null // id of the lastest message from current loaded messages
) {
  const user = await getUserCached();
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      conversation: { members: { some: { id: user.id } } },
    },
    take: 20,
    skip: cursor ? 1 : 0, // skip the message that matches the cursor
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "asc" },
    include: {
      sender: true,
      seenBy: true,
    },
  });

  const messagesDto = messages.map((msg) =>
    omit(
      {
        ...msg,
        sender: pick(msg.sender, ["id", "name", "image"]),
        seenBy: msg.seenBy.map((s) => pick(s, ["id", "name", "image"])),
      },
      ["updatedAt", "seenByIds"]
    )
  );
  return messagesDto;
}
