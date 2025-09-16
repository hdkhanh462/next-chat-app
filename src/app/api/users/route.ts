import { searchUsers } from "@/data/user";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");

  if (!keyword) {
    return Response.json([]);
  }

  const users = await searchUsers(keyword);
  return Response.json(users);
}
