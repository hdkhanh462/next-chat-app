export const CONVERSATIONS_CHANNEL = {
  NEW: "conversations:new",
  MESSAGE: {
    NEW: "conversations:new-message",
    UPDATE: "conversations:update-message",
  },
} as const;

export const MESSAGES_CHANNEL = {
  NEW: "messages:new",
  UPDATE: "messages:update",
} as const;

export const FRIENDS_CHANNEL = {
  NEW: "friends:new",
  ACCEPT: "friends:accept",
} as const;
