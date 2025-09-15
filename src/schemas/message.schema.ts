import z from "zod";

export const createMessageSchema = z.object({
  conversationId: z.string(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be at most 500 characters"),
  images: z.array(z.url()),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
