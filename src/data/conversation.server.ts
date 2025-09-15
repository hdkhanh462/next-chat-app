import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import {
  ConversationDTO,
  ConversationWithStatusDTO,
} from "@/types/conversation.type";
import { MessageWithSenderDTO } from "@/types/message.type";

export async function getConversations(
  userId: string,
  keyword: string | null
): Promise<ConversationWithStatusDTO[]> {
  // 1. Get conversations
  const conversations = await prisma.conversation.findMany({
    take: 10,
    orderBy: { updatedAt: "desc" },
    where: {
      members: { some: { memberId: userId } },
      ...(keyword
        ? {
            OR: [
              // Group chat
              { name: { contains: keyword, mode: "insensitive" } },
              // Private chat
              {
                members: {
                  some: {
                    memberId: { not: userId },
                    member: {
                      name: { contains: keyword, mode: "insensitive" },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      members: { select: { member: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const convIds = conversations.map((c) => c.id);

  // 2. Get lastSeen of user for all conversations (map conversationId -> Date)
  const lastSeens = await prisma.messageSeen.findMany({
    where: {
      userId,
      message: { conversationId: { in: convIds } },
    },
    orderBy: { seenAt: "desc" },
    distinct: ["messageId"],
    select: {
      message: { select: { conversationId: true } },
      seenAt: true,
    },
  });

  const lastSeenMap = new Map<string, Date>();
  for (const seen of lastSeens) {
    const convId = seen.message.conversationId;
    if (!lastSeenMap.has(convId)) {
      lastSeenMap.set(convId, seen.seenAt);
    }
  }

  // 3. Get unread count using aggregate
  const unreadRaw = await prisma.message.groupBy({
    by: ["conversationId"],
    where: {
      conversationId: { in: convIds },
      senderId: { not: userId },
      OR: convIds.map((id) => {
        const lastSeen = lastSeenMap.get(id);
        return lastSeen
          ? { conversationId: id, createdAt: { gt: lastSeen } }
          : { conversationId: id };
      }),
    },
    _count: true,
  });

  const unreadMap = new Map(unreadRaw.map((u) => [u.conversationId, u._count]));

  // 4. Build DTO
  return conversations.map((conv) => {
    const lastMessage = conv.messages[0] && {
      id: conv.messages[0].id,
      content: conv.messages[0].content,
      images: conv.messages[0].images,
      senderId: conv.messages[0].senderId,
      createdAt: conv.messages[0].createdAt,
    };

    const { displayName, displayImage } = extractConversationDetails(
      conv,
      userId
    );

    return {
      id: conv.id,
      isGroup: conv.isGroup,
      name: displayName,
      image: displayImage,
      lastMessage,
      unread: unreadMap.get(conv.id) ?? 0,
    };
  });
}

export async function getConversationById(
  userId: string,
  conversationId: string
): Promise<ConversationDTO | null> {
  const cacheKey = `conv:meta:${conversationId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      members: {
        some: { memberId: userId },
      },
    },
    include: {
      members: {
        take: 2,
        select: {
          member: true,
        },
      },
    },
  });

  if (!conv) return null;

  const { displayName, displayImage } = extractConversationDetails(
    conv,
    userId
  );

  const result = {
    id: conv.id,
    isGroup: conv.isGroup,
    name: displayName,
    image: displayImage,
  };
  await redis.set(cacheKey, JSON.stringify(result), "EX", 3600); // cache 1h
  return result;
}

function extractConversationDetails(
  conv: {
    name: string | null;
    image: string | null;
    isGroup: boolean;
    members: { member: { id: string; name: string; image: string | null } }[];
  },
  userId: string
) {
  let displayName = conv.name;
  let displayImage: string | null = conv.image ?? null;

  if (!conv.isGroup) {
    // lấy người còn lại trong cuộc trò chuyện
    const other = conv.members.find((m) => m.member.id !== userId)?.member;
    displayName = other?.name || "Unknown";
    displayImage = other?.image || null;
  }
  return { displayName, displayImage };
}

export async function getOlderMessages(
  userId: string,
  conversationId: string,
  cursor: string | null // id of the lastest message from current loaded messages
): Promise<MessageWithSenderDTO[]> {
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      conversation: { members: { some: { memberId: userId } } },
    },
    take: 20,
    skip: cursor ? 1 : 0, // skip the message that matches the cursor
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "asc" },
    include: { sender: true, seenBy: { select: { user: true } } },
  });

  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    images: m.images,
    createdAt: m.createdAt,
    sender: {
      id: m.sender.id,
      name: m.sender.name,
      image: m.sender.image,
    },
    seenBy: m.seenBy.map((s) => ({
      id: s.user.id,
      name: s.user.name,
      image: s.user.image,
    })),
  }));
}
