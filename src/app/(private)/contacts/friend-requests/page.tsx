import FriendRequestList from "@/app/(private)/contacts/_components/friend-request-list";
import ContactHeader from "@/app/(private)/contacts/_components/header";

export default function Page() {
  return (
    <>
      <ContactHeader title="Friends requests" />
      <FriendRequestList />
    </>
  );
}
