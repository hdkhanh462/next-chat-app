import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins/email-otp";

import { env } from "@/env";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  plugins: [
    nextCookies(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        switch (type) {
          case "sign-in":
            await sendEmail({
              to: email,
              subject: "Sign in to your account",
              text: `Your sign-in code is: ${otp}`,
            });
            break;
          case "email-verification":
            await sendEmail({
              to: email,
              subject: "Verify your email address",
              text: `Your verification code is: ${otp}`,
            });
            break;
          case "forget-password":
            await sendEmail({
              to: email,
              subject: "Reset your password",
              text: `Your password reset code is: ${otp}`,
            });
            break;
        }
      },
    }),
  ],
  advanced: {
    database: {
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});

export type SessionData = typeof auth.$Infer.Session;
export type User = SessionData["user"];
