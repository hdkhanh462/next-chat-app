"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";

import { emailStep, otpStep } from "@/app/auth/_constants/email";
import { buttonVariants } from "@/components/ui/button";
import { MultipleStepForm } from "@/components/ui/multiple-step-form";
import { AUTH_PATH } from "@/constants/routes";
import { authClient } from "@/lib/auth/client";
import { VerifyEmailInput, verifyEmailSchema } from "@/schemas/email.schema";

type Props = {
  initialValues?: Partial<VerifyEmailInput>;
  initialStep?: number;
};

export default function VerifyEmailForm({
  initialValues = { email: "", otp: "" },
  initialStep,
}: Props) {
  const handleSubmit = async (values: VerifyEmailInput) => {
    const { error } = await authClient.emailOtp.verifyEmail({
      email: values.email,
      otp: values.otp,
    });

    if (error) {
      console.error("Error verifying email:", error);
    }
  };

  return (
    <MultipleStepForm
      steps={[emailStep, otpStep]}
      schema={verifyEmailSchema}
      initialValues={initialValues}
      initialStep={initialStep}
      submitLabel="Verify"
      onSubmit={handleSubmit}
    >
      {/* Completed Placeholder */}
      <div className="text-center space-y-6">
        <div className="bg-primary/10 inline-flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle2 className="text-primary h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">
          Email Verified Successfully!
        </h2>
        <p className="text-muted-foreground">
          You can now proceed to login with your verified email.
        </p>
        <a href={AUTH_PATH.LOGIN} className={buttonVariants()}>
          Go to Login
          <ArrowRight />
        </a>
      </div>
    </MultipleStepForm>
  );
}
