"use client";

import { UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import UserDropdownContent from "@/components/user-dropdown-content";
import { useUserQuery } from "@/data/queries/user";

export default function UserMenu() {
  const { data: user, isLoading } = useUserQuery();

  if (isLoading) return <Skeleton className="size-8 rounded-full" />;

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full p-0 hover:bg-transparent"
        >
          <Avatar>
            <AvatarImage src={user.image || ""} alt="Profile image" />
            <AvatarFallback>
              <UserIcon className="size-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <UserDropdownContent user={user} />
    </DropdownMenu>
  );
}
