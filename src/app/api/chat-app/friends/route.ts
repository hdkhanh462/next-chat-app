import { NextRequest } from "next/server";

import { userParamsSchema } from "@/schemas/user.schema";
import { getFriends } from "@/data/server/friend";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const parsedParams = userParamsSchema.safeParse(
    Object.fromEntries(searchParams.entries())
  );

  if (!parsedParams.success) {
    return Response.json("Invalid query params", { status: 400 });
  }

  const friends = await getFriends(parsedParams.data);
  return Response.json(friends);
}
