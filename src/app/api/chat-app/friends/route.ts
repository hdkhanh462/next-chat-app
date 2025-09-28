import { NextRequest } from "next/server";

import { getFriends } from "@/data/server/friend";
import { userParamsSchema } from "@/schemas/user.schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const parsedParams = userParamsSchema.safeParse(
    Object.fromEntries(searchParams.entries())
  );

  if (!parsedParams.success) {
    return Response.json(
      {
        error: "Invalid query params",
        issues: parsedParams.error.issues,
      },
      { status: 400 }
    );
  }

  const friends = await getFriends(parsedParams.data);
  return Response.json(friends);
}
