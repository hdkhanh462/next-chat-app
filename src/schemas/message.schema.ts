import { cursorPaginationSchema } from "@/schemas/query.schema";
import z from "zod";

export const createMessageSchema = z.object({
  conversationId: z.string(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be at most 500 characters"),
  images: z.array(z.url()).max(4),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type MessageParamsInput = z.infer<typeof cursorPaginationSchema>;
