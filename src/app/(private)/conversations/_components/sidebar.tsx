"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import AvartarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import PageSidebarHeader from "@/app/(private)/_components/page-sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useSeachUserConversationsQuery } from "@/data/conversation.client";
import { useUserQuery } from "@/data/user.client";
import { ConversationWithStatusDTO } from "@/types/conversation.type";
import { cn } from "@/utils/shadcn";

export default function ConversationSidebar() {
  const { data: conversations } = useSeachUserConversationsQuery();

  return (
    <Sidebar collapsible="offcanvas">
      <PageSidebarHeader title="Conversations" />
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            {conversations?.map((conversation) => (
              <ComvarsationItem
                key={conversation.id}
                conversation={conversation}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

type ComvarsationItemProps = {
  conversation: ConversationWithStatusDTO;
};

function ComvarsationItem({ conversation }: ComvarsationItemProps) {
  const { data: currentUser } = useUserQuery();
  const formatedDate =
    conversation.lastMessage &&
    formatDistanceToNow(new Date(conversation.lastMessage?.createdAt), {
      addSuffix: true,
    });
  const senderIsCurrentUser =
    conversation.lastMessage?.senderId === currentUser?.id;
  const notifications =
    conversation.unread > 0 ? conversation.unread : undefined;

  return (
    <Link
      href={`/conversations/${conversation.id}`}
      key={conversation.id}
      className="flex items-center gap-2 p-4 text-sm leading-tight border-b hover:bg-sidebar-accent hover:text-sidebar-accent-foreground whitespace-nowrap last:border-b-0"
    >
      <AvartarWithIndicator
        className="size-10"
        image={conversation.image}
        alt={conversation.name}
        online={false}
        notifications={notifications}
      />
      <div className="w-full">
        <div className="flex items-center w-full gap-2">
          <span className="font-medium">{conversation.name}</span>{" "}
          {formatedDate && (
            <span
              className={cn(
                "ml-auto text-xs to-primary",
                (!notifications ||
                  notifications === 0 ||
                  senderIsCurrentUser) &&
                  "text-muted-foreground"
              )}
            >
              {formatedDate}
            </span>
          )}
        </div>
        <span
          className={cn(
            "line-clamp-1 w-[260px] text-sm whitespace-break-spaces text-primary",
            (!notifications || notifications === 0 || senderIsCurrentUser) &&
              "text-muted-foreground"
          )}
        >
          {conversation.lastMessage?.content
            ? senderIsCurrentUser
              ? `You: ${conversation.lastMessage.content}`
              : `New: ${conversation.lastMessage.content}`
            : "Started a conversation"}
        </span>
      </div>
    </Link>
  );
}
