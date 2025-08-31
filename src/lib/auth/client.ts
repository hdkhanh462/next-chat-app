import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "@/lib/auth/server";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  plugins: [inferAdditionalFields<typeof auth>()],
});

export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
export type ErrorDetail = {
  title: string;
  description: string;
};

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      en: ErrorDetail;
      vi: ErrorDetail;
    }
  >
>;

const errorCodes = {
  USER_ALREADY_EXISTS: {
    en: {
      title: "User Already Exists",
      description: "The email address is already in use.",
    },
    vi: {
      title: "Người dùng đã tồn tại",
      description: "Địa chỉ email đã được sử dụng.",
    },
  },
  INVALID_EMAIL_OR_PASSWORD: {
    en: {
      title: "Invalid email or password",
      description: "Please check your email and password and try again.",
    },
    vi: {
      title: "Email hoặc mật khẩu không chính xác",
      description: "Vui lòng kiểm tra email và mật khẩu của bạn và thử lại.",
    },
  },
} satisfies ErrorTypes;

type ErrorCode = keyof typeof errorCodes;

type GetErrorDetailOptions = {
  lang: keyof NonNullable<ErrorTypes[ErrorCode]>;
};

type GetErrorDetailFunction = (
  code: ErrorCode,
  options?: GetErrorDetailOptions
) => ErrorDetail;

export const getApiErrorDetail: GetErrorDetailFunction = (code, options) => {
  return errorCodes[code][options?.lang || "en"];
};

export function isApiErrorCode(code?: string | null): code is ErrorCode {
  if (!code) return false;
  return code in errorCodes;
}
