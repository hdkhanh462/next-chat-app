"use server";

import { returnValidationErrors } from "next-safe-action";
import z from "zod";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { createMessageSchema } from "@/schemas/message.schema";
import { Prisma } from "@prisma/client";

export const createMessageAction = authActionClient
  .inputSchema(createMessageSchema)
  .action(
    async ({
      parsedInput: { conversationId, content, images },
      ctx: { currentUserId },
    }) => {
      const result = await prisma.$transaction(async (tx) => {
        const newMessage = await tx.message.create({
          data: {
            conversationId,
            senderId: currentUserId,
            content,
            images,
          },
        });
        await tx.messageSeen.create({
          data: {
            messageId: newMessage.id,
            userId: currentUserId,
          },
        });
        return newMessage;
      });

      return {
        message: "Message sent successfully",
        id: result.id,
      };
    }
  );

const seenMessageSchema = z.object({
  conversationId: z.string().min(1),
});

export const seenMessage = authActionClient
  .inputSchema(seenMessageSchema)
  .action(
    async ({ parsedInput: { conversationId }, ctx: { currentUserId } }) => {
      try {
        const conv = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { messages: true },
        });
        const lastMessage = conv?.messages[conv.messages.length - 1];
        if (!lastMessage) {
          return returnValidationErrors(seenMessageSchema, {
            _errors: ["No messages in this conversation"],
          });
        }
        const result = await prisma.messageSeen.create({
          data: {
            messageId: lastMessage.id,
            userId: currentUserId,
          },
        });

        return {
          message: "Seen status updated successfully",
          id: result.id,
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            return returnValidationErrors(seenMessageSchema, {
              _errors: ["Message has already been seen"],
            });
          }
          return returnValidationErrors(seenMessageSchema, {
            _errors: ["Database error occurred"],
          });
        }
      }
    }
  );
