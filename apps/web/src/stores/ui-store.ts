"use client";

import { create } from "zustand";
import type { DemoRole } from "@/types";
import { setDemoRole } from "@/lib/api";

interface UIState {
  // Demo mode
  role: DemoRole;
  setRole: (role: DemoRole) => void;

  // Evidence drawer
  evidenceDrawerOpen: boolean;
  evidenceEventId: string | null;
  openEvidenceDrawer: (eventId: string) => void;
  closeEvidenceDrawer: () => void;

  // Event expansion (for inline expand on tenant detail)
  expandedEventId: string | null;
  toggleEventExpanded: (eventId: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Demo mode
  role: "exec",
  setRole: (role) => {
    setDemoRole(role); // Sync with API client
    set({ role });
  },

  // Evidence drawer
  evidenceDrawerOpen: false,
  evidenceEventId: null,
  openEvidenceDrawer: (eventId) =>
    set({ evidenceDrawerOpen: true, evidenceEventId: eventId }),
  closeEvidenceDrawer: () =>
    set({ evidenceDrawerOpen: false, evidenceEventId: null }),

  // Event expansion
  expandedEventId: null,
  toggleEventExpanded: (eventId) =>
    set((state) => ({
      expandedEventId: state.expandedEventId === eventId ? null : eventId,
    })),
}));
