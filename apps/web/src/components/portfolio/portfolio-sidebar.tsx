"use client";

import { useState } from "react";
import {
  Building,
  Users,
  AlertTriangle,
  Plus,
  ChevronDown,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EntityFilterStatus, EntityType } from "@/types";

interface PortfolioSidebarProps {
  statusFilters: EntityFilterStatus[];
  typeFilters: EntityType[];
  onStatusFilterChange: (status: EntityFilterStatus[]) => void;
  onTypeFilterChange: (types: EntityType[]) => void;
  onAddEntity: (type: EntityType) => void;
  entityCounts: {
    properties: number;
    tenants: number;
    alerts: number;
    byStatus: Record<string, number>;
  };
}

const statusOptions: { value: EntityFilterStatus; label: string; color: string }[] = [
  { value: "critical", label: "Critical", color: "bg-red-500" },
  { value: "watch", label: "Watch", color: "bg-amber-500" },
  { value: "stable", label: "Stable", color: "bg-emerald-500" },
  { value: "improving", label: "Improving", color: "bg-blue-500" },
];

export function PortfolioSidebar({
  statusFilters,
  typeFilters,
  onStatusFilterChange,
  onTypeFilterChange,
  onAddEntity,
  entityCounts,
}: PortfolioSidebarProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [actionsExpanded, setActionsExpanded] = useState(true);

  const toggleStatusFilter = (status: EntityFilterStatus) => {
    if (statusFilters.includes(status)) {
      onStatusFilterChange(statusFilters.filter((s) => s !== status));
    } else {
      onStatusFilterChange([...statusFilters, status]);
    }
  };

  const toggleTypeFilter = (type: EntityType) => {
    if (typeFilters.includes(type)) {
      onTypeFilterChange(typeFilters.filter((t) => t !== type));
    } else {
      onTypeFilterChange([...typeFilters, type]);
    }
  };

  return (
    <aside className="w-64 border-r border-border/50 bg-muted/20 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Filters Section */}
        <div>
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5" />
              Filters
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                !filtersExpanded && "-rotate-90"
              )}
            />
          </button>

          {filtersExpanded && (
            <div className="space-y-4">
              {/* Status Filters */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <div className="space-y-1">
                  {statusOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={statusFilters.includes(option.value)}
                        onChange={() => toggleStatusFilter(option.value)}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                          statusFilters.includes(option.value)
                            ? "border-primary bg-primary"
                            : "border-border group-hover:border-muted-foreground"
                        )}
                      >
                        {statusFilters.includes(option.value) && (
                          <svg
                            className="w-3 h-3 text-primary-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <div
                        className={cn("w-2 h-2 rounded-full", option.color)}
                      />
                      <span className="text-sm text-foreground flex-1">
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {entityCounts.byStatus[option.value] || 0}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filters */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Type</span>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors group">
                    <input
                      type="checkbox"
                      checked={typeFilters.includes("property")}
                      onChange={() => toggleTypeFilter("property")}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                        typeFilters.includes("property")
                          ? "border-primary bg-primary"
                          : "border-border group-hover:border-muted-foreground"
                      )}
                    >
                      {typeFilters.includes("property") && (
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground flex-1">
                      Properties
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {entityCounts.properties}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors group">
                    <input
                      type="checkbox"
                      checked={typeFilters.includes("tenant")}
                      onChange={() => toggleTypeFilter("tenant")}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                        typeFilters.includes("tenant")
                          ? "border-primary bg-primary"
                          : "border-border group-hover:border-muted-foreground"
                      )}
                    >
                      {typeFilters.includes("tenant") && (
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground flex-1">
                      Tenants
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {entityCounts.tenants}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors group">
                    <input
                      type="checkbox"
                      checked={typeFilters.includes("alert")}
                      onChange={() => toggleTypeFilter("alert")}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                        typeFilters.includes("alert")
                          ? "border-primary bg-primary"
                          : "border-border group-hover:border-muted-foreground"
                      )}
                    >
                      {typeFilters.includes("alert") && (
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground flex-1">
                      Alerts
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {entityCounts.alerts}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Actions Section */}
        <div>
          <button
            onClick={() => setActionsExpanded(!actionsExpanded)}
            className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <Plus className="h-3.5 w-3.5" />
              Quick Add
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                !actionsExpanded && "-rotate-90"
              )}
            />
          </button>

          {actionsExpanded && (
            <div className="space-y-1">
              <button
                onClick={() => onAddEntity("property")}
                className="flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Building className="h-4 w-4" />
                <span>Add Property</span>
              </button>
              <button
                onClick={() => onAddEntity("tenant")}
                className="flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Add Tenant</span>
              </button>
              <button
                onClick={() => onAddEntity("alert")}
                className="flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Add Alert</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
