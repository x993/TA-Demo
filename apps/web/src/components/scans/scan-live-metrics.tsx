"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Users,
  FileSearch,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Activity,
} from "lucide-react";

interface ScanLiveMetricsProps {
  isScanning?: boolean;
}

export function ScanLiveMetrics({ isScanning = true }: ScanLiveMetricsProps) {
  const [tenantsScanned, setTenantsScanned] = useState(0);
  const [findingsCount, setFindingsCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);
  const [upgradesCount, setUpgradesCount] = useState(0);
  const [downgradesCount, setDowngradesCount] = useState(0);
  const [scanRate, setScanRate] = useState(0);
  const scanRateRef = useRef(0);

  // Simulate metrics changing during scan
  useEffect(() => {
    if (!isScanning) return;

    // Reset metrics
    setTenantsScanned(0);
    setFindingsCount(0);
    setAlertsCount(0);
    setUpgradesCount(0);
    setDowngradesCount(0);
    setScanRate(0);
    scanRateRef.current = 0;

    // Tenants scanned counter - spread across 33 seconds
    const tenantsInterval = setInterval(() => {
      setTenantsScanned((prev) => {
        if (prev >= 62) return 62;
        return prev + 1;
      });
    }, 500);

    // Findings counter - spread across 33 seconds
    const findingsTimings = [5000, 10000, 15000, 20000, 25000];
    findingsTimings.forEach((timing) => {
      setTimeout(() => {
        setFindingsCount((prev) => prev + 1);
      }, timing);
    });

    // Alerts counter
    setTimeout(() => setAlertsCount(1), 14000);
    setTimeout(() => setAlertsCount(2), 26000);

    // Score changes
    setTimeout(() => setUpgradesCount(1), 18000);
    setTimeout(() => setDowngradesCount(1), 12000);
    setTimeout(() => setDowngradesCount(2), 24000);

    // Scan rate simulation - smoother with gradual changes
    const targetRate = 35;
    const rateInterval = setInterval(() => {
      // Gradually approach target with small random variations
      const variation = (Math.random() - 0.5) * 4; // -2 to +2
      const newRate = Math.round(targetRate + variation);
      scanRateRef.current = newRate;
      setScanRate(newRate);
    }, 2000); // Update every 2 seconds instead of 500ms

    // Initial ramp up
    setTimeout(() => setScanRate(28), 500);
    setTimeout(() => setScanRate(32), 1000);
    setTimeout(() => setScanRate(35), 1500);

    return () => {
      clearInterval(tenantsInterval);
      clearInterval(rateInterval);
    };
  }, [isScanning]);

  return (
    <aside className="w-72 border-l border-border/50 bg-muted/30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Live Metrics</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Real-time scan statistics</p>
      </div>

      {/* Metrics */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {/* Main Metrics Cards */}
        <div className="rounded-lg border border-border/50 bg-card p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground tabular-nums">
                  {tenantsScanned}
                </span>
                <span className="text-xs text-muted-foreground">/62</span>
              </div>
              <div className="text-[10px] text-muted-foreground">Tenants Scanned</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-card p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileSearch className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground tabular-nums">{findingsCount}</div>
              <div className="text-[10px] text-muted-foreground">Findings</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-card p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-negative/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-negative" />
            </div>
            <div>
              <div className="text-2xl font-bold text-negative tabular-nums">{alertsCount}</div>
              <div className="text-[10px] text-muted-foreground">Alerts</div>
            </div>
          </div>
        </div>

        {/* Score Changes */}
        <div className="rounded-lg border border-border/50 bg-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Score Changes
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <TrendingUp className="h-4 w-4 text-positive" />
              <div>
                <div className="text-lg font-bold text-positive tabular-nums">{upgradesCount}</div>
                <div className="text-[10px] text-muted-foreground">Upgrades</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <TrendingDown className="h-4 w-4 text-negative" />
              <div>
                <div className="text-lg font-bold text-negative tabular-nums">{downgradesCount}</div>
                <div className="text-[10px] text-muted-foreground">Downgrades</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scan Rate */}
        <div className="rounded-lg border border-border/50 bg-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Scan Rate
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground tabular-nums">{scanRate}</span>
            <span className="text-xs text-muted-foreground">records/sec</span>
          </div>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((scanRate / 50) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-border/50 bg-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Activity
            </span>
          </div>
          <div className="space-y-1.5">
            {findingsCount > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-muted-foreground">New finding detected</span>
              </div>
            )}
            {alertsCount > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-negative" />
                <span className="text-muted-foreground">Alert generated</span>
              </div>
            )}
            {downgradesCount > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-muted-foreground">Score change recorded</span>
              </div>
            )}
            {findingsCount === 0 && alertsCount === 0 && downgradesCount === 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
                <span className="text-muted-foreground">Scanning...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
