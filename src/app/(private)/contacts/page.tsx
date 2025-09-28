import FriendList from "@/app/(private)/contacts/_components/friend-list";
import ContactHeader from "@/app/(private)/contacts/_components/header";

export default function Page() {
  return (
    <>
      <ContactHeader title="Friends list" />
      <FriendList />
    </>
  );
}
