import AvartarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import OnlineIndicator from "@/app/(private)/_components/online-indicator";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ConversationDTO } from "@/types/conversation.type";
import { PanelRightIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  initial: ConversationDTO;
};

export default function ConversationHeader({ initial }: Props) {
  const [onlineMembers, setOnlineMembers] = useState(1);

  return (
    <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-1/2"
      />
      <div className="flex items-center gap-2">
        <AvartarWithIndicator
          className="size-12"
          image={initial.image}
          alt={initial.name}
        />
        <div>
          <h1 className="text-lg font-semibold leading-none">{initial.name}</h1>
          <div className="flex gap-1 items-center text-sm text-muted-foreground">
            <OnlineIndicator online={onlineMembers > 0} />
            <span>{onlineMembers.toString().padStart(2, "0")} online</span>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="ml-auto size-7">
        <PanelRightIcon />
        <span className="sr-only">Conversation info</span>
      </Button>
    </header>
  );
}
