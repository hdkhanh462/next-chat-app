import {
  LucideIcon,
  MessageSquareIcon,
  MessagesSquareIcon,
  UserPlusIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { IconType } from "react-icons/lib";
import { TbUsers, TbUsersPlus } from "react-icons/tb";

type Routes = {
  title: string;
  url: string;
  icon: LucideIcon | IconType;
  isActive: boolean;
};

export function useRoutes(): Routes[] {
  const pathname = usePathname();

  return useMemo(() => {
    return [
      {
        title: "Conversations",
        url: "/conversations",
        icon: MessageSquareIcon,
        isActive: pathname.startsWith("/conversations"),
      },
      {
        title: "Contacts",
        url: "/contacts",
        icon: TbUsers,
        isActive: pathname.startsWith("/contacts"),
      },
    ];
  }, [pathname]);
}

export function useContactRoutes(): Routes[] {
  const pathname = usePathname();

  return useMemo(() => {
    return [
      {
        title: "Friends list",
        url: "/contacts",
        icon: TbUsers,
        isActive: pathname.endsWith("/contacts"),
      },
      {
        title: "Groups list",
        url: "/contacts/groups",
        icon: MessagesSquareIcon,
        isActive: pathname.endsWith("/contacts/groups"),
      },
      {
        title: "Friend invitations",
        url: "/contacts/friend-invitations",
        icon: UserPlusIcon,
        isActive: pathname.endsWith("/contacts/friend-invitations"),
      },
      {
        title: "Group invitations",
        url: "/contacts/group-invitations",
        icon: TbUsersPlus,
        isActive: pathname.endsWith("/contacts/group-invitations"),
      },
    ];
  }, [pathname]);
}
