"use client";

import ConversationHeader from "@/app/(private)/conversations/_components/header";
import { useConversation } from "@/hooks/use-conversation";

export default function Page() {
  const { conversationId } = useConversation();

  return (
    <>
      <ConversationHeader />
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="text-muted-foreground text-lg font-medium">
          {conversationId}
        </div>
      </div>
    </>
  );
}
