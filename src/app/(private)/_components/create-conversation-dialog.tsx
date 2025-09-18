"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckIcon,
  Loader2,
  MessageSquarePlusIcon,
  User,
  XIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createConversationAction } from "@/actions/conversation.action";
import SearchInput from "@/components/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchUserFriendsQuery } from "@/data/hooks/user";
import {
  CreateConversationInput,
  createConversationSchema,
} from "@/schemas/conversation.schema";
import { find } from "lodash";

type SelectedUser = {
  id: string;
  name: string;
};

export default function SearchFriendDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const { data: friends, isLoading, setKeyword } = useSearchUserFriendsQuery();
  const queryClient = useQueryClient();
  const { execute: createConversation, isExecuting: conversationCreating } =
    useAction(createConversationAction, {
      onSuccess({ data }) {
        setOpen(false);
        setSelectedUsers([]);
        setQuery("");
        form.reset();
        toast.success(data.message);
      },
      onError({ error }) {
        if (error.validationErrors?._errors)
          toast.error(error.validationErrors?._errors[0]);
      },
    });

  const form = useForm<CreateConversationInput>({
    resolver: zodResolver(createConversationSchema),
    defaultValues: {
      to: [],
    },
  });

  function onSubmit(values: CreateConversationInput) {
    createConversation(values);
  }

  const handleSelectUser = (user: SelectedUser) => {
    const isSelected = find(selectedUsers, { id: user.id });
    if (isSelected) {
      // Deselect user
      setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
      form.setValue(
        "to",
        form.getValues("to").filter((id) => id !== user.id),
        { shouldDirty: true }
      );
    } else if (selectedUsers.length < 5) {
      // Select user
      setSelectedUsers((prev) => [...prev, user]);
      form.setValue("to", [...form.getValues("to"), user.id], {
        shouldDirty: true,
      });
    } else {
      toast.error("You can select up to 5 users");
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <span className="sr-only">New conversation</span>
            <MessageSquarePlusIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>New conversation</TooltipContent>
      </Tooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-4" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Create a new conversation</DialogTitle>
            <DialogDescription>
              Search for users to start a conversation with
            </DialogDescription>
          </DialogHeader>
          <Command className="bg-transparent p-1 [&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <SearchInput
              className="ps-11"
              placeholder="Search for users to start a conversation..."
              value={query}
              startIcon={<span>To:</span>}
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
              <CommandGroup heading="Selected friends" className="!px-0">
                {selectedUsers.length > 0 ? (
                  <CommandItem className="!bg-transparent ">
                    {selectedUsers.map((item) => (
                      <Badge
                        key={item.id}
                        variant="outline"
                        className="group flex items-center gap-1"
                        onClick={() => handleSelectUser(item)}
                      >
                        {item.name}
                        <XIcon className="!size-4 text-muted-foreground group-hover:text-destructive" />
                      </Badge>
                    ))}
                  </CommandItem>
                ) : (
                  <CommandItem disabled className="justify-center min-h-[46px]">
                    <span>No users selected</span>
                  </CommandItem>
                )}
              </CommandGroup>
              {isLoading && (
                <CommandGroup heading="Search results" className="!px-0">
                  <CommandLoading>
                    <span className="text-muted-foreground">Loading...</span>
                  </CommandLoading>
                </CommandGroup>
              )}
              {friends && (
                <CommandGroup heading="Search results" className="!px-0">
                  {friends.length > 0 ? (
                    friends.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => handleSelectUser(user)}
                      >
                        <div className="flex gap-2 items-center">
                          <User />
                          <span>{user.name}</span>
                        </div>
                        <div className="flex gap-2 items-center ml-auto">
                          {find(selectedUsers, { id: user.id }) && (
                            <CheckIcon className="text-primary" />
                          )}
                        </div>
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled className="justify-center">
                      <span>No friends found</span>
                    </CommandItem>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
          <DialogFooter>
            <Button
              disabled={!form.formState.isDirty || conversationCreating}
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {conversationCreating && <Loader2 className="animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
