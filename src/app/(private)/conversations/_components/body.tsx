import { differenceInMinutes, format, isSameDay } from "date-fns";
import { useRef, useState } from "react";

import AvartarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import { useUserQuery } from "@/data/user.client";
import { MessageWithSenderDTO } from "@/types/message.type";
import { cn } from "@/utils/shadcn";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  conversationId: string;
  initial: MessageWithSenderDTO[];
};

export default function ConversationBody({ initial, conversationId }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageWithSenderDTO[]>(initial);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          isLast={index === messages.length - 1}
          message={message}
          prevMessage={index > 0 ? messages[index - 1] : undefined}
        />
      ))}
      <div ref={ref} className="pt-24"></div>
    </div>
  );
}

type MessageItemProps = {
  isLast?: boolean;
  message: MessageWithSenderDTO;
  prevMessage?: MessageWithSenderDTO;
};

function MessageItem({ isLast, message, prevMessage }: MessageItemProps) {
  const { data: currentUser } = useUserQuery();
  const isOwn = message.sender.id === currentUser?.id;
  const seenBy = message.seenBy.filter(
    (u) => u.id !== currentUser?.id && u.id !== message.sender.id
  );

  const today = new Date();
  const currentDate = new Date(message.createdAt);
  const prevDate = prevMessage ? new Date(prevMessage.createdAt) : null;

  let showTimestamp = true;
  let formattedDate = "";

  if (prevDate) {
    const sameDay = isSameDay(currentDate, prevDate);
    const diffMinutes = differenceInMinutes(currentDate, prevDate);

    if (sameDay && diffMinutes < 15) {
      showTimestamp = false;
    }
  }

  if (showTimestamp) {
    formattedDate = isSameDay(today, currentDate)
      ? format(currentDate, "p")
      : format(currentDate, "Pp");
  }

  return (
    <div className="py-4">
      {showTimestamp && (
        <div className="text-xs text-center text-muted-foreground">
          {formattedDate}
        </div>
      )}
      <div className={cn("flex gap-3 px-4 py-2", isOwn && "justify-end")}>
        <div className={cn("flex items-end", isOwn && "order-2")}>
          <AvartarWithIndicator
            image={message.sender.image}
            alt={message.sender.name || "Sender avartar"}
          />
        </div>
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
        {seenBy.length > 0 &&
          seenBy.map((sb) => (
            <Tooltip key={sb.id}>
              <TooltipTrigger>
                <AvartarWithIndicator
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
