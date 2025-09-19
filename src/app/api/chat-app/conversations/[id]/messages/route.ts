import { NextRequest } from "next/server";

import { getMessagesNew } from "@/data/message";
import { messageQueryParamsSchema } from "@/schemas/message.schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = req.nextUrl.searchParams;
  const parsedParams = messageQueryParamsSchema.safeParse(
    Object.fromEntries(searchParams.entries())
  );

  if (!parsedParams.success)
    return Response.json("Invalid query params", { status: 400 });

  const result = await getMessagesNew(id, parsedParams.data);
  return Response.json(result);
}
