"use server";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { createConversationSchema } from "@/schemas/conversation.schema";

export const createConversationAction = authActionClient
  .inputSchema(createConversationSchema)
  .action(
    async ({ parsedInput: { to: recipientIds }, ctx: { currentUserId } }) => {
      const isGroup = recipientIds.length > 1;
      const name = isGroup ? "Group" : undefined;

      const conversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          members: {
            createMany: {
              data: [
                {
                  userId: currentUserId,
                },
                ...recipientIds.map((id) => ({
                  userId: id,
                })),
              ],
            },
          },
        },
      });
      return {
        message: "Conversation created successfully",
        conversationId: conversation.id,
      };
    }
  );
