"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserDropdownContent from "@/components/user-dropdown-content";
import { useUser } from "@/data/user";
import { getFirstLetters } from "@/utils/string";

export default function UserMenu() {
  const { data: user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full h-auto p-0 hover:bg-transparent"
        >
          <Avatar>
            <AvatarImage src={user?.image || ""} alt="Profile image" />
            <AvatarFallback>
              {getFirstLetters(user?.name) || "N/A"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <UserDropdownContent user={user} />
    </DropdownMenu>
  );
}
