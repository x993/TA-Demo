"use client";

import { useState } from "react";
import {
  Clock,
  Settings,
  Pencil,
  Key,
  Bell,
  Sliders,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { focusAreaOptions } from "@/lib/mock-data";
import type { ScanConfig, ScanFrequency } from "@/types";

interface ScanConfigPanelProps {
  config: ScanConfig;
  onConfigChange: (config: ScanConfig) => void;
  onEditPrompts: () => void;
  onManageKeys: () => void;
}

const frequencyOptions: { value: ScanFrequency; label: string; description: string }[] = [
  { value: "continuous", label: "Continuous", description: "Real-time monitoring" },
  { value: "hourly", label: "Hourly", description: "Every 60 minutes" },
  { value: "daily", label: "Daily", description: "Once per day" },
  { value: "weekly", label: "Weekly", description: "Once per week" },
];

export function ScanConfigPanel({
  config,
  onConfigChange,
  onEditPrompts,
  onManageKeys,
}: ScanConfigPanelProps) {
  const handleFrequencyChange = (frequency: ScanFrequency) => {
    onConfigChange({ ...config, frequency });
  };

  const handleFocusAreaToggle = (areaId: string) => {
    const focusAreas = config.focusAreas.includes(areaId)
      ? config.focusAreas.filter((a) => a !== areaId)
      : [...config.focusAreas, areaId];
    onConfigChange({ ...config, focusAreas });
  };

  const handleNotifyToggle = () => {
    onConfigChange({ ...config, notifyOnAlerts: !config.notifyOnAlerts });
  };

  return (
    <aside className="w-72 border-l border-border/50 bg-muted/10 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Settings className="h-3.5 w-3.5" />
          Configuration
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Frequency Section */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Scan Frequency
          </h4>
          <div className="space-y-2">
            {frequencyOptions.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors",
                  config.frequency === option.value
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50 border border-transparent"
                )}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={option.value}
                  checked={config.frequency === option.value}
                  onChange={() => handleFrequencyChange(option.value)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                    config.frequency === option.value
                      ? "border-primary"
                      : "border-border"
                  )}
                >
                  {config.frequency === option.value && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground block">
                    {option.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Focus Areas Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sliders className="h-4 w-4 text-muted-foreground" />
              Focus Areas
            </h4>
          </div>
          <div className="space-y-1.5">
            {focusAreaOptions.map((area) => {
              const isSelected = config.focusAreas.includes(area.id);
              return (
                <label
                  key={area.id}
                  className="flex items-center gap-2.5 py-2 px-2.5 rounded-md cursor-pointer hover:bg-muted/30 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleFocusAreaToggle(area.id)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-border group-hover:border-muted-foreground"
                    )}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-sm text-foreground">{area.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Custom Prompts Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              Custom Prompts
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Customize how the AI analyzes your portfolio data.
          </p>
          <button
            onClick={onEditPrompts}
            className="w-full py-2 px-3 rounded-lg text-sm font-medium border border-border hover:bg-muted/50 transition-colors"
          >
            Edit Prompts
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Notifications Section */}
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              Notifications
            </h4>
          </div>
          <label className="flex items-center justify-between mt-3 cursor-pointer group">
            <span className="text-sm text-foreground">Alert on new findings</span>
            <button
              onClick={handleNotifyToggle}
              className={cn(
                "w-10 h-6 rounded-full p-1 transition-colors",
                config.notifyOnAlerts ? "bg-primary" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-white transition-transform",
                  config.notifyOnAlerts && "translate-x-4"
                )}
              />
            </button>
          </label>
        </div>
      </div>

      {/* API Keys Footer */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={onManageKeys}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium border border-border hover:bg-muted/50 transition-colors"
        >
          <Key className="h-4 w-4" />
          Manage API Keys
        </button>
      </div>
    </aside>
  );
}
