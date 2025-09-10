"use client";

import { Command } from "lucide-react";
import Link from "next/link";

import { NavUser } from "@/components/sidebars/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRoutes } from "@/hooks/use-routes";

export function AppSidebar() {
  const routes = useRoutes();
  return (
    <>
      <div className="w-[calc(var(--sidebar-width-icon)+1px+(--spacing(4))+2px))] md:w-[calc(var(--sidebar-width-icon)+1px)]" />
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px+(--spacing(4))+2px))]! md:w-[calc(var(--sidebar-width-icon)+1px)]! border-r h-svh fixed"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {routes.map((route) => (
                  <SidebarMenuItem key={route.title}>
                    <SidebarMenuButton
                      className="px-2.5 md:px-2"
                      asChild
                      isActive={route.isActive}
                      tooltip={{
                        children: route.title,
                        hidden: false,
                      }}
                    >
                      <Link href={route.url}>
                        <route.icon />
                        <span>{route.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
