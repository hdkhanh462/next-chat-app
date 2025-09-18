"use server";

import { addDays, isBefore } from "date-fns";
import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";

const sendFriendRequestSchema = z.object({
  addresseeId: z.string(),
});

export const sendFriendRequestAction = authActionClient
  .inputSchema(sendFriendRequestSchema)
  .action(async ({ parsedInput: { addresseeId }, ctx: { currentUserId } }) => {
    // 1. Kiểm tra xem đã có record nào giữa 2 user chưa
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

    // 2. Nếu đã tồn tại thì check theo status
    if (existing) {
      switch (existing.status) {
        case "ACCEPTED":
          return returnValidationErrors(sendFriendRequestSchema, {
            _errors: ["You are already friends"],
          });
        case "PENDING":
          if (existing.requesterId === currentUserId) {
            // 2.1. Tôi là người gửi, kiểm tra thời gian
            const canResend = isBefore(
              addDays(existing.updatedAt, 1),
              new Date()
            );
            if (!canResend) {
              return returnValidationErrors(sendFriendRequestSchema, {
                _errors: ["The request has been sent, please resend tomorrow"],
              });
            }
            // 2.2. Cho phép gửi lại
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
            // 2.3. Tôi gửi, bị từ chối → cho phép gửi lại
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

    // 3. Nếu chưa tồn tại thì tạo mới
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

const acceptFriendRequestSchema = z.object({
  requestId: z.string(),
});

export const acceptFriendRequestAction = authActionClient
  .inputSchema(acceptFriendRequestSchema)
  .action(async ({ parsedInput: { requestId }, ctx: { currentUserId } }) => {
    // 1. Tìm request theo ID
    const request = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return returnValidationErrors(acceptFriendRequestSchema, {
        _errors: ["Friend request not found"],
      });
    }

    // 2. Kiểm tra quyền
    if (request.addresseeId !== currentUserId) {
      return returnValidationErrors(acceptFriendRequestSchema, {
        _errors: ["You are not authorized to accept this request"],
      });
    }

    // 3. Kiểm tra status
    if (request.status !== "PENDING") {
      return returnValidationErrors(acceptFriendRequestSchema, {
        _errors: ["This request cannot be accepted"],
      });
    }

    // 4. Update thành ACCEPTED
    await prisma.friendship.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });

    return { message: "Friend request accepted successfully" };
  });

const rejectFriendRequestSchema = z.object({
  requestId: z.string(),
});

export const rejectFriendRequestAction = authActionClient
  .inputSchema(rejectFriendRequestSchema)
  .action(async ({ parsedInput: { requestId }, ctx: { currentUserId } }) => {
    // 1. Tìm request
    const request = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return returnValidationErrors(rejectFriendRequestSchema, {
        _errors: ["Friend request not found"],
      });
    }

    // 2. Kiểm tra quyền
    if (request.addresseeId !== currentUserId) {
      return returnValidationErrors(rejectFriendRequestSchema, {
        _errors: ["You are not authorized to reject this request"],
      });
    }

    // 3. Chỉ được reject nếu đang PENDING
    if (request.status !== "PENDING") {
      return returnValidationErrors(rejectFriendRequestSchema, {
        _errors: ["This request cannot be rejected"],
      });
    }

    // 4. Update thành REJECTED
    await prisma.friendship.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });

    return { message: "Friend request rejected successfully" };
  });

const cancelFriendRequestSchema = z.object({
  requestId: z.string(),
});

export const cancelFriendRequestAction = authActionClient
  .inputSchema(cancelFriendRequestSchema)
  .action(async ({ parsedInput: { requestId }, ctx: { currentUserId } }) => {
    // 1. Tìm request
    const request = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return returnValidationErrors(cancelFriendRequestSchema, {
        _errors: ["Friend request not found"],
      });
    }

    // 2. Kiểm tra quyền
    if (request.requesterId !== currentUserId) {
      return returnValidationErrors(cancelFriendRequestSchema, {
        _errors: ["You are not authorized to cancel this request"],
      });
    }

    // 3. Chỉ được hủy nếu đang PENDING
    if (request.status !== "PENDING") {
      return returnValidationErrors(cancelFriendRequestSchema, {
        _errors: ["This request cannot be canceled"],
      });
    }

    // 4. Xóa record
    await prisma.friendship.delete({
      where: { id: requestId },
    });

    return { message: "Friend request canceled successfully" };
  });

const unfriendSchema = z.object({
  friendId: z.string(), // id của người bạn muốn hủy kết bạn
});

export const unfriendAction = authActionClient
  .inputSchema(unfriendSchema)
  .action(async ({ parsedInput: { friendId }, ctx: { currentUserId } }) => {
    // 1. Tìm quan hệ bạn bè
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

    // 2. Xóa record friendship
    await prisma.friendship.delete({
      where: { id: friendship.id },
    });

    return { message: "Unfriended successfully" };
  });
