"use client";

import { Channel, Members } from "pusher-js";
import { useCallback, useEffect, useRef } from "react";

import { pusherClient } from "@/lib/pusher/client";
import { usePresenceStore } from "@/lib/zustand/use-presence-store";

export default function usePresenceChannel() {
  const channelRef = useRef<Channel | null>(null);
  const set = usePresenceStore((state) => state.set);
  const add = usePresenceStore((state) => state.add);
  const remove = usePresenceStore((state) => state.remove);

  const setUsersHandler = useCallback(
    (memberIds: string[]) => {
      set(memberIds);
    },
    [set]
  );

  const addUsersHandler = useCallback(
    (memberId: string) => {
      add(memberId);
    },
    [add]
  );

  const removeUsersHandler = useCallback(
    (memberId: string) => {
      remove(memberId);
    },
    [remove]
  );

  useEffect(() => {
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe("presence-online-users");

      channelRef.current.bind(
        "pusher:subscription_succeeded",
        (members: Members) => {
          setUsersHandler(Object.keys(members.members));
        }
      );

      channelRef.current.bind(
        "pusher:member_added",
        (member: { id: string }) => {
          addUsersHandler(member.id);
        }
      );

      channelRef.current.bind(
        "pusher:member_removed",
        (member: { id: string }) => {
          removeUsersHandler(member.id);
        }
      );
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind(
          "pusher:subscription_succeeded",
          setUsersHandler
        );
        channelRef.current.unbind("pusher:member_added", addUsersHandler);
        channelRef.current.unbind("pusher:member_removed", removeUsersHandler);
        pusherClient.unsubscribe("presence-online-users");
        channelRef.current = null;
      }
    };
  }, [setUsersHandler, addUsersHandler, removeUsersHandler]);
}
