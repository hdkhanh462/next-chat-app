import { toast } from "sonner";

import AvatarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import { MessageWithSenderDTO } from "@/types/message.type";

export default function newMessageToast(msg: MessageWithSenderDTO) {
  // TODO: show conversation name instead of sender name
  toast(<div className="font-bold">{msg.sender.name}</div>, {
    description: (
      <div className="flex gap-2 items-center pt-1">
        <AvatarWithIndicator image={msg.sender.image} alt={msg.sender.name} />
        <div>
          <span className="font-medium">{msg.sender.name}</span>
          <span className="line-clamp-1 text-sm w-full whitespace-break-spaces text-muted-foreground">
            {msg.content}
          </span>
        </div>
      </div>
    ),
    position: "bottom-left",
  });
}
