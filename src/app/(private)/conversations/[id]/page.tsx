"use client";

import ConversationHeader from "@/app/(private)/conversations/_components/header";
import { useConversationQuery } from "@/data/conversation.client";

export default function Page() {
  const { data: conversation } = useConversationQuery();

  // TODO: Skeleton loading state
  if (!conversation) return null;

  return (
    <>
      <ConversationHeader initial={conversation} />
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="text-muted-foreground text-lg font-medium">
          {conversation.id}
        </div>
      </div>
    </>
  );
}
