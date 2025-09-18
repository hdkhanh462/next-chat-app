import ContactHeader from "@/app/(private)/contacts/_components/header";

type Friend = {
  id: string;
  name: string;
  email: string;
};

export default function Page() {
  const friends: Friend[] = [];
  return (
    <>
      <ContactHeader title="Friends list" />
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="text-muted-foreground text-lg font-medium">
          No friends found.
        </div>
      </div>
    </>
  );
}
