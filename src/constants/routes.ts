export const AUTH_PATH = {
  LOGIN: "/auth/login",
  LOGIN_REDIRECT: "/conversations",
  REGISTER: "/auth/register",
  VERIFY_EMAIL: "/auth/verify-email",
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

export const CHAT_API_PATH = {
  CONVERSATIONS: "/api/chat-app/conversations",
  FRIENDS: "/api/chat-app/friends",
  USERS: "/api/chat-app/users",
} as const;
