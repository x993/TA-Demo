"use client";

import Link from "next/link";
import { AlertCircle, TrendingUp } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PortfolioVerdict, StatusChanges } from "@/types";

interface PortfolioVerdictProps {
  verdict: PortfolioVerdict;
  statusChanges?: StatusChanges;
}

export function PortfolioVerdictCard({ verdict, statusChanges }: PortfolioVerdictProps) {
  // Get top tenants requiring attention (critical first, then watch)
  const attentionTenants = statusChanges?.toWatchOrCritical
    .sort((a, b) => {
      if (a.newStatus === "critical" && b.newStatus !== "critical") return -1;
      if (a.newStatus !== "critical" && b.newStatus === "critical") return 1;
      return 0;
    })
    .slice(0, 3) || [];

  // Get improving tenants
  const improvingTenants = statusChanges?.toImproving.slice(0, 2) || [];

  const hasEvidence = attentionTenants.length > 0 || improvingTenants.length > 0;

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-primary/20">
        <h3 className="text-base font-semibold text-foreground">
          Portfolio Status
        </h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Summary statement */}
        <p className="text-sm text-foreground leading-relaxed">
          {verdict.statement}
        </p>

        {/* Tenant Evidence */}
        {hasEvidence && (
          <div className="mt-4 space-y-4">
          {/* Requires Attention */}
          {attentionTenants.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="h-3.5 w-3.5 text-warning" />
                <span className="text-xs font-medium text-warning">
                  Requires Attention ({attentionTenants.length})
                </span>
              </div>
              <div className="space-y-2">
                {attentionTenants.map((tenant) => (
                  <Link
                    key={tenant.tenantId}
                    href={`/tenants/${tenant.tenantId}`}
                    className="block p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 hover:border-border transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {tenant.tenantName}
                      </span>
                      <StatusBadge status={tenant.newStatus} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {tenant.eventHeadline}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Improving */}
          {improvingTenants.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-positive" />
                <span className="text-xs font-medium text-positive">
                  Improving ({improvingTenants.length})
                </span>
              </div>
              <div className="space-y-2">
                {improvingTenants.map((tenant) => (
                  <Link
                    key={tenant.tenantId}
                    href={`/tenants/${tenant.tenantId}`}
                    className="block p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 hover:border-border transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {tenant.tenantName}
                      </span>
                      <StatusBadge status={tenant.newStatus} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {tenant.eventHeadline}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}
