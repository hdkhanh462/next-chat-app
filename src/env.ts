import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    REDIS_URL: z.url(),
    BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
    BETTER_AUTH_SECRET: z.string().nonempty(),
    GITHUB_CLIENT_ID: z.string().nonempty(),
    GITHUB_CLIENT_SECRET: z.string().nonempty(),
    GOOGLE_CLIENT_ID: z.string().nonempty(),
    GOOGLE_CLIENT_SECRET: z.string().nonempty(),
    GOOGLE_EMAIL_SENDER: z.email().nonempty(),
    GOOGLE_EMAIL_SENDER_PASSWORD: z.string().nonempty(),
    PUSHER_APP_ID: z.string().nonempty(),
    PUSHER_SECRET: z.string().nonempty(),
  },
  client: {
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string().nonempty(),
    NEXT_PUBLIC_PUSHER_KEY: z.string().nonempty(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
  },
});
