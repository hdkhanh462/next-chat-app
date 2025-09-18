"use server";

import { addDays, isBefore } from "date-fns";
import { returnValidationErrors } from "next-safe-action";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import {
  friendSchema,
  sendFriendRequestSchema,
  unfriendSchema,
} from "@/schemas/friend.schema";

export const sendFriendRequestAction = authActionClient
  .inputSchema(sendFriendRequestSchema)
  .action(async ({ parsedInput: { addresseeId }, ctx: { currentUserId } }) => {
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: currentUserId, addresseeId },
          { requesterId: addresseeId, addresseeId: currentUserId },
        ],
      },
      orderBy: {
        requesterId: "asc",
      },
    });

    if (existing) {
      switch (existing.status) {
        case "ACCEPTED":
          return returnValidationErrors(sendFriendRequestSchema, {
            _errors: ["You are already friends"],
          });
        case "PENDING":
          if (existing.requesterId === currentUserId) {
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
            return {
              message: "Resend request successfully",
            };
          }
          return returnValidationErrors(sendFriendRequestSchema, {
            _errors: ["This user has already sent you a request"],
          });
        case "REJECTED":
          if (existing.requesterId === currentUserId) {
            await prisma.friendship.update({
              where: { id: existing.id },
              data: { status: "PENDING" },
            });
            return {
              message: "Resend request successfully",
            };
          }
          break;
      }
    }

    await prisma.friendship.create({
      data: {
        requesterId: currentUserId,
        addresseeId,
        status: "PENDING",
      },
    });
    return {
      message: "Send request successfully",
    };
  });

export const acceptFriendRequestAction = authActionClient
  .inputSchema(friendSchema)
  .action(async ({ parsedInput: { requestId }, ctx: { currentUserId } }) => {
    const request = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return returnValidationErrors(friendSchema, {
        _errors: ["Friend request not found"],
      });
    }

    if (request.addresseeId !== currentUserId) {
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

    return { message: "Friend request accepted successfully" };
  });

export const rejectFriendRequestAction = authActionClient
  .inputSchema(friendSchema)
  .action(async ({ parsedInput: { requestId }, ctx: { currentUserId } }) => {
    const request = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return returnValidationErrors(friendSchema, {
        _errors: ["Friend request not found"],
      });
    }

    if (request.addresseeId !== currentUserId) {
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
  .action(async ({ parsedInput: { requestId }, ctx: { currentUserId } }) => {
    const request = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return returnValidationErrors(friendSchema, {
        _errors: ["Friend request not found"],
      });
    }

    if (request.requesterId !== currentUserId) {
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
  .action(async ({ parsedInput: { friendId }, ctx: { currentUserId } }) => {
    const friendship = await prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { requesterId: currentUserId, addresseeId: friendId },
          { requesterId: friendId, addresseeId: currentUserId },
        ],
      },
      orderBy: {
        requesterId: "asc",
      },
    });

    if (!friendship) {
      return returnValidationErrors(unfriendSchema, {
        _errors: ["You are not friends with this user"],
      });
    }

    await prisma.friendship.delete({
      where: { id: friendship.id },
    });

    return { message: "Unfriended successfully" };
  });
