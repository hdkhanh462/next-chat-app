import { getConversations } from "@/data/conversation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  const users = await getConversations(keyword);

  return Response.json(users);
}
