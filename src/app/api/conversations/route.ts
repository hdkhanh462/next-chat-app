import { searchUserConversations } from "@/data/conversation.server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  const currentUserId = req.headers.get("X-User-Id") as string;

  const users = await searchUserConversations(currentUserId, keyword);
  return Response.json(users);
}
