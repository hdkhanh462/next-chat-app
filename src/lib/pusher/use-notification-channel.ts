"use client";

import { useQueryClient } from "@tanstack/react-query";
import { omit } from "lodash";
import { usePathname } from "next/navigation";
import { Channel } from "pusher-js";
import { useCallback, useEffect, useRef } from "react";

import newMessageToast from "@/components/toasts/new-message";
import { CONVERSATIONS_CHANNEL } from "@/constants/pusher-events";
import { QUERY_KEYS } from "@/constants/query-keys";
import { pusherClient } from "@/lib/pusher/client";
import {
  ConversationWithMembersDTO,
  FullConversationDTO,
} from "@/types/conversation.type";
import { FullMessageDTO, MessageWithSenderDTO } from "@/types/message.type";
import { compareDesc } from "date-fns";

export default function useNotificationChannel(userId?: string) {
  const channelRef = useRef<Channel | null>(null);
  const pathname = usePathname();
  const queryCLient = useQueryClient();

  const newMessageHandler = useCallback(
    (msg: MessageWithSenderDTO) => {
      queryCLient.setQueryData(
        [QUERY_KEYS.CONVERSATIONS, null],
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
        [QUERY_KEYS.CONVERSATIONS, null],
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
        [QUERY_KEYS.CONVERSATIONS, null],
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

  useEffect(() => {
    if (!userId) return;
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe(`private-user-${userId}`);
      channelRef.current.bind(
        CONVERSATIONS_CHANNEL.BASE + CONVERSATIONS_CHANNEL.NEW,
        newConversationHandler
      );
      channelRef.current.bind(
        CONVERSATIONS_CHANNEL.BASE + CONVERSATIONS_CHANNEL.MESSAGE.NEW,
        newMessageHandler
      );
      channelRef.current.bind(
        CONVERSATIONS_CHANNEL.BASE + CONVERSATIONS_CHANNEL.MESSAGE.UPDATE,
        updateMessageHandler
      );
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind(
          CONVERSATIONS_CHANNEL.BASE + CONVERSATIONS_CHANNEL.NEW,
          newConversationHandler
        );
        channelRef.current.unbind(
          CONVERSATIONS_CHANNEL.BASE + CONVERSATIONS_CHANNEL.MESSAGE.NEW,
          newMessageHandler
        );
        channelRef.current.unbind(
          CONVERSATIONS_CHANNEL.BASE + CONVERSATIONS_CHANNEL.MESSAGE.UPDATE,
          updateMessageHandler
        );
        pusherClient.unsubscribe(`private-user-${userId}`);
        channelRef.current = null;
      }
    };
  }, [userId, newMessageHandler, newConversationHandler, updateMessageHandler]);
}
