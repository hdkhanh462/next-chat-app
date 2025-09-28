"use client";

import AvatarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import { Skeleton } from "@/components/ui/skeleton";
import { useFriendsQuery } from "@/data/queries/friend";
import { UserDTO } from "@/types/user.type";

export default function FriendList() {
  const { data: friends, isPending } = useFriendsQuery();

  if (isPending)
    return (
      <div className="p-4 gap-4 flex flex-col">
        {Array.from({ length: 5 }).map((_, index) => (
          <FriendItemSkeleton key={index} />
        ))}
      </div>
    );

  if (!friends) return <FriendListFallback />;

  return (
    <div className="p-4 gap-4 flex flex-col">
      {friends.map((friend) => (
        <FriendItem key={friend.id} friend={friend} />
      ))}
    </div>
  );
}

type FriendItemProps = {
  friend: UserDTO;
};

function FriendItem({ friend }: FriendItemProps) {
  return (
    <div className="flex items-center rounded-md p-4 bg-primary-foreground">
      <div className="flex gap-2 items-center">
        <AvatarWithIndicator
          image={friend.image}
          alt={friend.name}
          className="size-10"
        />
        <span>{friend.name}</span>
      </div>
    </div>
  );
}

function FriendItemSkeleton() {
  return (
    <div className="flex items-center rounded-md p-4 bg-primary-foreground">
      <div className="flex gap-2 items-center">
        <Skeleton className="size-10 rounded-full aspect-square" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}

function FriendListFallback() {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="text-muted-foreground text-lg font-medium">
        No friends found.
      </div>
    </div>
  );
}
