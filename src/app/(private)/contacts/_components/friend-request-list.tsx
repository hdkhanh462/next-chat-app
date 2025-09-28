"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import AvatarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import FriendActionButton from "@/app/(private)/_components/friend-action-button";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/data/queries/keys";
import { useUsersQuery } from "@/data/queries/user";
import { UserWithFriendShipStatus } from "@/types/user.type";

export default function FriendRequestList() {
  const { data: users, isPending } = useUsersQuery();
  const queryClient = useQueryClient();

  if (isPending)
    return (
      <div className="p-4 gap-4 flex flex-col">
        {Array.from({ length: 5 }).map((_, index) => (
          <FriendRequestItemSkeleton key={index} />
        ))}
      </div>
    );

  if (!users) return <FriendRequestListFallback />;

  return (
    <div className="p-4 gap-4 flex flex-col">
      {users.map((friend) => (
        <FriendRequestItem
          key={friend.id}
          user={friend}
          onActionSuccess={(message) => {
            toast.success(message);
            // TODO: using optimistic update
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.USERS.all(),
            });
          }}
          onActionError={(messages) => {
            if (messages) toast.error(messages[0]);
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.USERS.all(),
            });
          }}
        />
      ))}
    </div>
  );
}

type FriendRequestItemProps = {
  user: UserWithFriendShipStatus;
  onActionSuccess?: (message: string) => void;
  onActionError?: (messages?: string[] | undefined) => void;
};

function FriendRequestItem({
  user,
  onActionSuccess,
  onActionError,
}: FriendRequestItemProps) {
  return (
    <div className="flex items-center rounded-md p-4 bg-primary-foreground">
      <div className="flex gap-2 items-center">
        <AvatarWithIndicator
          image={user.image}
          alt={user.name}
          className="size-10"
        />
        <span>{user.name}</span>
      </div>
      <div className="flex gap-2 items-center ml-auto">
        <FriendActionButton
          targetUserId={user.id}
          friendShip={user.friendShip}
          onActionSuccess={onActionSuccess}
          onActionError={onActionError}
        />
      </div>
    </div>
  );
}

function FriendRequestItemSkeleton() {
  return (
    <div className="flex items-center rounded-md p-4 bg-primary-foreground">
      <div className="flex gap-2 items-center">
        <Skeleton className="size-10 rounded-full aspect-square" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}

function FriendRequestListFallback() {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="text-muted-foreground text-lg font-medium">
        No requests found.
      </div>
    </div>
  );
}
