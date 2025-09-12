import z from "zod";

export const createConversationSchema = z.object({
  to: z.array(z.string()).min(1, "Select at least one user"),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
