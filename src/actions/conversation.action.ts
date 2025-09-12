"use server";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { createConversationSchema } from "@/schemas/conversation.schema";
import { RequestStatus } from "@prisma/client";

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
                  status: RequestStatus.ACCEPTED,
                },
                ...recipientIds.map((id) => ({
                  userId: id,
                  status: RequestStatus.PENDING,
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
