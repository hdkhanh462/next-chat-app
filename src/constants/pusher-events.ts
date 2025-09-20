export const CONVERSATIONS_CHANNEL = {
  BASE: "conversations:",
  NEW: "new",
  MESSAGE: {
    NEW: "new-message",
    UPDATE: "update-message",
  },
} as const;

export const MESSAGES_CHANNEL = {
  BASE: "messages:",
  NEW: "new",
  UPDATE: "update",
} as const;
