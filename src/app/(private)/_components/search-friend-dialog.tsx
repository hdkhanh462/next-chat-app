"use client";

import { useQueryClient } from "@tanstack/react-query";
import { HistoryIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { TbUsersPlus } from "react-icons/tb";
import { toast } from "sonner";

import AvatarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QUERY_KEYS } from "@/data/queries/keys";
import { useUsersQuery } from "@/data/queries/user";
import FriendActionButton from "@/app/(private)/_components/friend-action-button";

export default function SearchFriendDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const { data: users, isLoading, setParams } = useUsersQuery({ keyword: "" });
  const queryClient = useQueryClient();

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="hover:cursor-pointer"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">New friend</span>
            <TbUsersPlus />
          </Button>
        </TooltipTrigger>
        <TooltipContent>New friend</TooltipContent>
      </Tooltip>
      <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={false}>
        <SearchInput
          className="border-0 ring-0 focus-visible:ring-0 !bg-transparent outline-hidden shadow-none"
          wraperClassName="border-b"
          placeholder="Search for users by name or email..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (query.length >= 2) {
                setParams((prev) => ({ ...prev, keyword: query }));
                setHistory((prev) =>
                  [query, ...prev.filter((ph) => ph !== query)].slice(0, 3)
                );
              }
            }
          }}
        />

        <CommandList className="max-h-72 min-h-20">
          <CommandGroup heading="Search history">
            {history.length > 0 ? (
              history.map((item) => (
                <CommandItem
                  key={item}
                  onSelect={() => {
                    setQuery(item);
                    setParams((prev) => ({ ...prev, keyword: item }));
                  }}
                >
                  <HistoryIcon />
                  <span>{item}</span>
                  <Button
                    variant="outline"
                    className="ml-auto !p-1 size-auto hover:cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHistory((prev) => prev.filter((ph) => ph !== item));
                    }}
                  >
                    <TrashIcon className="text-inherit" />
                    <span className="sr-only">Delete history</span>
                  </Button>
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled className="justify-center">
                <span>No history</span>
              </CommandItem>
            )}
          </CommandGroup>
          {isLoading && (
            <CommandGroup heading="Search results">
              <CommandLoading>
                <span className="text-muted-foreground">Loading...</span>
              </CommandLoading>
            </CommandGroup>
          )}
          {users && (
            <CommandGroup heading="Search results">
              {users.length > 0 ? (
                users.map((user) => (
                  <CommandItem key={user.id}>
                    <div className="flex gap-2 items-center">
                      <AvatarWithIndicator image={user.image} alt={user.name} />
                      <span>{user.name}</span>
                    </div>
                    <div className="flex gap-2 items-center ml-auto">
                      <FriendActionButton
                        targetUserId={user.id}
                        friendShip={user.friendShip}
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
                    </div>
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled className="justify-center">
                  <span>No users found</span>
                </CommandItem>
              )}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
