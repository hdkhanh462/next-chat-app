"use client";

import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  MultipleStepForm,
  StepConfig,
} from "@/components/ui/multiple-step-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import z from "zod";

const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(new RegExp(REGEXP_ONLY_DIGITS), "OTP must be 6 digits"),
});

const schema = z.object({
  ...emailSchema.shape,
  ...otpSchema.shape,
});

type EmailFormInput = z.infer<typeof emailSchema>;
type OTPFormInput = z.infer<typeof otpSchema>;

export default function EmailVerificationForm() {
  const emailStep: StepConfig<EmailFormInput> = {
    title: "Verify Email",
    description: "Enter your email to receive the OTP",
    schema: emailSchema,
    fields: [
      {
        key: "email",
        label: "Email",
        description: "Please enter your email address to receive the OTP",
        render({ field }) {
          return (
            <FormControl>
              <Input placeholder="example@email.com" {...field} />
            </FormControl>
          );
        },
      },
    ],
  };

  const otpStep: StepConfig<OTPFormInput> = {
    title: "Verify OTP",
    description: "Enter the OTP sent to your email",
    schema: otpSchema,
    fields: [
      {
        key: "otp",
        label: "OTP",
        description: "Please enter the 6-digit OTP sent to your email",
        render({ field }) {
          return (
            <FormControl>
              <div className="flex justify-center">
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </FormControl>
          );
        },
      },
    ],
  };

  return (
    <MultipleStepForm
      steps={[emailStep, otpStep]}
      schema={schema}
      initialValues={{ email: "", otp: "" }}
      onSubmit={(data) => {
        console.log("Final submitted data:", data);
      }}
    />
  );
}
