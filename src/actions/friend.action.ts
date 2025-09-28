"use server";

import { addDays, isBefore } from "date-fns";
import { returnValidationErrors } from "next-safe-action";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import {
  friendSchema,
  sendFriendRequestSchema,
  unfriendSchema,
} from "@/schemas/user.schema";
import { makeKeyPair } from "@/utils/db-helper";
import { pusher } from "@/lib/pusher/server";
import { FRIENDS_CHANNEL } from "@/constants/pusher-events";

export const sendFriendRequestAction = authActionClient
  .inputSchema(sendFriendRequestSchema)
  .action(async ({ parsedInput: { addresseeId }, ctx: { currentUser } }) => {
    const keyPair = makeKeyPair(currentUser.id, addresseeId);
    const existing = await prisma.friendship.findUnique({
      where: { keyPair },
    });

    if (existing) {
      switch (existing.status) {
        case "ACCEPTED":
          return returnValidationErrors(sendFriendRequestSchema, {
            _errors: ["You are already friends"],
          });
        case "PENDING":
          if (existing.requesterId === currentUser.id) {
            const canResend = isBefore(
              addDays(existing.updatedAt, 1),
              new Date()
            );
            if (!canResend) {
              return returnValidationErrors(sendFriendRequestSchema, {
                _errors: ["The request has been sent, please resend tomorrow"],
              });
            }
            await prisma.friendship.update({
              where: { id: existing.id },
              data: { status: "PENDING" },
            });
            await pusher.trigger(
              `private-user-${addresseeId}`,
              FRIENDS_CHANNEL.NEW,
              currentUser
            );
            return {
              message: "Resend request successfully",
            };
          }
          return returnValidationErrors(sendFriendRequestSchema, {
            _errors: ["This user has already sent you a request"],
          });
        case "REJECTED":
          if (existing.requesterId === currentUser.id) {
            await prisma.friendship.update({
              where: { id: existing.id },
              data: { status: "PENDING" },
            });
            await pusher.trigger(
              `private-user-${addresseeId}`,
              FRIENDS_CHANNEL.NEW,
              currentUser
            );
            return {
              message: "Resend request successfully",
            };
          }
          await prisma.friendship.update({
            where: { id: existing.id },
            data: {
              status: "PENDING",
              requesterId: currentUser.id,
              addresseeId,
            },
          });
          await pusher.trigger(
            `private-user-${addresseeId}`,
            FRIENDS_CHANNEL.NEW,
            currentUser
          );
          return {
            message: "Send request successfully",
          };
      }
    }

    await prisma.friendship.create({
      data: {
        requesterId: currentUser.id,
        addresseeId,
        keyPair,
        status: "PENDING",
      },
    });

    await pusher.trigger(
      `private-user-${addresseeId}`,
      FRIENDS_CHANNEL.NEW,
      currentUser
    );
    return {
      message: "Send request successfully",
    };
  });

export const acceptFriendRequestAction = authActionClient
  .inputSchema(friendSchema)
  .action(async ({ parsedInput: { requestId }, ctx: { currentUser } }) => {
    const request = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return returnValidationErrors(friendSchema, {
        _errors: ["Friend request not found"],
      });
    }

    if (request.addresseeId !== currentUser.id) {
      return returnValidationErrors(friendSchema, {
        _errors: ["You are not authorized to accept this request"],
      });
    }

    if (request.status !== "PENDING") {
      return returnValidationErrors(friendSchema, {
        _errors: ["This request cannot be accepted"],
      });
    }

    await prisma.friendship.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });
    await pusher.trigger(
      `private-user-${request.requesterId}`,
      FRIENDS_CHANNEL.ACCEPT,
      currentUser
    );
    return { message: "Friend request accepted successfully" };
  });

export const rejectFriendRequestAction = authActionClient
  .inputSchema(friendSchema)
  .action(async ({ parsedInput: { requestId }, ctx: { currentUser } }) => {
    const request = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return returnValidationErrors(friendSchema, {
        _errors: ["Friend request not found"],
      });
    }

    if (request.addresseeId !== currentUser.id) {
      return returnValidationErrors(friendSchema, {
        _errors: ["You are not authorized to reject this request"],
      });
    }

    if (request.status !== "PENDING") {
      return returnValidationErrors(friendSchema, {
        _errors: ["This request cannot be rejected"],
      });
    }

    await prisma.friendship.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });

    return { message: "Friend request rejected successfully" };
  });

export const cancelFriendRequestAction = authActionClient
  .inputSchema(friendSchema)
  .action(async ({ parsedInput: { requestId }, ctx: { currentUser } }) => {
    const request = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return returnValidationErrors(friendSchema, {
        _errors: ["Friend request not found"],
      });
    }

    if (request.requesterId !== currentUser.id) {
      return returnValidationErrors(friendSchema, {
        _errors: ["You are not authorized to cancel this request"],
      });
    }

    if (request.status !== "PENDING") {
      return returnValidationErrors(friendSchema, {
        _errors: ["This request cannot be canceled"],
      });
    }

    await prisma.friendship.delete({
      where: { id: requestId },
    });

    return { message: "Friend request canceled successfully" };
  });

export const unfriendAction = authActionClient
  .inputSchema(unfriendSchema)
  .action(async ({ parsedInput: { friendId }, ctx: { currentUser } }) => {
    const existing = await prisma.friendship.findUnique({
      where: {
        keyPair: makeKeyPair(currentUser.id, friendId),
        status: "ACCEPTED",
      },
    });

    if (!existing) {
      return returnValidationErrors(unfriendSchema, {
        _errors: ["You are not friends with this user"],
      });
    }

    await prisma.friendship.delete({
      where: { id: existing.id },
    });

    return { message: "Unfriended successfully" };
  });
