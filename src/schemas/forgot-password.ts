import z from "zod";

import { passwordSchema } from "@/schemas/auth.schema";
import { emailSchema, otpSchema } from "@/schemas/email.schema";

export const resetPasswordFormSchema = z.object({
  newPassword: z.string().min(1, "New password is required"),
  confirmNewPassword: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  ...emailSchema.shape,
  ...otpSchema.shape,
  ...resetPasswordFormSchema.shape,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordFormSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
