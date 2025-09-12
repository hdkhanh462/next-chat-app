"use client";

import Link from "next/link";

import PageSidebarHeader from "@/app/(private)/_components/page-sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useContactRoutes } from "@/hooks/use-routes";
import { cn } from "@/utils/shadcn";

export default function ContactSidebar() {
  const routes = useContactRoutes();

  return (
    <Sidebar collapsible="offcanvas">
      <PageSidebarHeader title="Contacts" />
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
