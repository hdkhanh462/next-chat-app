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

export const friendsFilterSchema = z.object({
  keyword: z.string().min(2).optional().nullable(),
  limit: z.coerce.number().min(5).max(25).default(20),
  cursor: z.string().min(2).optional(),
});

export type FriendFilterInput = z.infer<typeof friendsFilterSchema>;
