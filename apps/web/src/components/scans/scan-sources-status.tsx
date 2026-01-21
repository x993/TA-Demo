"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Loader2,
  Circle,
  AlertTriangle,
  Database,
  FileText,
  Newspaper,
  Scale,
  Building2,
  Settings,
} from "lucide-react";

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: "pending" | "connecting" | "scanning" | "complete" | "error";
  recordsFound?: number;
}

const initialSources: DataSource[] = [
  { id: "dnb", name: "D&B", description: "Credit reports & scores", icon: Database, status: "pending" },
  { id: "moodys", name: "Moody's", description: "Credit ratings", icon: Building2, status: "pending" },
  { id: "sec", name: "SEC Filings", description: "10-K, 10-Q, 8-K", icon: FileText, status: "pending" },
  { id: "news", name: "News & Press", description: "Media monitoring", icon: Newspaper, status: "pending" },
  { id: "courts", name: "Court Records", description: "Litigation alerts", icon: Scale, status: "pending" },
  { id: "custom", name: "Custom Sources", description: "Configured feeds", icon: Settings, status: "pending" },
];

interface ScanSourcesStatusProps {
  isScanning?: boolean;
}

export function ScanSourcesStatus({ isScanning = true }: ScanSourcesStatusProps) {
  const [sources, setSources] = useState<DataSource[]>(initialSources);

  // Simulate source status changes
  useEffect(() => {
    if (!isScanning) return;

    // Reset sources
    setSources(initialSources);

    const sourceTimings = [
      { id: "dnb", connectTime: 1000, scanTime: 4000, completeTime: 10000, records: 62 },
      { id: "moodys", connectTime: 1500, scanTime: 5000, completeTime: 13000, records: 58 },
      { id: "sec", connectTime: 2000, scanTime: 6000, completeTime: 16000, records: 24 },
      { id: "news", connectTime: 2500, scanTime: 8000, completeTime: 20000, records: 156 },
      { id: "courts", connectTime: 3000, scanTime: 10000, completeTime: 24000, records: 12 },
      { id: "custom", connectTime: 4000, scanTime: 12000, completeTime: 28000, records: 8 },
    ];

    sourceTimings.forEach(({ id, connectTime, scanTime, completeTime, records }) => {
      setTimeout(() => {
        setSources((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "connecting" } : s))
        );
      }, connectTime);
      setTimeout(() => {
        setSources((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "scanning" } : s))
        );
      }, scanTime);
      setTimeout(() => {
        setSources((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "complete", recordsFound: records } : s))
        );
      }, completeTime);
    });
  }, [isScanning]);

  const getStatusIcon = (status: DataSource["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-3.5 w-3.5 text-positive" />;
      case "connecting":
      case "scanning":
        return <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />;
      case "error":
        return <AlertTriangle className="h-3.5 w-3.5 text-negative" />;
      default:
        return <Circle className="h-3.5 w-3.5 text-muted-foreground/30" />;
    }
  };

  const getStatusText = (status: DataSource["status"]) => {
    switch (status) {
      case "connecting":
        return "Connecting...";
      case "scanning":
        return "Scanning...";
      case "complete":
        return "Complete";
      case "error":
        return "Error";
      default:
        return "Pending";
    }
  };

  const completedCount = sources.filter((s) => s.status === "complete").length;
  const totalRecords = sources.reduce((sum, s) => sum + (s.recordsFound || 0), 0);

  return (
    <aside className="w-72 border-r border-border/50 bg-muted/30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-foreground">Data Sources</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {completedCount}/{sources.length} sources scanned
        </p>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {sources.map((source) => {
          const Icon = source.icon;
          return (
            <div
              key={source.id}
              className="rounded-lg border border-border/50 bg-card overflow-hidden"
            >
              <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{source.name}</span>
                    {getStatusIcon(source.status)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{source.description}</div>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-t border-border/30">
                <span className={cn(
                  "text-[10px] font-medium",
                  source.status === "complete" && "text-positive",
                  source.status === "scanning" && "text-primary",
                  source.status === "connecting" && "text-amber-500",
                  source.status === "pending" && "text-muted-foreground"
                )}>
                  {getStatusText(source.status)}
                </span>
                {source.recordsFound !== undefined && (
                  <span className="text-[10px] text-muted-foreground">
                    {source.recordsFound} records
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="px-4 py-3 border-t border-border/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Records</span>
          <span className="font-semibold text-foreground">{totalRecords}</span>
        </div>
      </div>
    </aside>
  );
}
