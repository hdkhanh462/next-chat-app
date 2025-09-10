import ContactHeader from "@/app/(private)/contacts/_components/header";

type Group = {
  id: string;
  name: string;
  members: string[];
};

export default function Page() {
  const groups: Group[] = [];
  return (
    <>
      <ContactHeader title="Groups list" />
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="text-muted-foreground text-lg font-medium">
          No groups found.
        </div>
      </div>
    </>
  );
}
