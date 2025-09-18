import z from "zod";

export const createConversationSchema = z.object({
  to: z
    .array(z.string())
    .min(1, "Select at least one user")
    .max(100, "You can select up to 5 users"),
});

export const conversationFilterSchema = z.object({
  keyword: z.string().min(2).optional().nullable(),
  since: z.coerce.date().optional().nullable(),
  after: z.coerce.date().optional().nullable(),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type ConversationFilterInput = z.infer<typeof conversationFilterSchema>;
