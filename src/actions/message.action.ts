"use server";

import { omit, pick } from "lodash";
import { returnValidationErrors } from "next-safe-action";
import z from "zod";

import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher/server";
import { authActionClient } from "@/lib/safe-action";
import { createMessageSchema } from "@/schemas/message.schema";
import {
  CONVERSATIONS_CHANNEL,
  MESSAGES_CHANNEL,
} from "@/constants/pusher-events";

export const createMessageAction = authActionClient
  .inputSchema(createMessageSchema)
  .action(
    async ({
      parsedInput: { conversationId, content, images },
      ctx: { currentUserId },
    }) => {
      const existingConv = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
          members: { some: { id: currentUserId } },
        },
        include: { members: true },
      });
      if (!existingConv) {
        return returnValidationErrors(createMessageSchema, {
          _errors: ["Conversation not found"],
        });
      }

      const newMessage = await prisma.message.create({
        data: {
          conversationId,
          senderId: currentUserId,
          content,
          images,
        },
        include: { sender: true },
      });

      const newMessageDto = omit(
        {
          ...newMessage,
          sender: pick(newMessage.sender, ["id", "name", "image"]),
        },
        ["updatedAt", "senderId"]
      );

      await Promise.all([
        pusher.trigger(
          conversationId,
          MESSAGES_CHANNEL.BASE + MESSAGES_CHANNEL.NEW,
          newMessageDto
        ),
        ...existingConv.memberIds.map((memberId) => {
          pusher.trigger(
            `private-user-${memberId}`,
            CONVERSATIONS_CHANNEL.BASE + CONVERSATIONS_CHANNEL.MESSAGE.NEW,
            newMessageDto
          );
        }),
      ]);

      return {
        message: "Message sent successfully",
        newMessageId: newMessage.id,
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
      const conv = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
          members: { some: { id: currentUserId } },
        },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      });
      if (!conv) {
        return returnValidationErrors(seenMessageSchema, {
          _errors: ["Conversation not found"],
        });
      }

      const lastMessage = conv.messages.at(0);
      if (!lastMessage) {
        return returnValidationErrors(seenMessageSchema, {
          _errors: ["Last message not found"],
        });
      }

      if (lastMessage.seenByIds.includes(currentUserId)) {
        return returnValidationErrors(seenMessageSchema, {
          _errors: ["Last message already seen"],
        });
      }

      const updatedMessage = await prisma.message.update({
        where: { id: lastMessage.id },
        data: {
          seenBy: {
            connect: { id: currentUserId },
          },
        },
        include: { sender: true, seenBy: true },
      });

      const updatedMessageDto = omit(
        {
          ...updatedMessage,
          sender: pick(updatedMessage.sender, ["id", "name", "image"]),
          seenBy: updatedMessage.seenBy.map((user) =>
            pick(user, ["id", "name", "image"])
          ),
        },
        ["updatedAt", "senderId", "seenByIds"]
      );

      await pusher.trigger(
        conversationId,
        MESSAGES_CHANNEL.BASE + MESSAGES_CHANNEL.UPDATE,
        updatedMessageDto
      );
      await pusher.trigger(
        `private-user-${currentUserId}`,
        CONVERSATIONS_CHANNEL.BASE + CONVERSATIONS_CHANNEL.MESSAGE.UPDATE,
        updatedMessageDto
      );

      return {
        message: "Seen status updated successfully",
        updatedMessageId: updatedMessageDto.id,
      };
    }
  );
