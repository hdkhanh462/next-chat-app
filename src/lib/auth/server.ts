import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

import { prisma } from "@/lib/prisma";
import { accessControl, adminRole, userRole } from "@/lib/auth/permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    nextCookies(),
    admin({
      ac: accessControl,
      roles: {
        admin: adminRole,
        user: userRole,
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
});

export type SessionData = typeof auth.$Infer.Session;
export type User = SessionData["user"];
