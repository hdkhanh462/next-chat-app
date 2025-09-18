import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type Props = {
  title: string;
};

export default function ContactHeader({ title }: Props) {
  return (
    <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-1/2"
      />
      <h1 className="text-lg font-semibold leading-none">{title}</h1>
    </header>
  );
}
