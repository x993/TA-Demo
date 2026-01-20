"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Clock,
  Plus,
  Database,
  Upload,
  Globe,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/mock-data";
import type { DataSourceCategory, DataSource } from "@/types";

interface DataSourcesPanelProps {
  categories: DataSourceCategory[];
  onToggleSource: (sourceId: string, enabled: boolean) => void;
  onAddSource: (type: "api" | "upload" | "database") => void;
}

function getStatusIcon(status: DataSource["status"]) {
  switch (status) {
    case "connected":
      return <Check className="h-3.5 w-3.5 text-emerald-500" />;
    case "error":
      return <X className="h-3.5 w-3.5 text-red-500" />;
    case "pending":
      return <Clock className="h-3.5 w-3.5 text-amber-500" />;
  }
}

export function DataSourcesPanel({
  categories,
  onToggleSource,
  onAddSource,
}: DataSourcesPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.filter((c) => c.expanded).map((c) => c.id))
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  return (
    <aside className="w-64 border-r border-border/50 bg-muted/20 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Globe className="h-3.5 w-3.5" />
          Data Sources
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const enabledCount = category.sources.filter((s) => s.enabled).length;

          return (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between w-full text-sm text-foreground hover:text-primary transition-colors mb-2"
              >
                <span className="flex items-center gap-2 font-medium">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {enabledCount}/{category.sources.length}
                </span>
              </button>

              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {category.sources.map((source) => (
                    <label
                      key={source.id}
                      className={cn(
                        "flex items-center gap-2.5 py-2 px-2.5 rounded-md cursor-pointer transition-colors group",
                        source.enabled
                          ? "bg-muted/30 hover:bg-muted/50"
                          : "hover:bg-muted/30"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={source.enabled}
                        onChange={(e) =>
                          onToggleSource(source.id, e.target.checked)
                        }
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                          source.enabled
                            ? "border-primary bg-primary"
                            : "border-border group-hover:border-muted-foreground"
                        )}
                      >
                        {source.enabled && (
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

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-foreground truncate">
                            {source.name}
                          </span>
                          {source.isPremium && (
                            <Crown className="h-3 w-3 text-amber-500 shrink-0" />
                          )}
                        </div>
                        {source.lastSync && (
                          <span className="text-[10px] text-muted-foreground">
                            {formatRelativeTime(source.lastSync)}
                          </span>
                        )}
                      </div>

                      <div className="shrink-0">
                        {getStatusIcon(source.status)}
                      </div>
                    </label>
                  ))}

                  {/* Add button for custom/internal categories */}
                  {(category.id === "custom" || category.id === "internal") && (
                    <button
                      onClick={() =>
                        onAddSource(
                          category.id === "custom" ? "api" : "database"
                        )
                      }
                      className="flex items-center gap-2 w-full py-2 px-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>
                        Add {category.id === "custom" ? "API" : "Data Source"}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <button
          onClick={() => onAddSource("api")}
          className="flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Database className="h-4 w-4" />
          <span>Connect API</span>
        </button>
        <button
          onClick={() => onAddSource("upload")}
          className="flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Dataset</span>
        </button>
      </div>
    </aside>
  );
}
