import { getConversations } from "@/data/conversation.server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  const currentUserId = req.headers.get("X-User-Id") as string;

  const users = await getConversations(currentUserId, keyword);
  return Response.json(users);
}
