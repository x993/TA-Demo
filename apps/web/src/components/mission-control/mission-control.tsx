'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Clock, RefreshCw, Pause, Play, ChevronDown, Activity, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from './status-indicator';
import { useUIStore } from '@/stores/ui-store';
import type { StatusCounts, CoverageStatement, ScanFrequency } from '@/types';
import { useState, useEffect, useCallback } from 'react';

interface MissionControlProps {
  statusCounts: StatusCounts;
  coverage: CoverageStatement;
}

const frequencyLabels: Record<ScanFrequency, string> = {
  continuous: 'Continuous',
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
};

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(Math.abs(diffMs) / (1000 * 60));
  const isFuture = diffMs < 0;

  if (diffMins < 1) return isFuture ? 'now' : 'just now';
  if (diffMins < 60) return isFuture ? `${diffMins}m` : `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return isFuture ? `${diffHours}h` : `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return isFuture ? `${diffDays}d` : `${diffDays}d ago`;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function MissionControl({ statusCounts, coverage }: MissionControlProps) {
  const {
    monitoringStatus,
    scanFrequency,
    lastScanTime,
    nextScheduledScan,
    scanProgress,
    toggleMonitoring,
    setScanFrequency,
    startScan,
    completeScan,
    updateScanProgress,
  } = useUIStore();

  const [showFrequencyMenu, setShowFrequencyMenu] = useState(false);

  // Simulate scan progress when scanning
  useEffect(() => {
    if (monitoringStatus !== 'scanning') return;

    const interval = setInterval(() => {
      updateScanProgress(scanProgress + 5);
      if (scanProgress >= 95) {
        completeScan();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [monitoringStatus, scanProgress, updateScanProgress, completeScan]);

  const handleScanNow = useCallback(() => {
    startScan();
  }, [startScan]);

  const isActive = monitoringStatus === 'active';
  const isPaused = monitoringStatus === 'paused';
  const isScanning = monitoringStatus === 'scanning';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2 mb-1">
          <Eye className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">Portfolio Monitor</h2>
        </div>
        <p className="text-xs text-muted-foreground">Tenant credit surveillance</p>
      </div>

      {/* Status Section */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <StatusIndicator status={monitoringStatus} size="lg" />
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </p>
            <p className={cn(
              "text-lg font-bold",
              isActive && "text-positive",
              isPaused && "text-warning",
              isScanning && "text-primary"
            )}>
              {isActive && 'Active'}
              {isPaused && 'Paused'}
              {isScanning && 'Scanning...'}
            </p>
          </div>
        </div>

        {/* Scanning progress bar */}
        {isScanning && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-medium">{scanProgress}%</span>
            </div>
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleScanNow}
            disabled={isScanning}
            className="flex-1 gap-1.5"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isScanning && 'animate-spin')} />
            Scan Now
          </Button>
          <Button
            variant={isPaused ? 'default' : 'outline'}
            size="sm"
            onClick={toggleMonitoring}
            disabled={isScanning}
            className="flex-1 gap-1.5"
          >
            {isActive || isScanning ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Resume
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="p-4 border-b border-border/50">
        <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Schedule
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Last scan</span>
            </div>
            <span className="text-sm font-medium tabular-nums">
              {formatRelativeTime(lastScanTime)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Next scan</span>
            </div>
            <span className="text-sm font-medium tabular-nums">
              {formatRelativeTime(nextScheduledScan)}
            </span>
          </div>

          {/* Frequency selector */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Frequency</span>
            <div className="relative">
              <button
                onClick={() => setShowFrequencyMenu(!showFrequencyMenu)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
              >
                {frequencyLabels[scanFrequency]}
                <ChevronDown className="h-3 w-3" />
              </button>
              {showFrequencyMenu && (
                <div className="absolute top-full mt-1 right-0 bg-card border border-border rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
                  {(Object.keys(frequencyLabels) as ScanFrequency[]).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => {
                        setScanFrequency(freq);
                        setShowFrequencyMenu(false);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-1.5 text-sm hover:bg-muted/50 transition-colors',
                        scanFrequency === freq && 'text-primary font-medium'
                      )}
                    >
                      {frequencyLabels[freq]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="p-4 border-b border-border/50">
        <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Risk Distribution
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-negative" />
              <span className="text-sm">Critical</span>
            </div>
            <span className="text-lg font-bold tabular-nums text-negative">
              {statusCounts.critical}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-sm">Watch</span>
            </div>
            <span className="text-lg font-bold tabular-nums text-warning">
              {statusCounts.watch}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-muted-foreground/50" />
              <span className="text-sm">Stable</span>
            </div>
            <span className="text-lg font-bold tabular-nums text-muted-foreground">
              {statusCounts.stable}
            </span>
          </div>
          {statusCounts.improving > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-positive" />
                <span className="text-sm">Improving</span>
              </div>
              <span className="text-lg font-bold tabular-nums text-positive">
                {statusCounts.improving}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Coverage Section - Full details */}
      <div className="p-4 mt-auto bg-muted/20">
        <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Coverage
        </h3>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">{coverage.tenantsMonitored}</span>
            <span className="text-muted-foreground"> tenants monitored · </span>
            <span className="font-semibold">{coverage.tenantsWithDisclosures}</span>
            <span className="text-muted-foreground"> had material disclosures</span>
          </p>

          <p className="text-muted-foreground text-xs">
            Sources: {coverage.sources.join(' · ')}
          </p>

          <p className="text-muted-foreground text-xs">
            As of {formatDate(coverage.asOfDate)}
          </p>
        </div>
      </div>
    </div>
  );
}
