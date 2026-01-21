"use client";

import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import {
  DataSourcesPanel,
  ScanHistory,
  ScanConfigPanel,
  AddSourceModal,
  PromptEditorModal,
  ScanTabs,
  ScanProgressTab,
  ConfigureScanTab,
} from "@/components/scans";
import {
  mockDataSources,
  mockScans,
  mockScanConfig,
} from "@/lib/mock-data";
import type { DataSourceCategory, ScanConfig } from "@/types";

type ScanTab = "progress" | "configure" | "history";

export default function ScansPage() {
  // State
  const [dataSources, setDataSources] = useState<DataSourceCategory[]>(mockDataSources);
  const [config, setConfig] = useState<ScanConfig>(mockScanConfig);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<ScanTab>("history");

  // Modal states
  const [addSourceModalOpen, setAddSourceModalOpen] = useState(false);
  const [addSourceType, setAddSourceType] = useState<"api" | "upload" | "database" | null>(null);
  const [promptEditorOpen, setPromptEditorOpen] = useState(false);

  // Handlers
  const handleToggleSource = (sourceId: string, enabled: boolean) => {
    setDataSources((prev) =>
      prev.map((category) => ({
        ...category,
        sources: category.sources.map((source) =>
          source.id === sourceId ? { ...source, enabled } : source
        ),
      }))
    );
  };

  const handleAddSource = (type: "api" | "upload" | "database") => {
    setAddSourceType(type);
    setAddSourceModalOpen(true);
  };

  const handleConfigChange = (newConfig: ScanConfig) => {
    setConfig(newConfig);
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setActiveTab("progress");
    // Simulate scan
    setTimeout(() => {
      setIsScanning(false);
    }, 15000);
  };

  const handleViewScanDetails = (scanId: string) => {
    console.log("View scan details:", scanId);
    // In a real app, this would navigate to scan details or open a modal
  };

  const handleLoadMoreScans = () => {
    console.log("Load more scans");
    // In a real app, this would fetch more scans
  };

  const handleSavePrompt = (prompt: string) => {
    setConfig((prev) => ({ ...prev, customPrompt: prompt }));
  };

  const handleManageKeys = () => {
    console.log("Manage API keys");
    // In a real app, this would open an API key management modal
  };

  const handleStartScan = (scanConfig: {
    tenantSelection: 'all' | 'by_status' | 'custom';
    selectedStatuses: string[];
    selectedTenantIds: string[];
    selectedPropertyIds: string[];
    dataSources: string[];
    dateRange: { from: Date; to: Date };
  }) => {
    console.log("Starting scan with config:", scanConfig);
    handleRunScan();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Page Header */}
      <header className="border-b border-border/50 bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Scans
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Configure monitoring sources and scan frequency
            </p>
          </div>

          {/* Run Scan Button */}
          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Scan Now
              </>
            )}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <ScanTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === "progress" && (
          <ScanProgressTab
            isScanning={isScanning}
            onCancelScan={() => setIsScanning(false)}
          />
        )}

        {activeTab === "configure" && (
          <ConfigureScanTab
            onStartScan={handleStartScan}
          />
        )}

        {activeTab === "history" && (
          <>
            {/* Left Panel - Data Sources */}
            <DataSourcesPanel
              categories={dataSources}
              onToggleSource={handleToggleSource}
              onAddSource={handleAddSource}
            />

            {/* Center - Scan History */}
            <main className="flex-1 flex flex-col overflow-hidden bg-background">
              <ScanHistory
                scans={mockScans}
                onViewDetails={handleViewScanDetails}
                onLoadMore={handleLoadMoreScans}
                hasMore={true}
              />
            </main>

            {/* Right Panel - Configuration */}
            <ScanConfigPanel
              config={config}
              onConfigChange={handleConfigChange}
              onEditPrompts={() => setPromptEditorOpen(true)}
              onManageKeys={handleManageKeys}
            />
          </>
        )}
      </div>

      {/* Modals */}
      <AddSourceModal
        open={addSourceModalOpen}
        onClose={() => {
          setAddSourceModalOpen(false);
          setAddSourceType(null);
        }}
        initialType={addSourceType}
      />

      <PromptEditorModal
        open={promptEditorOpen}
        onClose={() => setPromptEditorOpen(false)}
        initialPrompt={config.customPrompt}
        onSave={handleSavePrompt}
      />
    </div>
  );
}
