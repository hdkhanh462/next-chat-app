import { MessageSquarePlusIcon } from "lucide-react";
import { TbUsersPlus } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SidebarActions() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">New conversation</span>
            <MessageSquarePlusIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>New conversation</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">New group</span>
            <TbUsersPlus />
          </Button>
        </TooltipTrigger>
        <TooltipContent>New group</TooltipContent>
      </Tooltip>
    </div>
  );
}
