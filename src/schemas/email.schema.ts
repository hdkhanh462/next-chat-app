import { REGEXP_ONLY_DIGITS } from "input-otp";
import z from "zod";

export const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(new RegExp(REGEXP_ONLY_DIGITS), "OTP must be 6 digits"),
});

export const verifyEmailSchema = z.object({
  ...emailSchema.shape,
  ...otpSchema.shape,
});

export type EmailFormInput = z.infer<typeof emailSchema>;
export type OTPFormInput = z.infer<typeof otpSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
