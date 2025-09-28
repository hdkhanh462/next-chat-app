import { paginationSchema, searchSchema } from "@/schemas/query.schema";
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

export const userParamsSchema = z.object({
  ...searchSchema.shape,
  ...paginationSchema.shape,
});

export type UserParamsInput = z.infer<typeof userParamsSchema>;
