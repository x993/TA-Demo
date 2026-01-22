"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Building,
  Users,
  AlertTriangle,
  Pencil,
  MessageSquare,
  Share2,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRelativeTime } from "@/lib/mock-data";
import type { PortfolioEntity, EntityType, QuickAction } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TabValue = "all" | EntityType;

interface EntityListProps {
  entities: PortfolioEntity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onQuickAction: (id: string, action: QuickAction) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

const tabs: { value: TabValue; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "all", label: "All", icon: () => null },
  { value: "property", label: "Properties", icon: Building },
  { value: "tenant", label: "Tenants", icon: Users },
  { value: "alert", label: "Alerts", icon: AlertTriangle },
];

function getEntityIcon(type: EntityType) {
  switch (type) {
    case "property":
      return Building;
    case "tenant":
      return Users;
    case "alert":
      return AlertTriangle;
  }
}

export function EntityList({
  entities,
  selectedId,
  onSelect,
  onQuickAction,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}: EntityListProps) {
  // Filter entities based on active tab and search
  const filteredEntities = entities.filter((entity) => {
    // Tab filter
    if (activeTab !== "all" && entity.type !== activeTab) {
      return false;
    }
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        entity.name.toLowerCase().includes(query) ||
        entity.subtitle.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Count by type for tab badges
  const counts = entities.reduce(
    (acc, entity) => {
      acc[entity.type] = (acc[entity.type] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="border-b border-border/50 px-4">
        <div className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {tab.label}
                <span
                  className={cn(
                    "ml-1 text-xs px-1.5 py-0.5 rounded-full",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {counts[tab.value] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search entities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Entity List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEntities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              No entities found
            </p>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              {searchQuery
                ? "Try adjusting your search"
                : "No entities match the current filters"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredEntities.map((entity) => {
              const Icon = getEntityIcon(entity.type);
              const isSelected = selectedId === entity.id;

              return (
                <div
                  key={entity.id}
                  onClick={() => onSelect(entity.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-colors group",
                    isSelected
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : "hover:bg-muted/30 border-l-2 border-l-transparent"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={cn(
                          "p-2 rounded-lg shrink-0",
                          entity.type === "alert"
                            ? "bg-amber-500/10"
                            : "bg-muted"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            entity.type === "alert"
                              ? "text-amber-500"
                              : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm text-foreground truncate">
                            {entity.name}
                          </h3>
                          <StatusBadge status={entity.status} size="sm" />
                        </div>
                        <p className="text-xs text-muted-foreground truncate mb-2">
                          {entity.subtitle}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {Object.entries(entity.metadata)
                            .slice(0, 2)
                            .map(([key, value]) => (
                              <span key={key}>{String(value)}</span>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1">
                      {entity.lastActivity && (
                        <span className="text-xs text-muted-foreground hidden sm:block mr-2">
                          {formatRelativeTime(entity.lastActivity)}
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all focus:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAction(entity.id, "edit");
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAction(entity.id, "note");
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Note
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAction(entity.id, "share");
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAction(entity.id, "archive");
                            }}
                            className="text-muted-foreground"
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
