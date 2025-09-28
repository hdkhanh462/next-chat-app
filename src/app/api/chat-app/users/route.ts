import { NextRequest } from "next/server";

import { getUsers } from "@/data/server/user";
import { userParamsSchema } from "@/schemas/user.schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const parsedParams = userParamsSchema.safeParse(
    Object.fromEntries(searchParams.entries())
  );

  if (!parsedParams.success) {
    return Response.json("Invalid query params", { status: 400 });
  }

  const users = await getUsers(parsedParams.data);
  return Response.json(users);
}
