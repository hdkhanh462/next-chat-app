import { RequestStatus, User } from "@prisma/client";

export type UserDTO = Pick<User, "id" | "name" | "image">;

export type RequestDirection = "INCOMING" | "OUTGOING";

export type FriendShipStatus = {
  requestId: string;
  status: RequestStatus;
  direction: RequestDirection;
};

export type UserWithFriendShipStatus = UserDTO & {
  friendShip?: FriendShipStatus;
};
