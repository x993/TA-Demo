"use client";

import type { PortfolioVerdict } from "@/types";

interface PortfolioVerdictProps {
  verdict: PortfolioVerdict;
}

export function PortfolioVerdictCard({ verdict }: PortfolioVerdictProps) {
  // Determine border/accent color based on direction
  const getAccentColor = () => {
    switch (verdict.direction) {
      case "increased":
        return "border-negative/30 bg-negative/5";
      case "decreased":
        return "border-positive/30 bg-positive/5";
      default:
        return "border-border bg-card";
    }
  };

  const getDirectionIcon = () => {
    switch (verdict.direction) {
      case "increased":
        return "↗";
      case "decreased":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <div className={`rounded-xl border p-5 ${getAccentColor()}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{getDirectionIcon()}</span>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Portfolio Status
        </h2>
      </div>
      <p className="text-sm text-foreground leading-relaxed">
        {verdict.statement}
      </p>
    </div>
  );
}
