import { MessageWithSenderDTO } from "@/types/message.type";
import React from "react";

type Props = {
  conversationId: string;
  initial: MessageWithSenderDTO[];
};

export default function ConversationBody({ conversationId, initial }: Props) {
  return <div className="flex-1 overflow-y-auto">MessageList</div>;
}
