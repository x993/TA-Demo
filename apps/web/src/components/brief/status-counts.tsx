"use client";

import Link from "next/link";
import { AlertTriangle, Eye, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusCounts as StatusCountsType, TenantStatus } from "@/types";

interface StatusCountsProps {
  counts: StatusCountsType;
}

const statusConfig: Record<
  TenantStatus,
  {
    label: string;
    description: string;
    icon: React.ElementType;
    iconBgClass: string;
    iconColorClass: string;
  }
> = {
  critical: {
    label: "Critical",
    description: "severe disclosures",
    icon: AlertTriangle,
    iconBgClass: "bg-negative/20",
    iconColorClass: "text-negative",
  },
  watch: {
    label: "Watch",
    description: "notable disclosures",
    icon: Eye,
    iconBgClass: "bg-warning/20",
    iconColorClass: "text-warning",
  },
  stable: {
    label: "Stable",
    description: "no material events",
    icon: CheckCircle,
    iconBgClass: "bg-muted",
    iconColorClass: "text-muted-foreground",
  },
  improving: {
    label: "Improving",
    description: "positive disclosures",
    icon: TrendingUp,
    iconBgClass: "bg-positive/20",
    iconColorClass: "text-positive",
  },
};

export function StatusCounts({ counts }: StatusCountsProps) {
  const statuses: TenantStatus[] = ["critical", "watch", "stable", "improving"];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statuses.map((status, index) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        const count = counts[status];

        return (
          <Link
            key={status}
            href={`/tenants?status=${status}`}
            className="rounded-xl border border-white/5 bg-gradient-to-br from-muted/50 to-muted/20 p-4 hover-lift transition-all hover:border-white/10 hover:shadow-lg group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("p-1.5 rounded-lg", config.iconBgClass)}>
                <Icon className={cn("h-4 w-4", config.iconColorClass)} />
              </div>
              <span className="text-sm text-muted-foreground">{config.label}</span>
            </div>
            <div className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
              {count}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {config.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
