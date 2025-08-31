"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AUTH_PATH } from "@/constants/routes";
import {
  authClient,
  getApiErrorDetail,
  isApiErrorCode,
} from "@/lib/auth/client";
import { type LoginInput, loginSchema } from "@/schemas/auth.schema";

import SocialAuthSelector from "@/app/auth/_components/social-auth-seletor";

export function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const { error } = await authClient.signIn.email({
        ...values,
      });

      if (isApiErrorCode(error?.code)) {
        form.setValue("password", "");
        const errorDetail = getApiErrorDetail(error?.code);
        toast.error(errorDetail.title, {
          description: errorDetail.description,
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push(nextPath?.startsWith("/") ? nextPath : "/");
    });
  }

  return (
    <Card className="p-0 overflow-hidden">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="py-6">
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Next Chat App account
                </p>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="shadcn@example.com"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href={AUTH_PATH.FORGOT_PASSWORD}
                        className="ml-auto text-sm font-medium underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Remember Me</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-1 animate-spin" />}
                Login
              </Button>

              <div className="relative text-sm text-center after:border-border after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="relative z-10 px-2 bg-card text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <SocialAuthSelector />
              <div className="text-sm text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href={AUTH_PATH.REGISTER}
                  className="font-medium underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
