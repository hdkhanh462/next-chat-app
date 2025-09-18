"use client";

import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect } from "react";

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
import { pusherClient } from "@/lib/pusher/client";
import {
  ConversationWithMembersDTO,
  FullConversationDTO,
} from "@/types/conversation.type";
import { FullMessageDTO, MessageWithSenderDTO } from "@/types/message.type";
import { cn } from "@/utils/shadcn";
import { omit } from "lodash";

export default function ConversationSidebar() {
  const { data: currentUser } = useUserQuery();
  const queryCLient = useQueryClient();

  useEffect(() => {
    if (!currentUser) return;

    pusherClient.subscribe(currentUser.id);
    console.log("Subscribed to channel:", currentUser.id);

    const newConvHandler = (conv: ConversationWithMembersDTO) => {
      console.log("Conversation: New conversation received:", conv);
      queryCLient.setQueryData(
        ["conversations", null],
        (prev: FullConversationDTO[]) =>
          prev.find((c) => c.id === conv.id)
            ? prev
            : [
                {
                  ...conv,
                  messages: [],
                },
                ...prev,
              ]
      );
    };

    const newMessageHandler = (msg: MessageWithSenderDTO) => {
      console.log("Conversation: New message received:", msg);
      queryCLient.setQueryData(
        ["conversations", null],
        (prev: FullConversationDTO[]) =>
          prev.map((conv) =>
            conv.id === msg.conversationId
              ? {
                  ...conv,
                  messages: [msg],
                }
              : conv
          )
      );
    };

    const updateMessageHandler = (msg: FullMessageDTO) => {
      console.log("Conversation: Message updated:", msg);
      queryCLient.setQueryData(
        ["conversations", null],
        (prev: FullConversationDTO[]) =>
          prev.map((conv) =>
            conv.id === msg.conversationId
              ? {
                  ...conv,
                  messages: [
                    omit(
                      {
                        ...msg,
                        seenByIds: msg.seenBy.map((u) => u.id),
                      },
                      "seenBy"
                    ),
                  ],
                }
              : conv
          )
      );
    };

    pusherClient.bind("conversation:new", newConvHandler);
    pusherClient.bind("conversation:new-message", newMessageHandler);
    pusherClient.bind("conversation:update-message", updateMessageHandler);

    return () => {
      pusherClient.unbind("conversation:new", newConvHandler);
      pusherClient.unbind("conversation:new-message", newMessageHandler);
      pusherClient.unbind("conversation:update-message", updateMessageHandler);
      pusherClient.unsubscribe(currentUser.id);
    };
  }, [currentUser, queryCLient]);

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
