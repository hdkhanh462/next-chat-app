"use client";

import { format } from "date-fns";
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
    format(new Date(conversation.lastMessage?.createdAt), "MMM d");
  const senderIsCurrentUser =
    conversation.lastMessage?.senderId === currentUser?.id;

  return (
    <Link
      href={`/conversations/${conversation.id}`}
      key={conversation.id}
      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
    >
      <AvartarWithIndicator
        className="size-10"
        image={conversation.image}
        alt={conversation.name}
        online={false}
        notifications={
          conversation.unread > 0 ? conversation.unread : undefined
        }
      />
      <div className="w-full">
        <div className="flex w-full items-center gap-2">
          <span className="font-medium">{conversation.name}</span>{" "}
          {formatedDate && (
            <span className="ml-auto text-xs">{formatedDate}</span>
          )}
        </div>
        <span
          className={cn(
            "line-clamp-1 w-[260px] text-sm whitespace-break-spaces text-muted-foreground",
            conversation.unread > 0 && "text-primary"
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
