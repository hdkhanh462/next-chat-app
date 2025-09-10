import { PropsWithChildren } from "react";

import { SidebarInset } from "@/components/ui/sidebar";
import ContactSidebar from "@/app/(private)/contacts/_components/sidebar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <ContactSidebar />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
