import { NextRequest } from "next/server";

import { friendsFilterSchema } from "@/schemas/friend.schema";
import { getFriends } from "@/data/friend";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const parsedParams = friendsFilterSchema.safeParse(
    Object.fromEntries(searchParams.entries())
  );

  if (!parsedParams.success) {
    return Response.json("Invalid query params", { status: 400 });
  }

  const friends = await getFriends(parsedParams.data);
  return Response.json(friends);
}
