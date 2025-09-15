"use client";

import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SearchInputKbd from "@/app/(private)/_components/search-input-kbd";
import SearchInput from "@/components/search-input";
import {
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import { useSeachUserConversationsQuery } from "@/data/conversation.client";

export default function SearchConversationDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const {
    data: conversations,
    isLoading,
    setKeyword,
  } = useSeachUserConversationsQuery("");

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
        placeholder="Search conversations..."
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
                setKeyword(query);
              }
            }
          }}
        />

        <CommandList className="max-h-72 min-h-20">
          <CommandGroup heading="Search results">
            {!isLoading && conversations && conversations.length > 0 ? (
              conversations.map((conversation) => (
                <CommandItem
                  key={conversation.id}
                  onSelect={() => {
                    setOpen(false);
                    router.push(`/conversations/${conversation.id}`);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <User />
                    <span>{conversation.name}</span>
                  </div>
                </CommandItem>
              ))
            ) : isLoading ? (
              <CommandLoading>
                <span className="text-muted-foreground">Loading...</span>
              </CommandLoading>
            ) : (
              <CommandItem disabled className="justify-center">
                <span>No conversations found</span>
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
