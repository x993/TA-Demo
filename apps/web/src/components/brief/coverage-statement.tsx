import { formatDate } from "@/lib/utils";
import type { CoverageStatement as CoverageStatementType } from "@/types";

interface CoverageStatementProps {
  coverage: CoverageStatementType;
}

export function CoverageStatement({ coverage }: CoverageStatementProps) {
  return (
    <div className="text-xs text-muted-foreground text-center py-6 border-t border-border/50">
      <p>
        {coverage.tenantsMonitored} tenants monitored ·{" "}
        {coverage.tenantsWithDisclosures} had material disclosures
      </p>
      <p className="mt-1">
        Sources: {coverage.sources.join(", ")}
      </p>
      <p className="mt-1">As of {formatDate(coverage.asOfDate)}</p>
    </div>
  );
}
