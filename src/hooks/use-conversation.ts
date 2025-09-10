"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";

// TODO: Implement isActive logic

export function useConversation() {
  const params = useParams();
  const conversationId = useMemo(
    () => (params?.id as string) || "",
    [params.id]
  );

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return {
    conversationId,
    isOpen,
  };
}
