import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    REDIS_URL: z.url(),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_EMAIL_SENDER: z.email(),
    GOOGLE_EMAIL_SENDER_PASSWORD: z.string().min(1),
    PUSHER_APP_ID: z.string().min(1),
    PUSHER_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string().min(1),
    NEXT_PUBLIC_PUSHER_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
  },
});
