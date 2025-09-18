import { PropsWithChildren } from "react";

import ConversationSidebar from "@/app/(private)/conversations/_components/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <ConversationSidebar />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
