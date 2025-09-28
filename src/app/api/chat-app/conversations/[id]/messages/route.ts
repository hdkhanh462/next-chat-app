import { NextRequest } from "next/server";

import { getMessages } from "@/data/server/message";
import { cursorPaginationSchema } from "@/schemas/query.schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = req.nextUrl.searchParams;
  const parsedParams = cursorPaginationSchema.safeParse(
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

  const messages = await getMessages(id, parsedParams.data);
  return Response.json(messages);
}
