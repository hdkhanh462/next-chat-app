import z from "zod";

export const createMessageSchema = z.object({
  conversationId: z.string(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be at most 500 characters"),
  images: z.array(z.url()).max(4),
});

export const messageQueryParamsSchema = z.object({
  cursor: z.string().min(2).optional(),
  limit: z.coerce.number().min(5).max(25).default(20),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type MessageOueryParamsInput = z.infer<typeof messageQueryParamsSchema>;
