"use client";

import { seenMessage } from "@/actions/message.action";
import ConversationBody from "@/app/(private)/conversations/_components/body";
import ConversationFooter from "@/app/(private)/conversations/_components/footer";
import ConversationHeader from "@/app/(private)/conversations/_components/header";
import {
  useConversationQuery,
  useMessagesQuery,
} from "@/data/conversation.client";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const params = useParams();
  const conversationId = useMemo(
    () => (params?.id as string) || "",
    [params.id]
  );
  const { data: conversation, isFetching: isFetchingConversation } =
    useConversationQuery(conversationId);
  const { data: messages, isFetching: isFetchingMessages } =
    useMessagesQuery(conversationId);
  const { execute: seenMessageExecute } = useAction(seenMessage);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted) return;
    setIsMounted(true);
    seenMessageExecute({ conversationId });
  }, [isMounted, conversationId, seenMessageExecute]);

  if (isFetchingConversation || isFetchingMessages) {
    return (
      <div className="flex items-center justify-center flex-1 h-full">
        <Loader2 className="animate-spin size-8" />
      </div>
    );
  }

  if (!conversation || !messages) return null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden max-h-dvh">
      <ConversationHeader initial={conversation} />
      <ConversationBody initial={messages} conversationId={conversationId} />
      <ConversationFooter conversationId={conversationId} />
    </div>
  );
}
