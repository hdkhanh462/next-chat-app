import { getOlderMessages } from "@/data/conversation.server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor"); // id of the lastest message from current loaded messages
  const currentUserId = req.headers.get("X-User-Id") as string;

  const messages = await getOlderMessages(currentUserId, id, cursor);
  return Response.json(messages);
}
