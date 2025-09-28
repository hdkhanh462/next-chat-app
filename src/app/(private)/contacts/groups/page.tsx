import GroupList from "@/app/(private)/contacts/_components/group-list";
import ContactHeader from "@/app/(private)/contacts/_components/header";

export default function Page() {
  return (
    <>
      <ContactHeader title="Groups list" />
      <GroupList />
    </>
  );
}
