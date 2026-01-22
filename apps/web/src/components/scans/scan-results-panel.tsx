"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Eye, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

interface TenantResult {
  id: string;
  name: string;
  status: "critical" | "watch" | "stable" | "improving";
  findingsCount: number;
  scoreChange: number;
  findings: string[];
}

interface ScanResult {
  id: string;
  date: string;
  time: string;
  tenantsScanned: number;
  alertsGenerated: number;
  tenants: TenantResult[];
}

const mockScanResults: ScanResult[] = [
  {
    id: "scan-1",
    date: "Today",
    time: "2:34 PM",
    tenantsScanned: 62,
    alertsGenerated: 3,
    tenants: [
      {
        id: "t1",
        name: "Apex Retail Group",
        status: "watch",
        findingsCount: 2,
        scoreChange: -5,
        findings: ["New SEC filing detected", "Payment history updated"],
      },
      {
        id: "t2",
        name: "Northstar Holdings",
        status: "critical",
        findingsCount: 3,
        scoreChange: -12,
        findings: ["Bankruptcy filing detected", "Credit downgrade", "News: Restructuring announced"],
      },
      {
        id: "t3",
        name: "Metro Grocers",
        status: "stable",
        findingsCount: 1,
        scoreChange: 0,
        findings: ["Quarterly report filed"],
      },
    ],
  },
  {
    id: "scan-2",
    date: "Yesterday",
    time: "10:15 AM",
    tenantsScanned: 62,
    alertsGenerated: 1,
    tenants: [
      {
        id: "t4",
        name: "TechCorp Solutions",
        status: "improving",
        findingsCount: 1,
        scoreChange: 8,
        findings: ["Credit score improvement"],
      },
      {
        id: "t5",
        name: "Greenleaf Industries",
        status: "stable",
        findingsCount: 0,
        scoreChange: 0,
        findings: [],
      },
    ],
  },
  {
    id: "scan-3",
    date: "Jan 18",
    time: "3:00 PM",
    tenantsScanned: 60,
    alertsGenerated: 2,
    tenants: [
      {
        id: "t6",
        name: "Summit Partners",
        status: "watch",
        findingsCount: 2,
        scoreChange: -3,
        findings: ["Litigation alert", "D&B report updated"],
      },
    ],
  },
];

const statusConfig = {
  critical: { color: "bg-negative", textColor: "text-negative", label: "Critical" },
  watch: { color: "bg-amber-500", textColor: "text-amber-500", label: "Watch" },
  stable: { color: "bg-positive", textColor: "text-positive", label: "Stable" },
  improving: { color: "bg-blue-500", textColor: "text-blue-500", label: "Improving" },
};

export function ScanResultsPanel() {
  const [expandedScans, setExpandedScans] = useState<string[]>(["scan-1"]);
  const [expandedTenants, setExpandedTenants] = useState<string[]>([]);

  const toggleScan = (scanId: string) => {
    setExpandedScans((prev) =>
      prev.includes(scanId) ? prev.filter((id) => id !== scanId) : [...prev, scanId]
    );
  };

  const toggleTenant = (tenantId: string) => {
    setExpandedTenants((prev) =>
      prev.includes(tenantId) ? prev.filter((id) => id !== tenantId) : [...prev, tenantId]
    );
  };

  const getScoreChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-positive" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-negative" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <aside className="w-72 border-r border-border/50 bg-muted/30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-foreground">Recent Results</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Quick view of scan findings</p>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {mockScanResults.map((scan) => {
          const isExpanded = expandedScans.includes(scan.id);

          return (
            <div
              key={scan.id}
              className="rounded-lg border border-border/50 bg-card overflow-hidden"
            >
              {/* Scan Header */}
              <button
                onClick={() => toggleScan(scan.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="text-left">
                    <div className="text-xs font-medium text-foreground">{scan.date}</div>
                    <div className="text-[10px] text-muted-foreground">{scan.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {scan.alertsGenerated > 0 && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-negative/10 text-negative">
                      <AlertTriangle className="h-3 w-3" />
                      {scan.alertsGenerated}
                    </span>
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  <div className="text-[10px] text-muted-foreground mb-2">
                    {scan.tenantsScanned} tenants scanned
                  </div>

                  {scan.tenants.map((tenant) => {
                    const config = statusConfig[tenant.status];
                    const isTenantExpanded = expandedTenants.includes(tenant.id);

                    return (
                      <div
                        key={tenant.id}
                        className="rounded-md border border-border/30 bg-background/50"
                      >
                        <button
                          onClick={() => toggleTenant(tenant.id)}
                          className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-muted/30 transition-colors"
                        >
                          <div className={cn("w-2 h-2 rounded-full", config.color)} />
                          <span className="text-xs font-medium text-foreground flex-1 text-left truncate">
                            {tenant.name}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {tenant.findingsCount > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                {tenant.findingsCount} findings
                              </span>
                            )}
                            {tenant.scoreChange !== 0 && (
                              <span className={cn(
                                "flex items-center text-[10px] font-medium",
                                tenant.scoreChange > 0 ? "text-positive" : "text-negative"
                              )}>
                                {getScoreChangeIcon(tenant.scoreChange)}
                                {Math.abs(tenant.scoreChange)}
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Tenant Findings */}
                        {isTenantExpanded && tenant.findings.length > 0 && (
                          <div className="px-2.5 pb-2 space-y-1">
                            {tenant.findings.map((finding, idx) => (
                              <div
                                key={idx}
                                className="text-[10px] text-muted-foreground pl-4 border-l-2 border-border/50"
                              >
                                {finding}
                              </div>
                            ))}
                            <button className="flex items-center gap-1 text-[10px] text-primary hover:underline mt-1 pl-4">
                              <Eye className="h-3 w-3" />
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
