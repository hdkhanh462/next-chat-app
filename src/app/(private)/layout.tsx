import { PropsWithChildren } from "react";

import { AppSidebar } from "@/components/sidebars/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import PrivateProvider from "@/app/(private)/_components/private-provider";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      {children}
      <PrivateProvider />
    </SidebarProvider>
  );
}
