import { paginationSchema, searchSchema } from "@/schemas/query.schema";
import z from "zod";

export const createConversationSchema = z.object({
  to: z
    .array(z.string())
    .min(1, "Select at least one user")
    .max(100, "You can select up to 5 users"),
});

export const conversationFilterSchema = z.object({
  ...searchSchema.shape,
  ...paginationSchema.shape,
  since: z.coerce.date().optional(),
  after: z.coerce.date().optional(),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type ConversationFilterInput = z.infer<typeof conversationFilterSchema>;
