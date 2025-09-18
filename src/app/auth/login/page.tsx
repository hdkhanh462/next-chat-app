import { LoginForm } from "@/app/auth/_components/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense fallback={<div>Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
