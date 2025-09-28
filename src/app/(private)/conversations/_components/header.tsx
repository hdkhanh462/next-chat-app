"use client";

import { PanelRightIcon } from "lucide-react";
import { useMemo } from "react";

import AvatarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import OnlineIndicator from "@/app/(private)/_components/online-indicator";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { extractConvDetails } from "@/data/queries/conversation";
import { useUserQuery } from "@/data/queries/user";
import { usePresenceStore } from "@/lib/zustand/use-presence-store";
import { FullConversationDTO } from "@/types/conversation.type";

type Props = {
  initial: FullConversationDTO;
};

export default function ConversationHeader({ initial }: Props) {
  const { data: currentUser } = useUserQuery();
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const { onlineText, onlineCount } = useMemo(() => {
    const onlineMemberIds = initial.members.filter(
      (m) => onlineUserIds.includes(m.id) && m.id !== currentUser?.id
    );

    const count = onlineMemberIds.length;

    if (count === 0) {
      return {
        onlineText: initial.isGroup ? "No one online" : "Offline",
        onlineCount: 0,
      };
    }

    return {
      onlineText: initial.isGroup
        ? `${count.toString().padStart(2, "0")} online`
        : "Online",
      onlineCount: count,
    };
  }, [initial, currentUser, onlineUserIds]);

  if (!currentUser) return null;

  const { displayName, displayImage } = extractConvDetails(
    initial,
    currentUser.id
  );

  return (
    <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
      <SidebarTrigger className="-ml-1 hover:cursor-pointer" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-1/2"
      />
      <div className="flex items-center gap-2">
        <AvatarWithIndicator
          className="size-12"
          image={displayImage}
          alt={displayName}
        />
        <div>
          <h1 className="text-lg font-semibold leading-none">{displayName}</h1>
          <div className="flex gap-1 items-center text-sm text-muted-foreground">
            <OnlineIndicator online={onlineCount > 0} />
            <span>{onlineText}</span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto size-7 hover:cursor-pointer"
      >
        <PanelRightIcon />
        <span className="sr-only">Conversation info</span>
      </Button>
    </header>
  );
}
