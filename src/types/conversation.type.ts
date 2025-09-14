import { MessageDTO } from "@/types/message.type";
import { Conversation } from "@prisma/client";

export type ConversationDTO = Omit<Conversation, "createdAt" | "updatedAt">;

export type ConversationWithStatusDTO = ConversationDTO & {
  lastMessage: MessageDTO | null;
  unread: number;
};
