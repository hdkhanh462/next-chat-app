"use client";

import { CheckIcon, Loader2, RotateCcwIcon, XIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { TbUsersMinus, TbUsersPlus } from "react-icons/tb";

import {
  acceptFriendRequestAction,
  cancelFriendRequestAction,
  rejectFriendRequestAction,
  sendFriendRequestAction,
  unfriendAction,
} from "@/actions/friend.action";
import { Button } from "@/components/ui/button";
import { FriendShipStatus } from "@/types/user.type";

type FriendActionButtonProps = {
  targetUserId: string;
  friendShip?: FriendShipStatus;
  onActionSuccess?: (message: string) => void;
  onActionError?: (messages?: string[]) => void;
};

export default function FriendActionButton({
  targetUserId,
  friendShip,
  onActionSuccess,
  onActionError,
}: FriendActionButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actionOptions: any = {
    onSuccess: (args: {
      data: {
        message: string;
      };
    }) => onActionSuccess?.(args.data.message),
    onError: (args: {
      error: {
        validationErrors?: {
          _errors?: string[];
        };
      };
    }) => onActionError?.(args.error.validationErrors?._errors),
  };

  const { execute: sendRequest, isExecuting: sending } = useAction(
    sendFriendRequestAction,
    actionOptions
  );

  const { execute: acceptRequest, isExecuting: accepting } = useAction(
    acceptFriendRequestAction,
    actionOptions
  );

  const { execute: rejectRequest, isExecuting: rejecting } = useAction(
    rejectFriendRequestAction,
    actionOptions
  );

  const { execute: unfriend, isExecuting: unfriending } = useAction(
    unfriendAction,
    actionOptions
  );

  const { execute: cancelRequest, isExecuting: canceling } = useAction(
    cancelFriendRequestAction,
    actionOptions
  );

  const renderAction = () => {
    if (!friendShip) {
      return (
        <Button
          variant="outline"
          className="!p-1 size-auto hover:cursor-pointer"
          disabled={sending}
          onClick={() => sendRequest({ addresseeId: targetUserId })}
        >
          <TbUsersPlus className="text-inherit" />
          <span className="sr-only">Send request</span>
        </Button>
      );
    }

    switch (friendShip.status) {
      case "ACCEPTED":
        return (
          <Button
            variant="outline"
            className="!p-1 size-auto hover:cursor-pointer"
            disabled={unfriending}
            onClick={() => unfriend({ friendId: targetUserId })}
          >
            <TbUsersMinus className="text-inherit" />
            <span className="sr-only">Unfriend</span>
          </Button>
        );

      case "PENDING":
        if (friendShip.direction === "INCOMING") {
          return (
            <>
              <Button
                variant="outline"
                className="!p-1 size-auto hover:cursor-pointer"
                disabled={accepting || rejecting}
                onClick={() =>
                  acceptRequest({ requestId: friendShip.requestId })
                }
              >
                <CheckIcon className="text-inherit" />
                <span className="sr-only">Accept</span>
              </Button>
              <Button
                variant="outline"
                className="!p-1 size-auto hover:cursor-pointer"
                disabled={rejecting || accepting}
                onClick={() =>
                  rejectRequest({ requestId: friendShip.requestId })
                }
              >
                <XIcon className="text-inherit" />
                <span className="sr-only">Reject</span>
              </Button>
            </>
          );
        }

        if (friendShip.direction === "OUTGOING") {
          return (
            <>
              <Button
                variant="outline"
                className="!p-1 size-auto hover:cursor-pointer"
                disabled={sending || canceling}
                onClick={() => sendRequest({ addresseeId: targetUserId })}
              >
                <RotateCcwIcon className="text-inherit" />
                <span className="sr-only">Resend request</span>
              </Button>
              <Button
                variant="outline"
                className="!p-1 size-auto hover:cursor-pointer"
                disabled={canceling || sending}
                onClick={() =>
                  cancelRequest({ requestId: friendShip.requestId })
                }
              >
                <XIcon className="text-inherit" />
                <span className="sr-only">Cancel request</span>
              </Button>
            </>
          );
        }
        break;

      case "REJECTED":
        if (friendShip.direction === "OUTGOING") {
          return (
            <Button
              variant="outline"
              className="!p-1 size-auto hover:cursor-pointer"
              disabled={sending}
              onClick={() => sendRequest({ addresseeId: targetUserId })}
            >
              <RotateCcwIcon className="text-inherit" />
              <span className="sr-only">Resend request</span>
            </Button>
          );
        }
        if (friendShip.direction === "INCOMING") {
          return (
            <Button
              variant="outline"
              className="!p-1 size-auto hover:cursor-pointer"
              disabled={sending}
              onClick={() => sendRequest({ addresseeId: targetUserId })}
            >
              <TbUsersPlus className="text-inherit" />
              <span className="sr-only">Send request</span>
            </Button>
          );
        }
        break;
    }

    return null;
  };

  return (
    <>
      {(sending || accepting || rejecting || unfriending || canceling) && (
        <Loader2 className="animate-spin" />
      )}
      {renderAction()}
    </>
  );
}
