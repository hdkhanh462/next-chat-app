"use client";

import { useUserQuery } from "@/data/hooks/user";
import useNotificationChannel from "@/lib/pusher/use-notification-channel";
import usePresenceChannel from "@/lib/pusher/use-presence-channel";

export default function PrivateProvider() {
  const { data: currentUser } = useUserQuery();

  usePresenceChannel();
  useNotificationChannel(currentUser?.id);

  return null;
}
