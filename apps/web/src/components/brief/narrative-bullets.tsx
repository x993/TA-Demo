"use client";

import type { NarrativeBullet } from "@/types";

interface NarrativeBulletsProps {
  bullets: NarrativeBullet[];
}

const priorityConfig = {
  1: { icon: "🔴", label: "Priority 1", className: "text-negative" },
  2: { icon: "🟡", label: "Priority 2", className: "text-amber-400" },
  3: { icon: "⚪", label: "Priority 3", className: "text-muted-foreground" },
};

export function NarrativeBullets({ bullets }: NarrativeBulletsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        What You Need to Know
      </h2>
      <ul className="space-y-4">
        {bullets.map((bullet, idx) => {
          const config = priorityConfig[bullet.priority as 1 | 2 | 3] || priorityConfig[3];
          return (
            <li key={idx} className="flex items-start gap-3">
              <span className="mt-0.5 text-sm">{config.icon}</span>
              <div className="flex-1">
                <p className={`text-sm leading-relaxed ${config.className === "text-muted-foreground" ? "text-foreground" : ""}`}>
                  {bullet.text}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
