import ContactHeader from "@/app/(private)/contacts/_components/header";

export default function Page() {
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
