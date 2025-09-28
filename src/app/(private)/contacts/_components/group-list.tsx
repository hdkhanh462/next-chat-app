"use client";

import AvatarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversationsQuery } from "@/data/queries/conversation";
import { FullConversationDTO } from "@/types/conversation.type";

export default function GroupList() {
  const { data: convs, isPending } = useConversationsQuery({ isGroup: true });

  if (isPending)
    return (
      <div className="p-4 gap-4 flex flex-col">
        {Array.from({ length: 5 }).map((_, index) => (
          <GroupItemSkeleton key={index} />
        ))}
      </div>
    );

  if (!convs) return <GroupListFallback />;

  return (
    <div className="p-4 gap-4 flex flex-col">
      {convs.map((friend) => (
        <GroupItem key={friend.id} group={friend} />
      ))}
    </div>
  );
}

type GroupItemProps = {
  group: FullConversationDTO;
};

function GroupItem({ group }: GroupItemProps) {
  return (
    <div className="flex items-center rounded-md p-4 bg-primary-foreground">
      <div className="flex gap-2 items-center">
        <AvatarWithIndicator
          image={group.image}
          alt={group.name}
          className="size-10"
        />
        <span>{group.name}</span>
      </div>
    </div>
  );
}

function GroupItemSkeleton() {
  return (
    <div className="flex items-center rounded-md p-4 bg-primary-foreground">
      <div className="flex gap-2 items-center">
        <Skeleton className="size-10 rounded-full aspect-square" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}

function GroupListFallback() {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="text-muted-foreground text-lg font-medium">
        No groups found.
      </div>
    </div>
  );
}
