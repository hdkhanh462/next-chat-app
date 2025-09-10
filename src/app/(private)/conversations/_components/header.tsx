import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PanelRightIcon } from "lucide-react";
import React from "react";

export default function ConversationHeader() {
  return (
    <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-1/2"
      />
      <div className="flex items-center gap-2">
        <Avatar className="size-12 rounded-lg">
          <AvatarImage
            src="https://via.placeholder.com/150"
            alt="User Avatar"
          />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-semibold leading-none">
            Conversation Title
          </h1>
          <div className="text-sm text-muted-foreground">
            Last message preview or status
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
