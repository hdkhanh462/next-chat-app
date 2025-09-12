"use client";

import { UserIcon } from "lucide-react";

import PageSidebarHeader from "@/app/(private)/_components/page-sidebar-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import Link from "next/link";

type Conversation = {
  id: string;
  name: string;
  date: string;
  teaser: string;
  image?: string;
  isActive?: boolean;
};

export default function ConversationSidebar() {
  const conversations: Conversation[] = [
    {
      id: "1asdcw",
      name: "John Doe",
      date: "2h ago",
      teaser: "Hey, how are you doing?",
    },
    {
      id: "asdawe",
      name: "Jane Smith",
      date: "1d ago",
      teaser: "Don't forget our meeting tomorrow.",
    },
  ];

  return (
    <Sidebar collapsible="offcanvas">
      <PageSidebarHeader title="Conversations" />
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            {conversations.map((conversation) => (
              <Link
                href={`/conversations/${conversation.id}`}
                key={conversation.id}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
              >
                <Avatar className="size-10">
                  <AvatarImage
                    src={conversation?.image || ""}
                    alt="Conversation image"
                  />
                  <AvatarFallback>
                    <UserIcon className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <div className="flex w-full items-center gap-2">
                    <span>{conversation.name}</span>{" "}
                    <span className="ml-auto text-xs">{conversation.date}</span>
                  </div>
                  <span className="line-clamp-1 w-[260px] text-xs whitespace-break-spaces">
                    {conversation.teaser}
                  </span>
                </div>
              </Link>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
