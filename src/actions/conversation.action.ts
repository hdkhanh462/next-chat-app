"use server";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { createConversationSchema } from "@/schemas/conversation.schema";
import { returnValidationErrors } from "next-safe-action";

export const createConversationAction = authActionClient
  .inputSchema(createConversationSchema)
  .action(
    async ({ parsedInput: { to: recipientIds }, ctx: { currentUserId } }) => {
      const isGroup = recipientIds.length > 1;
      const name = isGroup ? "Group" : undefined;

      // Check for existing one-on-one conversation
      if (!isGroup) {
        const existingConversation = await prisma.conversation.findFirst({
          where: {
            isGroup: false,
            OR: [
              {
                members: {
                  some: {
                    memberId: currentUserId,
                  },
                },
              },
              {
                members: {
                  some: {
                    memberId: recipientIds[0],
                  },
                },
              },
            ],
          },
        });
        if (existingConversation) {
          return returnValidationErrors(createConversationSchema, {
            _errors: ["A conversation with this user already exists."],
          });
        }
      }

      const conversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          members: {
            createMany: {
              data: [
                {
                  memberId: currentUserId,
                },
                ...recipientIds.map((id) => ({
                  memberId: id,
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
