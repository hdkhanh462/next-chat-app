import ContactHeader from "@/app/(private)/contacts/_components/header";

type GroupInvitation = {
  id: string;
  name: string;
  email: string;
  date: string;
};

export default function Page() {
  const invitations: GroupInvitation[] = [];
  return (
    <>
      <ContactHeader title="Group Invitations" />
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="text-muted-foreground text-lg font-medium">
          No group invitations found.
        </div>
      </div>
    </>
  );
}
