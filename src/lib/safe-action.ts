import { pick } from "lodash";
import { createSafeActionClient } from "next-safe-action";

import { getUserCached } from "@/data/server/user";

export const actionClient = createSafeActionClient();

export const authActionClient = actionClient.use(async ({ next }) => {
  const currentUser = await getUserCached();

  return next({
    ctx: {
      currentUser: pick(currentUser, ["id", "name", "image"]),
    },
  });
});
