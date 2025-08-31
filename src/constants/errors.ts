export type ErrorDetail = {
  title: string;
  description: string;
};

export const APP_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
  },
  INVALID_FORMAT: {
    code: "INVALID_FORMAT",
    message: "Invalid format.",
  },
  INVALID_FILE_TYPE: {
    code: "INVALID_FILE_TYPE",
    message: "Invalid file type.",
  },
  UNSUPPORTED_FILE_TYPE: {
    code: "UNSUPPORTED_FILE_TYPE",
    message: "Unsupported file type.",
  },
  FILE_TOO_LARGE: {
    code: "FILE_TOO_LARGE",
    message: "File size exceeds the limit.",
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "Unauthorized access.",
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    message: "Forbidden access.",
  },
  NOT_FOUND: {
    code: "NOT_FOUND",
    message: "Resource not found.",
  },
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    message: "User not found.",
  },
} as const;

export type AppErrorCode = (typeof APP_ERRORS)[keyof typeof APP_ERRORS]["code"];

export class AppError extends Error {
  public code: AppErrorCode;

  constructor(key: AppErrorCode) {
    super(APP_ERRORS[key].message);
    this.name = "AppError";
    this.code = key;
  }

  static fromKey(key: AppErrorCode): AppError {
    return new AppError(key);
  }
}

type ErrorTypes = Partial<
  Record<
    AppErrorCode,
    {
      en: ErrorDetail;
      vi: ErrorDetail;
    }
  >
>;

const errorCodes = {
  UNAUTHORIZED: {
    en: {
      title: "Unauthorized",
      description: "You do not have permission to access this resource.",
    },
    vi: {
      title: "Truy cập trái phép",
      description: "Bạn không có quyền truy cập vào tài nguyên này.",
    },
  },
} satisfies ErrorTypes;

type ErrorCode = keyof typeof errorCodes;

type GetErrorDetailOptions = {
  lang: keyof NonNullable<ErrorTypes[AppErrorCode]>;
};

type GetErrorDetailFunction = (
  code: ErrorCode,
  options?: GetErrorDetailOptions
) => ErrorDetail;

export const getAppErrorDetail: GetErrorDetailFunction = (code, options) => {
  return errorCodes[code as keyof typeof errorCodes][options?.lang || "en"];
};

export function isAppErrorCode(code?: string | null): code is ErrorCode {
  if (!code) return false;
  return code in errorCodes;
}
