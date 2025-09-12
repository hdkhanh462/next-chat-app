import { RequestStatus, User } from "@prisma/client";

export type RequestDirection = "INCOMING" | "OUTGOING";

export type FriendShipStatus = {
  requestId: string;
  status: RequestStatus;
  direction: RequestDirection;
};

export type UserWithFriendShipStatus = Pick<User, "id" | "name" | "image"> & {
  friendShip?: FriendShipStatus;
};
