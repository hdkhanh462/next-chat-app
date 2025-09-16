import ConversationBody from "@/app/(private)/conversations/_components/body";
import ConversationFooter from "@/app/(private)/conversations/_components/footer";
import ConversationHeader from "@/app/(private)/conversations/_components/header";
import {
  getConversationById,
  getConversationMessages,
} from "@/data/conversation";
import { getUserCached } from "@/data/user";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id: convId } = await params;
  const user = await getUserCached();
  const conv = await getConversationById(user.id, convId);
  const messages = await getConversationMessages(user.id, convId, null);

  if (!conv) return <div>Conversation not found</div>;

  return (
    <div className="flex flex-col flex-1 overflow-hidden max-h-dvh">
      <ConversationHeader initial={conv} />
      <ConversationBody initial={messages} conversationId={convId} />
      <ConversationFooter conversationId={convId} />
    </div>
  );
}
