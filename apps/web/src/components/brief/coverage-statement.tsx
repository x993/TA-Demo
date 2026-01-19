import { formatDate } from "@/lib/utils";
import { Shield } from "lucide-react";
import type { CoverageStatement as CoverageStatementType } from "@/types";

interface CoverageStatementProps {
  coverage: CoverageStatementType;
}

export function CoverageStatement({ coverage }: CoverageStatementProps) {
  return (
    <footer className="text-xs text-muted-foreground text-center py-8 border-t border-border/30">
      <div className="flex items-center justify-center gap-1.5 mb-3">
        <Shield className="h-3.5 w-3.5" />
        <span className="font-medium">Coverage</span>
      </div>
      <p className="leading-relaxed">
        <span className="text-foreground font-medium tabular-nums">{coverage.tenantsMonitored}</span> tenants monitored
        <span className="mx-2 opacity-50">·</span>
        <span className="text-foreground font-medium tabular-nums">{coverage.tenantsWithDisclosures}</span> had material disclosures
      </p>
      <p className="mt-2 opacity-80">
        Sources: {coverage.sources.join(" · ")}
      </p>
      <p className="mt-2 opacity-60">
        As of {formatDate(coverage.asOfDate)}
      </p>
    </footer>
  );
}
