"use client";

import { useUIStore } from "@/stores/ui-store";
import { WeeklyHeadline } from "@/components/brief/weekly-headline";
import { StatusCounts } from "@/components/brief/status-counts";
import { StatusChanges } from "@/components/brief/status-changes";
import { RecentEvents } from "@/components/brief/event-card";
import { CoverageStatement } from "@/components/brief/coverage-statement";
import { mockBrief } from "@/lib/mock-data";

export default function BriefPage() {
  const { role } = useUIStore();

  // In production, this would fetch from API based on role
  const brief = mockBrief;

  const pageTitle = role === "exec" ? "Weekly Summary" : "Your Properties";
  const dateRange = "Jan 13–17, 2026";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
        <p className="text-sm text-muted-foreground">{dateRange}</p>
      </div>

      {/* Weekly Headline - Glass Card */}
      <WeeklyHeadline headline={brief.headline} updatedAt={brief.updatedAt} />

      {/* Tenant Status Counts */}
      <StatusCounts counts={brief.statusCounts} />

      {/* Status Changes This Week */}
      <StatusChanges changes={brief.statusChanges} />

      {/* Recent Events */}
      <RecentEvents events={brief.recentEvents} />

      {/* Coverage Statement */}
      <CoverageStatement coverage={brief.coverage} />
    </div>
  );
}
