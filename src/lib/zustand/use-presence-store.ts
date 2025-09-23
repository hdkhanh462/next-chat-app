"use client";

import { create } from "zustand";

type PresenceState = {
  onlineUserIds: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
};

export const usePresenceStore = create<PresenceState>()((set) => ({
  onlineUserIds: [],
  add: (id) =>
    set((state) => ({ onlineUserIds: [...state.onlineUserIds, id] })),
  remove: (id) =>
    set((state) => ({
      onlineUserIds: state.onlineUserIds.filter((userId) => userId !== id),
    })),
  set: (ids) => set({ onlineUserIds: ids }),
}));
