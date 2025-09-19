import { getConversations } from "@/data/conversation";
import { conversationFilterSchema } from "@/schemas/conversation.schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  const since = searchParams.get("since");
  const after = searchParams.get("after");

  const parseResult = conversationFilterSchema.safeParse({
    keyword,
    since,
    after,
  });

  if (!parseResult.success) {
    return Response.json(
      {
        error: "Invalid query parameters",
        issues: parseResult.error.issues,
      },
      { status: 400 }
    );
  }

  const convs = await getConversations(parseResult.data);

  return Response.json(convs);
}
