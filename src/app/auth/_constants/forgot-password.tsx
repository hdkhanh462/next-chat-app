import { REGEXP_ONLY_DIGITS } from "input-otp";

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
import { authClient } from "@/lib/auth/client";
import {
  EmailFormInput,
  emailSchema,
  OTPFormInput,
  otpSchema,
  VerifyEmailInput,
} from "@/schemas/email.schema";
import {
  ResetPasswordInput,
  resetPasswordFormSchema,
  ForgotPasswordInput,
} from "@/schemas/forgot-password";
import { PasswordInput } from "@/components/ui/password-input";

export const handleResendClick = async (values: EmailFormInput) => {
  const { error } = await authClient.forgetPassword.emailOtp({
    email: values.email,
  });

  if (error) {
    console.error("Error resending OTP:", error);
  }
};

export const handleVerifiOTP = async (values: VerifyEmailInput) => {
  const { error } = await authClient.emailOtp.checkVerificationOtp({
    type: "forget-password",
    email: values.email,
    otp: values.otp,
  });

  if (error) {
    console.error("Error verifiding OTP:", error);
  }
};

export const forgotPasswordEmailStep: StepConfig<EmailFormInput> = {
  title: "Forgot Password",
  description: "Enter your email to receive a verification code",
  schema: emailSchema,
  async onSubmit(data) {
    await handleResendClick(data);
  },
  fields: [
    {
      key: "email",
      label: "Email",
      description: "We'll send a 6-digit code to this email address",
      render: ({ field }) => (
        <FormControl>
          <Input placeholder="your@email.com" {...field} />
        </FormControl>
      ),
    },
  ],
};

export const forgotPasswordOtpStep: StepConfig<
  OTPFormInput,
  ForgotPasswordInput
> = {
  title: "Enter Verification Code",
  description:
    "Please enter the 6-digit code sent to your email. Check your spam or junk folder if you don't see it",
  schema: otpSchema,
  async onSubmit(_, data) {
    await handleVerifiOTP(data);
  },
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

export const forgotPasswordResetPasswordStep: StepConfig<
  ResetPasswordInput,
  ForgotPasswordInput
> = {
  title: "Set New Password",
  description: "Create a new password for your account",
  schema: resetPasswordFormSchema,
  disableBackAction: true,
  fields: [
    {
      key: "newPassword",
      label: "New password",
      render: ({ field }) => (
        <FormControl>
          <PasswordInput
            {...field}
            placeholder="Enter your new password"
            autoComplete="new-password"
          />
        </FormControl>
      ),
    },
    {
      key: "confirmNewPassword",
      label: "Confirm new password",
      render: ({ field }) => (
        <FormControl>
          <PasswordInput
            {...field}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
          />
        </FormControl>
      ),
    },
  ],
};
