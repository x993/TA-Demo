"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  AlertTriangle,
  Newspaper,
  Zap,
} from "lucide-react";
import type {
  ConcentrationInsight,
  Event,
} from "@/types";

interface ActivityFeedProps {
  concentrationInsights?: ConcentrationInsight[];
  recentEvents: Event[];
}

type SectionKey = "concentration" | "events";

export function ActivityFeed({
  concentrationInsights,
  recentEvents,
}: ActivityFeedProps) {
  // All sections expanded by default
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(
    new Set(["concentration", "events"])
  );

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const concentrationCount = concentrationInsights?.length || 0;
  const eventsCount = recentEvents.length;

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden border-l-2 border-l-warning/60">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-warning/5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Zap className="h-4 w-4 text-warning" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-warning rounded-full animate-pulse" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">
            Activity Feed
          </h2>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {/* Risk Concentration Section */}
        {concentrationCount > 0 && (
          <FeedSection
            icon={<AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
            iconBg="bg-amber-500/20"
            title="Risk Concentration"
            count={concentrationCount}
            isExpanded={expandedSections.has("concentration")}
            onToggle={() => toggleSection("concentration")}
          >
            <div className="space-y-1.5">
              {concentrationInsights?.slice(0, 3).map((insight, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-muted/30"
                >
                  <p className="text-xs text-foreground line-clamp-2">
                    {insight.text}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {insight.affectedTenantIds.length} tenants &middot;{" "}
                    {insight.affectedPropertyIds.length} properties
                  </p>
                </div>
              ))}
            </div>
          </FeedSection>
        )}

        {/* Recent Events Section */}
        {eventsCount > 0 && (
          <FeedSection
            icon={<Newspaper className="h-3.5 w-3.5 text-blue-400" />}
            iconBg="bg-blue-400/20"
            title="Recent Events"
            count={eventsCount}
            isExpanded={expandedSections.has("events")}
            onToggle={() => toggleSection("events")}
          >
            <div className="space-y-1.5">
              {recentEvents.slice(0, 4).map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <p className="text-xs font-medium text-foreground group-hover:text-primary truncate">
                    {event.tenantName}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                    {event.headline}
                  </p>
                </Link>
              ))}
            </div>
          </FeedSection>
        )}

        {/* Empty state */}
        {concentrationCount === 0 && eventsCount === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground">
              No recent activity
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface FeedSectionProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FeedSection({
  icon,
  iconBg,
  title,
  count,
  isExpanded,
  onToggle,
  children,
}: FeedSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/30 transition-colors text-left group"
      >
        <div className={`p-1.5 rounded ${iconBg}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">
              {title}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {count}
            </span>
          </div>
        </div>
        <ChevronRight
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-3 animate-fade-in">{children}</div>
      )}
    </div>
  );
}
