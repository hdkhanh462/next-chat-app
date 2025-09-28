import { NextRequest } from "next/server";

import { getConversations } from "@/data/server/conversation";
import { conversationParamsSchema } from "@/schemas/conversation.schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const parsedParams = conversationParamsSchema.safeParse(
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

  console.log(parsedParams.data);

  const conversations = await getConversations(parsedParams.data);
  return Response.json(conversations);
}
