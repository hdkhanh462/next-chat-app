import { useQueryClient } from "@tanstack/react-query";
import { Bell, ChartColumn, LogOut, Settings, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ACCOUNT_PATH, AUTH_PATH } from "@/constants/routes";
import { authClient, User } from "@/lib/auth/client";

type UserDropdownContentProps = React.ComponentProps<
  typeof DropdownMenuContent
> & {
  user: User;
};

export default function UserDropdownContent({
  user,
  side,
}: UserDropdownContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="end"
      sideOffset={4}
      side={side}
    >
      <DropdownMenuLabel className="p-0">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar>
            <AvatarImage src={user.image || ""} alt="User avatar" />
            <AvatarFallback>
              <UserIcon className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-sm leading-tight text-left">
            <span className="font-medium truncate">{user.name}</span>
            <span className="text-xs truncate text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href={ACCOUNT_PATH.DASHBOARD}>
            <ChartColumn />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ACCOUNT_PATH.PROFILE}>
            <UserIcon />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ACCOUNT_PATH.NOTIFICATIONS}>
            <Bell />
            Notifications
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ACCOUNT_PATH.SETTINGS.GENERAL}>
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                queryClient.clear();
                router.push(AUTH_PATH.LOGIN);
              },
            },
          });
        }}
      >
        <LogOut />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
