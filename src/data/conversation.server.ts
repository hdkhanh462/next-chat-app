import { prisma } from "@/lib/prisma";
import {
  ConversationWithMessagesDTO,
  ConversationWithStatusDTO,
} from "@/types/conversation.type";

export async function searchUserConversations(
  userId: string,
  keyword: string | null
): Promise<ConversationWithStatusDTO[]> {
  const conversations = await prisma.conversation.findMany({
    take: 10,
    orderBy: { updatedAt: "desc" },
    where: {
      members: {
        some: { userId },
      },
      ...(keyword
        ? {
            OR: [
              // Group chat
              { name: { contains: keyword, mode: "insensitive" } },
              // Private chat
              {
                members: {
                  some: {
                    userId: { not: userId },
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
      members: {
        take: 2,
        select: {
          lastReadSeq: true,
          member: true,
        },
      },
      messages: {
        orderBy: { seq: "desc" },
        take: 1,
      },
    },
  });

  return conversations.map((conv) => {
    const lastReadSeq =
      conv.members.find((m) => m.member.id === userId)?.lastReadSeq ?? 0;
    const latestSeq = conv.messages[0]?.seq ?? 0;
    const unreadCount = Math.max(0, latestSeq - lastReadSeq);
    const lastMessage = conv.messages[0] && {
      id: conv.messages[0].id,
      content: conv.messages[0].content,
      senderId: conv.messages[0].senderId,
      createdAt: conv.messages[0].createdAt,
    };

    let displayName = conv.name;
    let displayImage: string | null = conv.image ?? null;

    if (!conv.isGroup) {
      // lấy người còn lại trong cuộc trò chuyện
      const other = conv.members.find((m) => m.member.id !== userId)?.member;
      displayName = other?.name || "Unknown";
      displayImage = other?.image || null;
    }

    return {
      id: conv.id,
      isGroup: conv.isGroup,
      name: displayName,
      image: displayImage,
      nextSeq: conv.nextSeq,
      lastMessage: lastMessage,
      unread: unreadCount,
    };
  });
}

export async function getConversationById(
  userId: string,
  conversationId: string
): Promise<ConversationWithMessagesDTO | null> {
  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        take: 2,
        select: {
          lastReadSeq: true,
          member: true,
        },
      },
      messages: {
        orderBy: { seq: "desc" },
        include: { sender: true },
      },
    },
  });

  if (!conv) return null;

  const lastReadSeq =
    conv.members.find((m) => m.member.id === userId)?.lastReadSeq ?? 0;
  const latestSeq = conv.messages[0]?.seq ?? 0;
  const unreadCount = Math.max(0, latestSeq - lastReadSeq);
  const lastMessage = conv.messages[0] && {
    id: conv.messages[0].id,
    content: conv.messages[0].content,
    seq: conv.messages[0].seq,
    senderId: conv.messages[0].sender.id,
    createdAt: conv.messages[0].createdAt,
  };

  let displayName = conv.name;
  let displayImage: string | null = conv.image ?? null;

  if (!conv.isGroup) {
    // lấy người còn lại trong cuộc trò chuyện
    const other = conv.members.find((m) => m.member.id !== userId)?.member;
    displayName = other?.name || "Unknown";
    displayImage = other?.image || null;
  }

  return {
    id: conv.id,
    isGroup: conv.isGroup,
    name: displayName,
    image: displayImage,
    lastMessage: lastMessage,
    messages: conv.messages,
    unread: unreadCount,
  };
}
