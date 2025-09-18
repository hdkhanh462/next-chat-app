import { Conversation } from "@prisma/client";

import { MessageDTO, MessageWithSenderDTO } from "@/types/message.type";
import { UserDTO } from "@/types/user.type";

export type ConversationDTO = Omit<Conversation, "createdAt" | "updatedAt">;

export type ConversationWithMessagesDTO = ConversationDTO & {
  messages: MessageDTO[];
};

export type ConversationWithMembersDTO = Omit<ConversationDTO, "memberIds"> & {
  members: UserDTO[];
};

export type FullConversationDTO = Omit<ConversationDTO, "memberIds"> & {
  members: UserDTO[];
  messages: MessageWithSenderDTO[];
};
