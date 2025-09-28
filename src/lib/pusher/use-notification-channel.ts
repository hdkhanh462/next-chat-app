"use client";

import { useQueryClient } from "@tanstack/react-query";
import { compareDesc } from "date-fns";
import { omit } from "lodash";
import { usePathname } from "next/navigation";
import { Channel } from "pusher-js";
import { useCallback, useEffect, useRef } from "react";

import newFriendToast from "@/components/toasts/new-friend";
import newMessageToast from "@/components/toasts/new-message";
import {
  CONVERSATIONS_CHANNEL,
  FRIENDS_CHANNEL,
} from "@/constants/pusher-events";
import { pusherClient } from "@/lib/pusher/client";
import {
  ConversationWithMembersDTO,
  FullConversationDTO,
} from "@/types/conversation.type";
import { FullMessageDTO, MessageWithSenderDTO } from "@/types/message.type";
import { UserDTO } from "@/types/user.type";
import acceptFriendToast from "@/components/toasts/accept-friend";
import { QUERY_KEYS } from "@/data/queries/keys";

export default function useNotificationChannel(userId?: string) {
  const channelRef = useRef<Channel | null>(null);
  const pathname = usePathname();
  const queryCLient = useQueryClient();

  const newMessageHandler = useCallback(
    (msg: MessageWithSenderDTO) => {
      queryCLient.setQueryData(
        QUERY_KEYS.CONVERSATIONS.getConversations({}),
        (prev?: FullConversationDTO[]) => {
          if (!prev) return [];

          const updated = prev.map((conv) =>
            conv.id === msg.conversationId
              ? {
                  ...conv,
                  messages: [msg],
                  lastMessageAt: msg.createdAt,
                }
              : conv
          );

          return [...updated].sort((a, b) =>
            compareDesc(new Date(a.lastMessageAt), new Date(b.lastMessageAt))
          );
        }
      );

      if (pathname !== `/conversations/${msg.conversationId}`) {
        newMessageToast(msg);
      }
    },
    [pathname, queryCLient]
  );

  const newConversationHandler = useCallback(
    (conv: ConversationWithMembersDTO) => {
      queryCLient.setQueryData(
        QUERY_KEYS.CONVERSATIONS.getConversations({}),
        (prev?: FullConversationDTO[]) => {
          if (!prev) {
            return [{ ...conv, messages: [] }];
          }
          return prev.find((c) => c.id === conv.id)
            ? prev
            : [{ ...conv, messages: [] }, ...prev];
        }
      );
    },
    [queryCLient]
  );

  const updateMessageHandler = useCallback(
    (msg: FullMessageDTO) => {
      queryCLient.setQueryData(
        QUERY_KEYS.CONVERSATIONS.getConversations({}),
        (prev?: FullConversationDTO[]) => {
          if (!prev) return [];
          return prev.map((conv) =>
            conv.id === msg.conversationId
              ? {
                  ...conv,
                  messages: [
                    omit(
                      { ...msg, seenByIds: msg.seenBy.map((u) => u.id) },
                      "seenBy"
                    ),
                  ],
                }
              : conv
          );
        }
      );
    },
    [queryCLient]
  );

  const newFriendHandler = useCallback((friend: UserDTO) => {
    newFriendToast(friend);
  }, []);

  const acceptFriendHandler = useCallback((friend: UserDTO) => {
    acceptFriendToast(friend);
  }, []);

  useEffect(() => {
    if (!userId) return;
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe(`private-user-${userId}`);
      channelRef.current.bind(
        CONVERSATIONS_CHANNEL.NEW,
        newConversationHandler
      );
      channelRef.current.bind(
        CONVERSATIONS_CHANNEL.MESSAGE.NEW,
        newMessageHandler
      );
      channelRef.current.bind(
        CONVERSATIONS_CHANNEL.MESSAGE.UPDATE,
        updateMessageHandler
      );
      channelRef.current.bind(FRIENDS_CHANNEL.NEW, newFriendHandler);
      channelRef.current.bind(FRIENDS_CHANNEL.ACCEPT, acceptFriendHandler);
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind(
          CONVERSATIONS_CHANNEL.NEW,
          newConversationHandler
        );
        channelRef.current.unbind(
          CONVERSATIONS_CHANNEL.MESSAGE.NEW,
          newMessageHandler
        );
        channelRef.current.unbind(
          CONVERSATIONS_CHANNEL.MESSAGE.UPDATE,
          updateMessageHandler
        );
        channelRef.current.unbind(FRIENDS_CHANNEL.NEW, newFriendHandler);
        channelRef.current.unbind(FRIENDS_CHANNEL.ACCEPT, acceptFriendHandler);
        pusherClient.unsubscribe(`private-user-${userId}`);
        channelRef.current = null;
      }
    };
  }, [
    userId,
    newMessageHandler,
    newConversationHandler,
    updateMessageHandler,
    newFriendHandler,
    acceptFriendHandler,
  ]);
}
