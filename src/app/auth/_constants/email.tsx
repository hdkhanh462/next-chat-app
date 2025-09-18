import { REGEXP_ONLY_DIGITS } from "input-otp";
import z from "zod";

import ResendCountdown from "@/app/auth/_components/resend-countdown";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { StepConfig } from "@/components/ui/multiple-step-form";
import {
  EmailFormInput,
  emailSchema,
  OTPFormInput,
  otpSchema,
  VerifyEmailInput,
} from "@/schemas/email.schema";
import { authClient } from "@/lib/auth/client";

export const handleResendClick = async (values: EmailFormInput) => {
  console.log("Resending OTP to:", values.email);

  const { error } = await authClient.emailOtp.sendVerificationOtp({
    email: values.email,
    type: "email-verification",
  });

  if (error) {
    console.error("Error resending OTP:", error);
  }
};

export const emailStep: StepConfig<EmailFormInput> = {
  title: "Verify Email",
  description: "Enter your email to receive the OTP",
  schema: emailSchema,
  async onSubmit(data) {
    await handleResendClick(data);
  },
  fields: [
    {
      key: "email",
      label: "Email",
      description: "Please enter your email address to receive the OTP",
      render: ({ field }) => (
        <FormControl>
          <Input placeholder="your@email.com" {...field} />
        </FormControl>
      ),
    },
  ],
};

export const otpStep: StepConfig<OTPFormInput, VerifyEmailInput> = {
  title: "Verify OTP",
  description:
    "Enter the 6-digit OTP sent to your email, check spam folder if not found",
  schema: otpSchema,
  disableBackAction: true,
  fields: [
    {
      key: "otp",
      render: ({ field, formData }) => (
        <FormControl>
          <div className="flex flex-col gap-2">
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
            <div className="text-end text-sm text-muted-foreground mx-4">
              <ResendCountdown
                onCompleteClick={() =>
                  handleResendClick({ email: formData.email })
                }
              />
            </div>
          </div>
        </FormControl>
      ),
    },
  ],
};
