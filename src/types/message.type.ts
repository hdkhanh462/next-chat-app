import { UserDTO } from "@/types/user.type";
import { Message } from "@prisma/client";

export type MessageDTO = Omit<Message, "updatedAt">;

export type MessageWithSenderDTO = Omit<MessageDTO, "senderId"> & {
  sender: UserDTO;
};

export type FullMessageDTO = Omit<MessageDTO, "senderId" | "seenByIds"> & {
  sender: UserDTO;
  seenBy: UserDTO[];
};

export type FullMessagesWithCursorDTO = {
  messages: FullMessageDTO[];
  nextCursor: string | null;
};
