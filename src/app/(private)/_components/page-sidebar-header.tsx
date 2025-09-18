"use client";

import CreateConversationDialog from "@/app/(private)/_components/create-conversation-dialog";
import SearchConversationDialog from "@/app/(private)/_components/search-conversation-dialog";
import SearchFriendDialog from "@/app/(private)/_components/search-friend-dialog";
import { SidebarHeader } from "@/components/ui/sidebar";

type Props = {
  title: string;
};

export default function PageSidebarHeader({ title }: Props) {
  return (
    <SidebarHeader className="gap-3.5 border-b p-4">
      <div className="flex w-full items-center justify-between">
        <div className="text-foreground text-base font-medium">{title}</div>
        <div className="flex items-center gap-2">
          <SearchFriendDialog />
          <CreateConversationDialog />
        </div>
      </div>
      <SearchConversationDialog />
    </SidebarHeader>
  );
}
