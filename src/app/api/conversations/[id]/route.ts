import { getConversationById } from "@/data/conversation.server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const currentUserId = req.headers.get("X-User-Id") as string;

  const conversation = await getConversationById(currentUserId, id);
  return Response.json(conversation);
}
