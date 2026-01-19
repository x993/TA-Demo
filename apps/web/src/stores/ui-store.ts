"use client";

import { create } from "zustand";
import type { DemoRole, PanelType } from "@/types";
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

  // Panel state
  panelOpen: boolean;
  panelType: PanelType | null;
  panelEntityId: string | null;
  panelTileData: any | null;
  openPanel: (type: PanelType, entityId: string, tileData?: any) => void;
  closePanel: () => void;

  // Coverage drawer
  coverageDrawerOpen: boolean;
  openCoverageDrawer: () => void;
  closeCoverageDrawer: () => void;

  // Tenant scope sheet (per-tenant coverage)
  tenantScopeSheetOpen: boolean;
  tenantScopeId: string | null;
  openTenantScopeSheet: (tenantId: string) => void;
  closeTenantScopeSheet: () => void;

  // Command palette (desktop)
  commandPaletteOpen: boolean;
  toggleCommandPalette: () => void;

  // Run details modal
  runDetailsModalOpen: boolean;
  openRunDetailsModal: () => void;
  closeRunDetailsModal: () => void;
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

  // Panel state
  panelOpen: false,
  panelType: null,
  panelEntityId: null,
  panelTileData: null,
  openPanel: (type, entityId, tileData = null) =>
    set({
      panelOpen: true,
      panelType: type,
      panelEntityId: entityId,
      panelTileData: tileData,
    }),
  closePanel: () =>
    set({
      panelOpen: false,
      panelType: null,
      panelEntityId: null,
      panelTileData: null,
    }),

  // Coverage drawer
  coverageDrawerOpen: false,
  openCoverageDrawer: () => set({ coverageDrawerOpen: true }),
  closeCoverageDrawer: () => set({ coverageDrawerOpen: false }),

  // Tenant scope sheet
  tenantScopeSheetOpen: false,
  tenantScopeId: null,
  openTenantScopeSheet: (tenantId) =>
    set({
      tenantScopeSheetOpen: true,
      tenantScopeId: tenantId,
    }),
  closeTenantScopeSheet: () =>
    set({
      tenantScopeSheetOpen: false,
      tenantScopeId: null,
    }),

  // Command palette
  commandPaletteOpen: false,
  toggleCommandPalette: () =>
    set((state) => ({
      commandPaletteOpen: !state.commandPaletteOpen,
    })),

  // Run details modal
  runDetailsModalOpen: false,
  openRunDetailsModal: () => set({ runDetailsModalOpen: true }),
  closeRunDetailsModal: () => set({ runDetailsModalOpen: false }),
}));
