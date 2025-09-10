"use client";

import Link from "next/link";

import SidebarActions from "@/app/(private)/_components/sidebar-actions";
import SearchForm from "@/components/forms/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useContactRoutes } from "@/hooks/use-routes";
import { cn } from "@/utils/shadcn";

export default function ContactSidebar() {
  const routes = useContactRoutes();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-foreground text-base font-medium">Contacts</div>
          <SidebarActions />
        </div>
        <SearchForm onSearch={(value) => console.log(value)} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            {routes.map((route) => (
              <Link
                href={route.url}
                key={route.title}
                className={cn(
                  "hover:bg-sidebar-accent border-b hover:text-sidebar-accent-foreground flex items-start gap-2 p-4 text-sm leading-tight whitespace-nowrap last:border-b-0",
                  route.isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <route.icon className="size-4" />
                <div className="w-full">
                  <div className="font-medium">{route.title}</div>
                </div>
              </Link>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
