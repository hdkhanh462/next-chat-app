export const AUTH_PATH = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  API: {
    GET_SESSION: "/api/auth/get-session",
  },
} as const;

export const ACCOUNT_PATH = {
  DASHBOARD: "/account/dashboard",
  PROFILE: "/account/profile",
  SECURITY: "/account/security",
  API_KEYS: "/account/api-keys",
  NOTIFICATIONS: "/account/notifications",
  SETTINGS: {
    GENERAL: "/account/settings/general",
    LANGUAGES: "/account/settings/languages",
    NOTIFICATIONS: "/account/settings/notifications",
  },
} as const;
