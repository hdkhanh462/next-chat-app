import { omit, pick } from "lodash";

import { getUserCached } from "@/data/user";
import { prisma } from "@/lib/prisma";
import { MessageOueryParamsInput } from "@/schemas/message.schema";
import { FullMessagesWithCursorDTO } from "@/types/message.type";

export async function getMessages(
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
    orderBy: { createdAt: "desc" },
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
      ["updatedAt", "senderId", "seenByIds"]
    )
  );
  return messagesDto;
}

export async function getMessagesNew(
  conversationId: string,
  query?: MessageOueryParamsInput
): Promise<FullMessagesWithCursorDTO> {
  const user = await getUserCached();
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      conversation: { members: { some: { id: user.id } } },
    },
    take: query?.limit,
    ...(query?.cursor && {
      skip: 1,
      cursor: { id: query.cursor },
    }),
    orderBy: { createdAt: "desc" },
    include: {
      sender: true,
      seenBy: true,
    },
  });

  const nextCursor =
    messages.length === query?.limit ? messages[messages.length - 1].id : null;

  const messagesDto = messages.map((msg) =>
    omit(
      {
        ...msg,
        sender: pick(msg.sender, ["id", "name", "image"]),
        seenBy: msg.seenBy.map((s) => pick(s, ["id", "name", "image"])),
      },
      ["updatedAt", "senderId", "seenByIds"]
    )
  );
  return {
    messages: messagesDto,
    nextCursor,
  };
}
