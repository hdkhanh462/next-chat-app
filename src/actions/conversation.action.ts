"use server";

import { omit, pick } from "lodash";
import { returnValidationErrors } from "next-safe-action";

import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher/server";
import { authActionClient } from "@/lib/safe-action";
import { createConversationSchema } from "@/schemas/conversation.schema";

export const createConversationAction = authActionClient
  .inputSchema(createConversationSchema)
  .action(
    async ({ parsedInput: { to: memberIds }, ctx: { currentUserId } }) => {
      const uniqueMemberIds = Array.from(
        new Set([...memberIds, currentUserId])
      );
      const members = await prisma.user.findMany({
        where: { id: { in: uniqueMemberIds } },
      });
      if (members.length !== uniqueMemberIds.length) {
        return returnValidationErrors(createConversationSchema, {
          _errors: ["Some users are not found"],
        });
      }

      const isGroup = members.length > 2;
      const name = isGroup
        ? members
            .slice(0, 3)
            .map((m) => m.name)
            .join(", ")
        : undefined;

      if (!isGroup) {
        const existingConversation = await prisma.conversation.findFirst({
          where: {
            isGroup: false,
            AND: [
              { members: { some: { id: currentUserId } } },
              { members: { some: { id: memberIds[0] } } },
            ],
          },
        });
        if (existingConversation) {
          return returnValidationErrors(createConversationSchema, {
            _errors: ["A conversation with this user already exists."],
          });
        }
      }

      const newConv = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          members: {
            connect: [...members.map((m) => ({ id: m.id }))],
          },
        },
        include: { members: true },
      });

      const newConvDTO = omit(
        {
          ...newConv,
          members: newConv.members.map((m) => pick(m, ["id", "name", "image"])),
        },
        ["createdAt", "updatedAt", "memberIds"]
      );

      await Promise.all(
        newConvDTO.members.map((m) =>
          pusher.trigger(m.id, "conversation:new", newConvDTO)
        )
      );

      return {
        message: "Conversation created successfully",
        newConversationId: newConvDTO.id,
      };
    }
  );
