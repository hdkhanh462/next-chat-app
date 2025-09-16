import { PropsWithChildren } from "react";

import Header from "@/app/(public)/_components/header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
