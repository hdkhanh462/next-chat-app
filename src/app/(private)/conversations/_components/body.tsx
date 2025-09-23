"use client";

import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { compareAsc, differenceInMinutes, format, isSameDay } from "date-fns";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useInView } from "react-intersection-observer";

import { seenMessage } from "@/actions/message.action";
import AvatarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMessages } from "@/data/hooks/message";
import { useUserQuery } from "@/data/hooks/user";
import { pusherClient } from "@/lib/pusher/client";
import {
  FullMessageDTO,
  FullMessagesWithCursorDTO,
  MessageWithSenderDTO,
} from "@/types/message.type";
import { cn } from "@/utils/shadcn";
import { QUERY_KEYS } from "@/constants/query-keys";
import { MESSAGES_CHANNEL } from "@/constants/pusher-events";

type Props = {
  conversationId: string;
};

export default function ConversationBody({ conversationId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const skipInitialRef = useRef(true);
  const { ref: topRef, inView } = useInView({
    root: scrollableRef.current ?? undefined,
    threshold: 0.1,
    initialInView: false,
  });
  const { data: currentUser } = useUserQuery();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(conversationId);
  const { execute: seenMessageExecute } = useAction(seenMessage);
  const queryClient = useQueryClient();

  const messages = useMemo(
    () =>
      data?.pages
        ? data.pages
            .flatMap((page) => page.messages ?? [])
            .sort((a, b) =>
              compareAsc(new Date(a.createdAt), new Date(b.createdAt))
            )
        : [],
    [data]
  );

  useLayoutEffect(() => {
    if (!data) return;

    if (skipInitialRef.current) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
        skipInitialRef.current = false;
      });
    }
  }, [conversationId, data]);

  useEffect(() => {
    seenMessageExecute({ conversationId });
  }, [conversationId, seenMessageExecute]);

  const newMessageHandler = useCallback(
    (msg: MessageWithSenderDTO) => {
      seenMessageExecute({ conversationId });
      queryClient.setQueryData(
        [QUERY_KEYS.CONVERSATIONS, conversationId, QUERY_KEYS.MESSAGES],
        (prev?: InfiniteData<FullMessagesWithCursorDTO>) => {
          if (!prev) {
            return {
              pages: [
                {
                  messages: [{ ...msg, seenBy: [] }],
                  nextCursor: null,
                },
              ],
              pageParams: [],
            };
          }

          const alreadyExists = prev.pages.some((page) =>
            page.messages.some((m) => m.id === msg.id)
          );
          if (alreadyExists) return prev;

          const newPages = [...prev.pages];
          newPages[newPages.length - 1] = {
            ...newPages[newPages.length - 1],
            messages: [
              ...newPages[newPages.length - 1].messages,
              { ...msg, seenBy: [] },
            ],
          };

          return {
            ...prev,
            pages: newPages,
          };
        }
      );

      if (msg.sender.id === currentUser?.id) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        });
      }
    },
    [conversationId, currentUser, queryClient, seenMessageExecute]
  );

  const updateMessageHandler = useCallback(
    (msg: FullMessageDTO) => {
      queryClient.setQueryData(
        [QUERY_KEYS.CONVERSATIONS, conversationId, QUERY_KEYS.MESSAGES],
        (prev?: InfiniteData<FullMessagesWithCursorDTO>) => {
          if (!prev) return prev;

          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) => (m.id === msg.id ? msg : m)),
            })),
          };
        }
      );
    },
    [conversationId, queryClient]
  );

  useEffect(() => {
    const channel = pusherClient.subscribe(conversationId);

    channel.bind(MESSAGES_CHANNEL.NEW, newMessageHandler);
    channel.bind(MESSAGES_CHANNEL.UPDATE, updateMessageHandler);

    return () => {
      channel.unbind(MESSAGES_CHANNEL.NEW, newMessageHandler);
      channel.unbind(MESSAGES_CHANNEL.UPDATE, updateMessageHandler);
      pusherClient.unsubscribe(conversationId);
    };
  }, [conversationId, newMessageHandler, updateMessageHandler]);

  const handleFetchNextPage = useCallback(async () => {
    if (!scrollableRef.current) {
      return fetchNextPage();
    }

    const el = scrollableRef.current;
    const prevScrollHeight = el.scrollHeight;
    await fetchNextPage();
    requestAnimationFrame(() => {
      const newScrollHeight = el.scrollHeight;
      el.scrollTop = newScrollHeight - prevScrollHeight + el.scrollTop;
    });
  }, [fetchNextPage]);

  useEffect(() => {
    if (skipInitialRef.current) return;
    if (inView && hasNextPage && !isFetchingNextPage) {
      handleFetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, handleFetchNextPage]);

  return (
    <div ref={scrollableRef} className="flex-1 overflow-y-auto scroll-smooth">
      <div ref={topRef} className="pb-24" />
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-2">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          message={message}
          currentUserId={currentUser?.id}
          isLast={index === messages.length - 1}
          prevMessage={index > 0 ? messages[index - 1] : undefined}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
}

type MessageItemProps = {
  message: FullMessageDTO;
  currentUserId?: string;
  isLast?: boolean;
  prevMessage?: FullMessageDTO;
};

function MessageItem({
  isLast,
  message,
  prevMessage,
  currentUserId,
}: MessageItemProps) {
  const isOwn = message.sender.id === currentUserId;
  const seenBy = message.seenBy.filter(
    (u) => u.id !== currentUserId && u.id !== message.sender.id
  );

  const { showTimestamp, formattedDate } = useMemo(() => {
    const currentDate = new Date(message.createdAt);
    const prevDate = prevMessage ? new Date(prevMessage.createdAt) : null;
    let showTimestamp = true;

    if (prevDate && isSameDay(currentDate, prevDate)) {
      const diffMinutes = differenceInMinutes(currentDate, prevDate);
      if (diffMinutes < 15) showTimestamp = false;
    }

    return {
      showTimestamp,
      formattedDate: showTimestamp
        ? isSameDay(currentDate, new Date())
          ? format(currentDate, "p")
          : format(currentDate, "Pp")
        : "",
    };
  }, [message, prevMessage]);

  return (
    <div className="py-4">
      {showTimestamp && (
        <div className="text-xs text-center text-muted-foreground">
          {formattedDate}
        </div>
      )}
      <div className={cn("flex gap-3 px-4 py-2", isOwn && "justify-end")}>
        {!isOwn && (
          <div className="flex items-end">
            <AvatarWithIndicator
              image={message.sender.image}
              alt={message.sender.name || "Sender avartar"}
            />
          </div>
        )}
        <div className={cn("flex flex-col gap-1", isOwn && "items-start")}>
          {!isOwn && (
            <div className="text-xs font-medium text-muted-foreground">
              {message.sender.name}
            </div>
          )}
          <div
            className={cn(
              "text-sm w-fit px-2 py-1.5 rounded-md max-w-[200px] md:max-w-md lg:max-w-lg xl:max-w-xl text-wrap break-words overflow-hidden",
              isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            {message.content}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-1 px-4">
        {isLast &&
          seenBy.length > 0 &&
          seenBy.map((sb) => (
            <Tooltip key={sb.id}>
              <TooltipTrigger>
                <AvatarWithIndicator
                  className="size-5"
                  fallbackClassName="size-3.5"
                  image={sb.image}
                  alt={sb.name}
                />
              </TooltipTrigger>
              <TooltipContent>{sb.name}</TooltipContent>
            </Tooltip>
          ))}
      </div>
    </div>
  );
}
