"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap
} from "lucide-react";

interface PerformanceMetric {
  label: string;
  value: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
}

interface AlertTrend {
  day: string;
  count: number;
}

const performanceMetrics: PerformanceMetric[] = [
  {
    label: "Success Rate",
    value: "99.2%",
    icon: CheckCircle,
    trend: { value: 0.3, isPositive: true },
  },
  {
    label: "Avg Duration",
    value: "2m 34s",
    icon: Clock,
    trend: { value: 12, isPositive: true },
  },
  {
    label: "Alerts / Scan",
    value: "2.4",
    icon: AlertTriangle,
    trend: { value: 0.8, isPositive: false },
  },
];

const alertTrends: AlertTrend[] = [
  { day: "Mon", count: 3 },
  { day: "Tue", count: 2 },
  { day: "Wed", count: 5 },
  { day: "Thu", count: 1 },
  { day: "Fri", count: 4 },
  { day: "Sat", count: 2 },
  { day: "Sun", count: 3 },
];

const thirtyDayTotals = {
  scansCompleted: 87,
  alertsGenerated: 142,
  tenantsMonitored: 62,
  dataSourcesUsed: 6,
};

export function ScanInsightsPanel() {
  const maxAlertCount = Math.max(...alertTrends.map((t) => t.count));
  const totalAlerts = alertTrends.reduce((sum, t) => sum + t.count, 0);
  const avgAlerts = (totalAlerts / alertTrends.length).toFixed(1);

  return (
    <aside className="w-72 border-l border-border/50 bg-muted/30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-foreground">Scan Insights</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Performance & trends</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Scan Performance */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Scan Performance
            </h3>
          </div>
          <div className="space-y-3">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-card"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{metric.label}</div>
                      <div className="text-sm font-semibold text-foreground">{metric.value}</div>
                    </div>
                  </div>
                  {metric.trend && (
                    <div className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      metric.trend.isPositive ? "text-positive" : "text-negative"
                    )}>
                      {metric.trend.isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {metric.trend.value}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Alert Trends */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Alert Trends
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">7 days</span>
          </div>

          {/* Mini bar chart */}
          <div className="p-3 rounded-lg border border-border/30 bg-card">
            <div className="flex items-end justify-between gap-1 h-16 mb-2">
              {alertTrends.map((trend, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className={cn(
                      "w-full rounded-sm transition-all",
                      trend.count > 3 ? "bg-amber-500" : "bg-primary/60"
                    )}
                    style={{ height: `${(trend.count / maxAlertCount) * 100}%`, minHeight: "4px" }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {alertTrends.map((trend, index) => (
                <span key={index} className="text-[10px] text-muted-foreground flex-1 text-center">
                  {trend.day}
                </span>
              ))}
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
              <span className="text-xs text-muted-foreground">Weekly avg</span>
              <span className="text-sm font-semibold text-foreground">{avgAlerts} alerts/day</span>
            </div>
          </div>
        </div>

        {/* 30-Day Totals */}
        <div>
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
            30-Day Totals
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg border border-border/30 bg-card text-center">
              <div className="text-2xl font-bold text-foreground">{thirtyDayTotals.scansCompleted}</div>
              <div className="text-[10px] text-muted-foreground">Scans</div>
            </div>
            <div className="p-3 rounded-lg border border-border/30 bg-card text-center">
              <div className="text-2xl font-bold text-foreground">{thirtyDayTotals.alertsGenerated}</div>
              <div className="text-[10px] text-muted-foreground">Alerts</div>
            </div>
            <div className="p-3 rounded-lg border border-border/30 bg-card text-center">
              <div className="text-2xl font-bold text-foreground">{thirtyDayTotals.tenantsMonitored}</div>
              <div className="text-[10px] text-muted-foreground">Tenants</div>
            </div>
            <div className="p-3 rounded-lg border border-border/30 bg-card text-center">
              <div className="text-2xl font-bold text-foreground">{thirtyDayTotals.dataSourcesUsed}</div>
              <div className="text-[10px] text-muted-foreground">Sources</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
