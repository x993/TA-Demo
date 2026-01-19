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
    colorClass: string;
    iconColorClass: string;
  }
> = {
  critical: {
    label: "Critical",
    description: "severe disclosures",
    icon: AlertTriangle,
    colorClass: "text-negative",
    iconColorClass: "text-negative",
  },
  watch: {
    label: "Watch",
    description: "notable disclosures",
    icon: Eye,
    colorClass: "text-warning",
    iconColorClass: "text-warning",
  },
  stable: {
    label: "Stable",
    description: "no material events",
    icon: CheckCircle,
    colorClass: "text-muted-foreground",
    iconColorClass: "text-muted-foreground",
  },
  improving: {
    label: "Improving",
    description: "positive disclosures",
    icon: TrendingUp,
    colorClass: "text-positive",
    iconColorClass: "text-positive",
  },
};

export function StatusCounts({ counts }: StatusCountsProps) {
  const statuses: TenantStatus[] = ["critical", "watch", "stable", "improving"];

  return (
    <div className="grid grid-cols-2 gap-3">
      {statuses.map((status) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        const count = counts[status];

        return (
          <Link
            key={status}
            href={`/tenants?status=${status}`}
            className="rounded-xl border border-white/5 bg-gradient-to-br from-muted/50 to-muted/20 p-4 hover-lift transition-all hover:border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn("h-4 w-4", config.iconColorClass)} />
              <span className="text-sm text-muted-foreground">{config.label}</span>
            </div>
            <div className="text-3xl font-bold tracking-tight tabular-nums">
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
