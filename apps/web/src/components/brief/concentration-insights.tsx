"use client";

import type { ConcentrationInsight } from "@/types";

interface ConcentrationInsightsProps {
  insights: ConcentrationInsight[];
}

export function ConcentrationInsights({ insights }: ConcentrationInsightsProps) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
      <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-4">
        Concentration Risk
      </h2>
      <ul className="space-y-3">
        {insights.map((insight, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm">
            <span className="text-amber-400 mt-0.5">⚠</span>
            <span className="text-foreground">{insight.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
