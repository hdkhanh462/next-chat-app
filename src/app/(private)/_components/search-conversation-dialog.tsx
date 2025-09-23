"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AvatarWithIndicator from "@/app/(private)/_components/avartar-with-indicator";
import SearchInputKbd from "@/app/(private)/_components/search-input-kbd";
import SearchInput from "@/components/search-input";
import {
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import {
  extractConvDetails,
  useUserConvsQuery,
} from "@/data/hooks/conversation";
import { useUserQuery } from "@/data/hooks/user";
import { FullConversationDTO } from "@/types/conversation.type";

export default function SearchConversationDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: currentUser, isFetching: isFetchingUser } = useUserQuery();
  const {
    data: conversations,
    isFetching: isFetchingConvs,
    setFilter,
  } = useUserConvsQuery({
    keyword: "",
  });

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

  if (isFetchingUser)
    return <SearchInputKbd placeholder="Search conversations..." disabled />;

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
                setFilter({ keyword: query });
              }
            }
          }}
        />

        <CommandList className="max-h-72 min-h-20">
          <CommandGroup heading="Search results">
            {!isFetchingConvs && conversations && conversations.length > 0 ? (
              conversations.map((conversation) => (
                <ConversationCommandItem
                  key={conversation.id}
                  conversation={conversation}
                  currentUserId={currentUser?.id || ""}
                  onSelect={() => {
                    setOpen(false);
                    router.push(`/conversations/${conversation.id}`);
                  }}
                />
              ))
            ) : isFetchingConvs ? (
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

type ConversationCommandItemProps = {
  conversation: FullConversationDTO;
  currentUserId: string;
  onSelect: () => void;
};

function ConversationCommandItem({
  conversation,
  currentUserId,
  onSelect,
}: ConversationCommandItemProps) {
  const { displayName, displayImage } = extractConvDetails(
    conversation,
    currentUserId
  );

  return (
    <CommandItem key={conversation.id} onSelect={onSelect}>
      <div className="flex items-center gap-2">
        <AvatarWithIndicator image={displayImage} alt={displayName} />
        <span>{displayName}</span>
      </div>
    </CommandItem>
  );
}
