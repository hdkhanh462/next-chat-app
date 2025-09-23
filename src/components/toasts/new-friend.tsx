import { toast } from "sonner";

import AvatarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import { UserDTO } from "@/types/user.type";

export default function newFriendToast(user: UserDTO) {
  toast(<div className="font-bold">New friend request</div>, {
    description: (
      <div className="flex gap-2 items-center pt-1">
        <AvatarWithIndicator image={user.image} alt={user.name} />
        <div>
          <span className="font-medium">{user.name}</span>
          <span className="line-clamp-1 text-sm w-full whitespace-break-spaces text-muted-foreground">
            Sent you a friend request
          </span>
        </div>
      </div>
    ),
    position: "bottom-left",
  });
}
