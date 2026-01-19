"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { StatusChanges as StatusChangesType } from "@/types";

interface StatusChangesProps {
  changes: StatusChangesType;
}

export function StatusChanges({ changes }: StatusChangesProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toWatchOrCriticalCount = changes.toWatchOrCritical.length;
  const toImprovingCount = changes.toImproving.length;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-base font-semibold text-foreground mb-4">
        Status Updates
      </h3>

      <div className="space-y-1">
        {/* Moved to Watch/Critical */}
        {toWatchOrCriticalCount > 0 && (
          <div>
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === "negative" ? null : "negative"
                )
              }
              className="flex items-start gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
            >
              <div className="p-1 rounded bg-warning/20 mt-0.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {toWatchOrCriticalCount} moved to Watch or Critical
                </p>
                <p className="text-xs text-muted-foreground">
                  New material disclosures
                </p>
              </div>
              <ChevronRight
                className={`h-4 w-4 text-muted-foreground mt-1 transition-transform duration-200 ${
                  expandedSection === "negative" ? "rotate-90" : ""
                }`}
              />
            </button>

            {expandedSection === "negative" && (
              <div className="ml-10 mt-2 space-y-2 pb-2 animate-fade-in">
                {changes.toWatchOrCritical.map((change) => (
                  <Link
                    key={change.tenantId}
                    href={`/tenants/${change.tenantId}`}
                    className="block p-3 rounded-lg border border-border bg-background/50 hover:bg-muted/50 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {change.tenantName}
                      </span>
                      <StatusBadge status={change.newStatus} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {change.eventHeadline}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Moved to Improving */}
        {toImprovingCount > 0 && (
          <div>
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === "positive" ? null : "positive"
                )
              }
              className="flex items-start gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
            >
              <div className="p-1 rounded bg-positive/20 mt-0.5">
                <ArrowDownRight className="h-3.5 w-3.5 text-positive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {toImprovingCount} moved to Improving
                </p>
                <p className="text-xs text-muted-foreground">
                  Positive disclosures
                </p>
              </div>
              <ChevronRight
                className={`h-4 w-4 text-muted-foreground mt-1 transition-transform duration-200 ${
                  expandedSection === "positive" ? "rotate-90" : ""
                }`}
              />
            </button>

            {expandedSection === "positive" && (
              <div className="ml-10 mt-2 space-y-2 pb-2 animate-fade-in">
                {changes.toImproving.map((change) => (
                  <Link
                    key={change.tenantId}
                    href={`/tenants/${change.tenantId}`}
                    className="block p-3 rounded-lg border border-border bg-background/50 hover:bg-muted/50 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {change.tenantName}
                      </span>
                      <StatusBadge status={change.newStatus} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {change.eventHeadline}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Unchanged */}
        <div className="flex items-start gap-3 p-3 text-muted-foreground">
          <div className="p-1 rounded bg-muted mt-0.5">
            <Minus className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1">
            <p className="text-sm">{changes.unchanged} unchanged</p>
            <p className="text-xs">No new material events</p>
          </div>
        </div>
      </div>
    </div>
  );
}
