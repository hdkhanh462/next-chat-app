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
                  <div className="flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-sm leading-tight text-left">
                    <span className="font-medium truncate">Acme Inc</span>
                    <span className="text-xs truncate">Enterprise</span>
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
