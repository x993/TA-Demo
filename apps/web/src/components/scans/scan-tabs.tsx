"use client";

import { cn } from "@/lib/utils";
import { Activity, Settings2, History } from "lucide-react";

type ScanTab = "progress" | "configure" | "history";

interface ScanTabsProps {
  activeTab: ScanTab;
  onTabChange: (tab: ScanTab) => void;
}

const tabs = [
  { id: "progress" as const, label: "Scan Progress", icon: Activity },
  { id: "configure" as const, label: "Configure Scan", icon: Settings2 },
  { id: "history" as const, label: "Scan History", icon: History },
];

export function ScanTabs({ activeTab, onTabChange }: ScanTabsProps) {
  return (
    <div className="border-b border-border/50 bg-background px-6">
      <nav className="flex gap-1" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
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
}
