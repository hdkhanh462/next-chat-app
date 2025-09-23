import { getUserCached } from "@/data/user";
import { pusher } from "@/lib/pusher/server";

export async function POST(request: Request) {
  const user = await getUserCached();
  const body = await request.formData();

  const socketId = body.get("socket_id") as string;
  const channel = body.get("channel_name") as string;
  const data = {
    user_id: user.id,
  };

  const authResonse = pusher.authorizeChannel(socketId, channel, data);

  return Response.json(authResonse);
}
