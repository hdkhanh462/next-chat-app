import { UserDTO } from "@/types/user.type";
import { Message } from "@prisma/client";

export type MessageDTO = Omit<Message, "updatedAt" | "conversationId" | "seq">;

export type MessageWithSenderDTO = Omit<MessageDTO, "senderId"> & {
  sender: UserDTO;
  seenBy: UserDTO[];
};
