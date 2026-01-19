"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
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
    <Card className="p-4">
      <h3 className="text-sm font-medium text-foreground mb-4">
        Status Changes This Week
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
              className="flex items-start gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <ArrowUpRight className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {toWatchOrCriticalCount} moved to Watch or Critical
                </p>
                <p className="text-xs text-muted-foreground">
                  New material disclosures
                </p>
              </div>
              <ChevronRight
                className={`h-4 w-4 text-muted-foreground mt-1 transition-transform ${
                  expandedSection === "negative" ? "rotate-90" : ""
                }`}
              />
            </button>

            {expandedSection === "negative" && (
              <div className="ml-10 mt-2 space-y-2 pb-2">
                {changes.toWatchOrCritical.map((change) => (
                  <Link
                    key={change.tenantId}
                    href={`/tenants/${change.tenantId}`}
                    className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
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
              className="flex items-start gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <ArrowDownRight className="h-4 w-4 text-positive mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {toImprovingCount} moved to Improving
                </p>
                <p className="text-xs text-muted-foreground">
                  Positive disclosures
                </p>
              </div>
              <ChevronRight
                className={`h-4 w-4 text-muted-foreground mt-1 transition-transform ${
                  expandedSection === "positive" ? "rotate-90" : ""
                }`}
              />
            </button>

            {expandedSection === "positive" && (
              <div className="ml-10 mt-2 space-y-2 pb-2">
                {changes.toImproving.map((change) => (
                  <Link
                    key={change.tenantId}
                    href={`/tenants/${change.tenantId}`}
                    className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
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
          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm">{changes.unchanged} unchanged</p>
            <p className="text-xs">No new material events</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
