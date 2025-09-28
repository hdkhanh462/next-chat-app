import { notFound } from "next/navigation";

import ConversationBody from "@/app/(private)/conversations/_components/body";
import ConversationFooter from "@/app/(private)/conversations/_components/footer";
import ConversationHeader from "@/app/(private)/conversations/_components/header";
import { getConversationById } from "@/data/server/conversation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id: convId } = await params;
  const conv = await getConversationById(convId);

  if (!conv) notFound();

  return (
    <div className="flex flex-col flex-1 overflow-hidden max-h-dvh">
      <ConversationHeader initial={conv} />
      <ConversationBody conversationId={conv.id} />
      <ConversationFooter conversationId={conv.id} />
    </div>
  );
}
