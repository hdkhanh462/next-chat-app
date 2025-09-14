"use client";

import ConversationHeader from "@/app/(private)/conversations/_components/header";
import ConversationBody from "@/app/(private)/conversations/_components/body";
import { useConversationQuery } from "@/data/conversation.client";
import ConversationFooter from "@/app/(private)/conversations/_components/footer";

export default function Page() {
  const { data: conversation, isLoading } = useConversationQuery();

  // TODO: Skeleton loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!conversation) return null;

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <ConversationHeader initial={conversation} />
      <ConversationBody
        conversationId={conversation.id}
        initial={conversation.messages}
      />
      <ConversationFooter />
    </div>
  );
}
