"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";

import {
  forgotPasswordEmailStep,
  forgotPasswordOtpStep,
  forgotPasswordResetPasswordStep,
} from "@/app/auth/_constants/forgot-password";
import { buttonVariants } from "@/components/ui/button";
import { MultipleStepForm } from "@/components/ui/multiple-step-form";
import { AUTH_PATH } from "@/constants/routes";
import { authClient } from "@/lib/auth/client";
import {
  ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/schemas/forgot-password";

type Props = {
  initialValues?: Partial<ForgotPasswordInput>;
  initialStep?: number;
};

export default function ForgotPasswordForm({
  initialValues = {
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  },
  initialStep,
}: Props) {
  const handleSubmit = async (values: ForgotPasswordInput) => {
    const { error } = await authClient.emailOtp.resetPassword({
      email: values.email,
      otp: values.otp,
      password: values.newPassword,
    });

    if (error) {
      console.error("Error reset password:", error);
    }
  };

  return (
    <MultipleStepForm
      steps={[
        forgotPasswordEmailStep,
        forgotPasswordOtpStep,
        forgotPasswordResetPasswordStep,
      ]}
      schema={forgotPasswordSchema}
      initialValues={initialValues}
      initialStep={initialStep}
      submitLabel="Reset password"
      onSubmit={handleSubmit}
    >
      {/* Completed Placeholder */}
      <div className="text-center space-y-6">
        <div className="bg-primary/10 inline-flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle2 className="text-primary h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">
          Password Reset Successfully!
        </h2>
        <p className="text-muted-foreground">
          Your password has been updated. You can now log in with your new
          password.
        </p>
        <a href={AUTH_PATH.LOGIN} className={buttonVariants()}>
          Go to Login
          <ArrowRight />
        </a>
      </div>
    </MultipleStepForm>
  );
}
