import { searchFriends } from "@/data/user.server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  const currentUserId = req.headers.get("X-User-Id") as string;

  if (!keyword) {
    return Response.json([]);
  }

  const users = await searchFriends(currentUserId, keyword);
  return Response.json(users);
}
