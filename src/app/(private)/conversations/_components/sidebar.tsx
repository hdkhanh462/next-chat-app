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
import { Skeleton } from "@/components/ui/skeleton";
import {
  extractConvDetails,
  useUserConvsQuery,
} from "@/data/hooks/conversation";
import { useUserQuery } from "@/data/hooks/user";
import { FullConversationDTO } from "@/types/conversation.type";
import { cn } from "@/utils/shadcn";

export default function ConversationSidebar() {
  const { data: currentUser } = useUserQuery();

  return (
    <Sidebar collapsible="offcanvas">
      <PageSidebarHeader title="Conversations" />
      <ConversationSidebarContent currentUserId={currentUser?.id} />
    </Sidebar>
  );
}

type ConversationSidebarContentProps = {
  currentUserId?: string;
};

function ConversationSidebarContent({
  currentUserId,
}: ConversationSidebarContentProps) {
  const { data: conversations, isFetching: isFetchingConvs } =
    useUserConvsQuery();

  if (isFetchingConvs)
    return (
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <ConversationItemSkeleton key={index} />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    );

  if (!currentUserId) return;

  return (
    <SidebarContent>
      <SidebarGroup className="p-0">
        <SidebarGroupContent>
          {conversations?.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              currentUserId={currentUserId}
            />
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

type ConversationItemProps = {
  conversation: FullConversationDTO;
  currentUserId: string;
};

function ConversationItem({
  conversation,
  currentUserId,
}: ConversationItemProps) {
  const { displayName, displayImage } = extractConvDetails(
    conversation,
    currentUserId
  );
  const lastMessage = conversation.messages.at(0);
  const formatedDate =
    lastMessage && formatDistanceToNow(new Date(lastMessage.createdAt));
  const isRead = lastMessage?.seenByIds.some(
    (userId) => userId === currentUserId
  );
  const isOwnMessage = lastMessage?.sender.id === currentUserId;

  return (
    <Link
      href={`/conversations/${conversation.id}`}
      key={conversation.id}
      className="flex items-center gap-2 p-4 text-sm leading-tight border-b hover:bg-sidebar-accent hover:text-sidebar-accent-foreground whitespace-nowrap last:border-b-0"
    >
      <AvartarWithIndicator
        className="size-10"
        image={displayImage}
        alt={displayName}
        online={false}
      />
      <div className="w-full">
        <div className="flex items-center w-full gap-2">
          <span className="font-medium line-clamp-1 w-[50%] whitespace-break-spaces">
            {displayName}
          </span>{" "}
          {formatedDate && (
            <span
              className={cn(
                "ml-auto text-xs to-primary",
                (isRead || isOwnMessage) && "text-muted-foreground"
              )}
            >
              {formatedDate}
            </span>
          )}
        </div>
        <span
          className={cn(
            "line-clamp-1 w-[260px] text-sm whitespace-break-spaces text-primary",
            (isRead || isOwnMessage) && "text-muted-foreground"
          )}
        >
          {lastMessage?.content
            ? isOwnMessage
              ? `You: ${lastMessage.content}`
              : `${lastMessage.sender.name}: ${lastMessage.content}`
            : "Started a conversation"}
        </span>
      </div>
    </Link>
  );
}

function ConversationItemSkeleton() {
  return (
    <div className="flex items-center gap-2 p-4 text-sm leading-tight border-b hover:bg-sidebar-accent hover:text-sidebar-accent-foreground whitespace-nowrap last:border-b-0">
      <Skeleton className="size-10 aspect-square rounded-full" />
      <div className="w-full">
        <Skeleton className="w-[50%] h-3" />
        <Skeleton className="mt-2 w-[75%] h-2" />
      </div>
    </div>
  );
}
