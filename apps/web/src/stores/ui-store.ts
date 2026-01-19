"use client";

import { create } from "zustand";
import type { DemoRole, PanelType, MonitoringStatus, ScanFrequency } from "@/types";
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

  // Mission Control / Monitoring state
  monitoringStatus: MonitoringStatus;
  scanFrequency: ScanFrequency;
  lastScanTime: string;
  nextScheduledScan: string;
  scanProgress: number;
  setMonitoringStatus: (status: MonitoringStatus) => void;
  setScanFrequency: (frequency: ScanFrequency) => void;
  toggleMonitoring: () => void;
  startScan: () => void;
  completeScan: () => void;
  updateScanProgress: (progress: number) => void;
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

  // Mission Control / Monitoring state
  monitoringStatus: 'active',
  scanFrequency: 'hourly',
  lastScanTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
  nextScheduledScan: new Date(Date.now() + 58 * 60 * 1000).toISOString(), // 58 min from now
  scanProgress: 0,
  setMonitoringStatus: (status) => set({ monitoringStatus: status }),
  setScanFrequency: (frequency) => set({ scanFrequency: frequency }),
  toggleMonitoring: () =>
    set((state) => ({
      monitoringStatus: state.monitoringStatus === 'active' ? 'paused' : 'active',
    })),
  startScan: () =>
    set({
      monitoringStatus: 'scanning',
      scanProgress: 0,
    }),
  completeScan: () =>
    set({
      monitoringStatus: 'active',
      scanProgress: 100,
      lastScanTime: new Date().toISOString(),
      nextScheduledScan: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }),
  updateScanProgress: (progress) => set({ scanProgress: progress }),
}));
