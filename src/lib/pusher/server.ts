import PusherServer from "pusher";

import { env } from "@/env";

declare global {
  var pusherServerInstance: PusherServer | undefined;
}

if (!global.pusherServerInstance) {
  global.pusherServerInstance = new PusherServer({
    appId: env.PUSHER_APP_ID,
    key: env.NEXT_PUBLIC_PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true,
  });
}

export const pusher = global.pusherServerInstance;
