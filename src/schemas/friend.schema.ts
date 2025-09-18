import z from "zod";

export const friendSchema = z.object({
  requestId: z.string(),
});

export const sendFriendRequestSchema = z.object({
  addresseeId: z.string(),
});

export const unfriendSchema = z.object({
  friendId: z.string(),
});
