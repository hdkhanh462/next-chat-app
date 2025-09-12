"use client";

import { HistoryIcon, TrashIcon, User } from "lucide-react";

import SearchInputKbd from "@/app/(private)/_components/search-input-kbd";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import { useUsersWithFriendShipStatusQuery } from "@/data/user.client";
import { useEffect, useState } from "react";

export default function SearchConversationDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const {
    data: users,
    isLoading,
    setSearch,
  } = useUsersWithFriendShipStatusQuery();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <SearchInputKbd
        onFocus={() => setOpen(true)}
        placeholder="Search conversations by name..."
      />
      <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={false}>
        <SearchInput
          className="border-0 ring-0 focus-visible:ring-0 !bg-transparent outline-hidden shadow-none"
          wraperClassName="border-b"
          placeholder="Search conversations by name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (query.length >= 2) {
                setSearch(query);
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
                    setSearch(item);
                  }}
                >
                  <HistoryIcon />
                  <span>{item}</span>
                  <Button
                    variant="ghost"
                    className="ml-auto !p-1 size-auto text-muted-foreground"
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
            <CommandGroup heading="Search Results">
              <CommandLoading>
                <span className="text-muted-foreground">Loading...</span>
              </CommandLoading>
            </CommandGroup>
          )}
          {users && (
            <CommandGroup heading="Search Results">
              {users.length > 0 ? (
                users.map((user) => (
                  <CommandItem key={user.id}>
                    <div className="flex gap-2 items-center">
                      <User />
                      <span>{user.name}</span>
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
