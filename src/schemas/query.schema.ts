import z from "zod";

export const paginationSchema = z.object({
  limit: z.coerce.number().min(5).max(25).default(20).optional(),
  page: z.coerce.number().positive().optional(),
});

export const cursorPaginationSchema = z.object({
  limit: z.coerce.number().min(5).max(25).default(20).optional(),
  cursor: z.string().optional(),
});

export const searchSchema = z.object({
  keyword: z.string().optional(),
});
