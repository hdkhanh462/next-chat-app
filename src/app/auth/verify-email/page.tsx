import React from "react";

import VerifyEmailForm from "@/app/auth/_components/verify-email-form";

// TODO: Check if user is already verified and redirect to login if true

export default function Page() {
  return (
    <div className="w-full max-w-sm">
      <VerifyEmailForm />
    </div>
  );
}
