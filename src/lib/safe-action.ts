import { createSafeActionClient } from "next-safe-action";

import { getUserCached } from "@/data/user";

export const actionClient = createSafeActionClient();

export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await getUserCached();

  return next({ ctx: { currentUserId: user.id } });
});
