"use client";

import { useState } from "react";
import { Play, Loader2, Activity, Settings2, History } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DataSourcesPanel,
  ScanConfigPanel,
  AddSourceModal,
  PromptEditorModal,
  ScanProgressTab,
  ConfigureScanTab,
  ScanResultsPanel,
  ScanInsightsPanel,
  ScanHistoryContent,
  ScanSourcesStatus,
  ScanLiveMetrics,
} from "@/components/scans";
import {
  mockDataSources,
  mockScans,
  mockScanConfig,
} from "@/lib/mock-data";
import type { DataSourceCategory, ScanConfig } from "@/types";

type ScanTab = "progress" | "configure" | "history";

const tabs = [
  { id: "progress" as const, label: "Progress", icon: Activity },
  { id: "configure" as const, label: "Configure", icon: Settings2 },
  { id: "history" as const, label: "History", icon: History },
];

export default function ScansPage() {
  // State
  const [dataSources, setDataSources] = useState<DataSourceCategory[]>(mockDataSources);
  const [config, setConfig] = useState<ScanConfig>(mockScanConfig);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<ScanTab>("progress");

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
    }, 33000);
  };

  const handleViewScanDetails = (scanId: string) => {
    console.log("View scan details:", scanId);
  };

  const handleLoadMoreScans = () => {
    console.log("Load more scans");
  };

  const handleSavePrompt = (prompt: string) => {
    setConfig((prev) => ({ ...prev, customPrompt: prompt }));
  };

  const handleManageKeys = () => {
    console.log("Manage API keys");
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

  // Render tabs navigation
  const renderTabs = () => (
    <div className="px-4 py-3 border-b border-border/50">
      <nav className="flex gap-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );

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

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Progress Tab - With sidebars */}
        {activeTab === "progress" && (
          <>
            {/* Left Sidebar - Data Sources Status */}
            <ScanSourcesStatus isScanning={true} />

            {/* Center Content with Tabs */}
            <main className="flex-1 flex flex-col overflow-hidden bg-background">
              {renderTabs()}
              <div className="flex-1 overflow-hidden">
                <ScanProgressTab
                  isScanning={isScanning}
                  onCancelScan={() => setIsScanning(false)}
                  onViewResults={() => setActiveTab("history")}
                />
              </div>
            </main>

            {/* Right Sidebar - Live Metrics */}
            <ScanLiveMetrics isScanning={true} />
          </>
        )}

        {/* Configure Tab - With sidebars */}
        {activeTab === "configure" && (
          <>
            {/* Left Sidebar - Data Sources */}
            <DataSourcesPanel
              categories={dataSources}
              onToggleSource={handleToggleSource}
              onAddSource={handleAddSource}
            />

            {/* Center Content with Tabs */}
            <main className="flex-1 flex flex-col overflow-hidden bg-background">
              {renderTabs()}
              <div className="flex-1 overflow-hidden">
                <ConfigureScanTab onStartScan={handleStartScan} />
              </div>
            </main>

            {/* Right Sidebar - Config Panel */}
            <ScanConfigPanel
              config={config}
              onConfigChange={handleConfigChange}
              onEditPrompts={() => setPromptEditorOpen(true)}
              onManageKeys={handleManageKeys}
            />
          </>
        )}

        {/* History Tab - With sidebars */}
        {activeTab === "history" && (
          <>
            {/* Left Sidebar - Scan Results */}
            <ScanResultsPanel />

            {/* Center Content with Tabs */}
            <main className="flex-1 flex flex-col overflow-hidden bg-background">
              {renderTabs()}
              <div className="flex-1 overflow-hidden">
                <ScanHistoryContent
                  scans={mockScans}
                  onViewDetails={handleViewScanDetails}
                  onLoadMore={handleLoadMoreScans}
                  hasMore={true}
                />
              </div>
            </main>

            {/* Right Sidebar - Insights */}
            <ScanInsightsPanel />
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
