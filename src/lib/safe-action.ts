import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";

export const actionClient = createSafeActionClient();

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw Error("Unauthorized");
  }

  return next({ ctx: { currentUserId: session.user.id } });
});
