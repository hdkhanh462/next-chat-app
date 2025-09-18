import ContactHeader from "@/app/(private)/contacts/_components/header";

type FriendInvitation = {
  id: string;
  name: string;
  email: string;
  date: string;
};

export default function Page() {
  const invitations: FriendInvitation[] = [];
  return (
    <>
      <ContactHeader title="Friend Invitations" />
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="text-muted-foreground text-lg font-medium">
          No friend invitations found.
        </div>
      </div>
    </>
  );
}
