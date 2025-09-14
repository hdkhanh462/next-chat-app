import { MessageDTO, MessageWithSenderDTO } from "@/types/message.type";
import { Conversation } from "@prisma/client";

export type ConversationDTO = Omit<
  Conversation,
  "createdAt" | "updatedAt" | "nextSeq"
>;

export type ConversationWithStatusDTO = ConversationDTO & {
  lastMessage: MessageDTO | null;
  unread: number;
};

export type ConversationWithMessagesDTO = ConversationWithStatusDTO & {
  messages: MessageWithSenderDTO[];
};
