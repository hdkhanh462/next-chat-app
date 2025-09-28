import { ConversationFilterInput } from "@/schemas/conversation.schema";
import { UserParamsInput } from "@/schemas/user.schema";

export const QUERY_KEYS = {
  CONVERSATIONS: {
    all: () => ["conversations"],
    getConversations: (params: ConversationFilterInput) => [
      ...QUERY_KEYS.CONVERSATIONS.all(),
      params,
    ],
    getMessages: (conversationId: string) => [
      ...QUERY_KEYS.CONVERSATIONS.all(),
      conversationId,
      ...QUERY_KEYS.MESSAGES.all(),
    ],
  },
  MESSAGES: {
    all: () => ["messages"],
  },
  FRIENDS: {
    all: () => ["friends"],
  },
  USERS: {
    all: () => ["users"],
    getCurrent: () => ["current-user"],
    getUsers: (params: UserParamsInput) => [...QUERY_KEYS.USERS.all(), params],
    getFriends: (params: UserParamsInput) => [
      ...QUERY_KEYS.USERS.getCurrent(),
      ...QUERY_KEYS.FRIENDS.all(),
      params,
    ],
  },
};
