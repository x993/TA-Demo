"use client";

import { useState } from "react";
import {
  Check,
  X,
  Loader2,
  ChevronDown,
  Clock,
  AlertCircle,
  Users,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime, formatDateShort, formatDuration } from "@/lib/mock-data";
import type { Scan } from "@/types";

interface ScanHistoryProps {
  scans: Scan[];
  onViewDetails: (scanId: string) => void;
  onLoadMore: () => void;
  hasMore?: boolean;
}

function getStatusIcon(status: Scan["status"]) {
  switch (status) {
    case "done":
      return (
        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        </div>
      );
    case "failed":
      return (
        <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <X className="h-3.5 w-3.5 text-red-500" />
        </div>
      );
    case "running":
      return (
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
        </div>
      );
  }
}

function getStatusLabel(status: Scan["status"]) {
  switch (status) {
    case "done":
      return "Completed";
    case "failed":
      return "Failed";
    case "running":
      return "Running";
  }
}

export function ScanHistory({
  scans,
  onViewDetails,
  onLoadMore,
  hasMore = true,
}: ScanHistoryProps) {
  const [expandedScan, setExpandedScan] = useState<string | null>(null);

  // Group scans by date
  const groupedScans = scans.reduce((groups, scan) => {
    const date = formatDateShort(scan.startTime);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(scan);
    return groups;
  }, {} as Record<string, Scan[]>);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Scan History</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Timeline of completed and scheduled scans
        </p>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        {scans.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              No scan history
            </p>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Run your first scan to see the history here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedScans).map(([date, dateScans]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="text-xs font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-1">
                  {date}
                </div>

                {/* Scan Cards */}
                <div className="space-y-3">
                  {dateScans.map((scan) => {
                    const isExpanded = expandedScan === scan.id;

                    return (
                      <div
                        key={scan.id}
                        className={cn(
                          "rounded-lg border border-border/50 bg-card overflow-hidden transition-all",
                          isExpanded && "ring-1 ring-primary/20"
                        )}
                      >
                        {/* Scan Header */}
                        <button
                          onClick={() =>
                            setExpandedScan(isExpanded ? null : scan.id)
                          }
                          className="w-full p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors"
                        >
                          {getStatusIcon(scan.status)}

                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-medium text-foreground">
                                {formatTime(scan.startTime)}
                              </span>
                              <span
                                className={cn(
                                  "text-xs px-1.5 py-0.5 rounded-full",
                                  scan.status === "done" &&
                                    "bg-emerald-500/10 text-emerald-500",
                                  scan.status === "failed" &&
                                    "bg-red-500/10 text-red-500",
                                  scan.status === "running" &&
                                    "bg-primary/10 text-primary"
                                )}
                              >
                                {getStatusLabel(scan.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {scan.tenantsScanned} tenants
                              </span>
                              {scan.alertsGenerated > 0 && (
                                <span className="flex items-center gap-1 text-amber-500">
                                  <Bell className="h-3 w-3" />
                                  {scan.alertsGenerated} alerts
                                </span>
                              )}
                              {scan.duration && (
                                <span>
                                  {formatDuration(scan.duration)}
                                </span>
                              )}
                            </div>
                          </div>

                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-1 border-t border-border/50 bg-muted/10">
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Sources scanned
                                </span>
                                <span className="text-foreground">
                                  {scan.sources.length} sources
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {scan.sources.map((source) => (
                                  <span
                                    key={source}
                                    className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px] uppercase"
                                  >
                                    {source}
                                  </span>
                                ))}
                              </div>
                              {scan.status === "failed" && (
                                <div className="flex items-start gap-2 mt-2 p-2 rounded bg-red-500/10 text-red-500">
                                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                  <span>
                                    Scan failed due to connection timeout. Check
                                    your API keys and retry.
                                  </span>
                                </div>
                              )}
                              <button
                                onClick={() => onViewDetails(scan.id)}
                                className="w-full mt-2 py-1.5 rounded-md text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                              >
                                View Full Details
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Load More */}
            {hasMore && (
              <button
                onClick={onLoadMore}
                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
