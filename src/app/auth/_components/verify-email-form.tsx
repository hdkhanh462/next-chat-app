"use client";

import { emailStep, otpStep } from "@/app/auth/_constants/email";
import { MultipleStepForm } from "@/components/ui/multiple-step-form";
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
    console.log("Final submitted data:", values);

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
    />
  );
}
