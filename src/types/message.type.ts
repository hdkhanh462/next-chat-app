import { UserDTO } from "@/types/user.type";
import { Message } from "@prisma/client";

export type MessageDTO = Omit<Message, "updatedAt" | "conversationId">;

export type MessageWithSenderDTO = MessageDTO & {
  sender: UserDTO;
};
