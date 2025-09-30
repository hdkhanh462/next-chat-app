"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
import betterAuthToast from "@/components/toasts/better-auth";

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
      const isHandled = betterAuthToast(error.code);
      if (!isHandled) {
        toast.error("Reset password failed", {
          description:
            "There was an issue resetting your password. Please try again.",
        });
      }
      throw new Error(error.message);
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
