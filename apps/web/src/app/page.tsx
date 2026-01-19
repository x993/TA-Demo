"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/stores/ui-store";
import { WeeklyHeadline } from "@/components/brief/weekly-headline";
import { StatusCounts } from "@/components/brief/status-counts";
import { StatusChanges } from "@/components/brief/status-changes";
import { RecentEvents } from "@/components/brief/event-card";
import { CoverageStatement } from "@/components/brief/coverage-statement";
import { PortfolioVerdictCard } from "@/components/brief/portfolio-verdict";
import { NarrativeBullets } from "@/components/brief/narrative-bullets";
import { ConcentrationInsights } from "@/components/brief/concentration-insights";
import { ExecQuestions } from "@/components/brief/exec-questions";
import { api } from "@/lib/api";
import type { BriefResponse } from "@/types";

function LoadingSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-muted rounded w-48" />
      <div className="h-4 bg-muted rounded w-32" />
      <div className="h-32 bg-muted rounded-xl" />
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg" />
        ))}
      </div>
      <div className="h-48 bg-muted rounded-xl" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-xl border border-negative/30 bg-negative/10 p-6 text-center">
        <p className="text-negative font-medium mb-2">Failed to load brief</p>
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default function BriefPage() {
  const { role } = useUIStore();
  const [brief, setBrief] = useState<BriefResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrief = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBrief();
      setBrief(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, [role]); // Refetch when role changes

  const pageTitle = role === "exec" ? "Weekly Summary" : "Your Properties";

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !brief) {
    return <ErrorState message={error || "No data available"} onRetry={fetchBrief} />;
  }

  const dateRange = formatDateRange(brief.asOfDate);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Title */}
      <header className="animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{pageTitle}</h1>
        <p className="text-sm text-muted-foreground mt-1">{dateRange}</p>
      </header>

      {/* Executive Portfolio Verdict (exec only) */}
      {role === "exec" && brief.portfolioVerdict && (
        <div className="animate-slide-up-fade" style={{ animationDelay: "50ms" }}>
          <PortfolioVerdictCard verdict={brief.portfolioVerdict} />
        </div>
      )}

      {/* Executive Narrative Bullets (exec only) */}
      {role === "exec" && brief.narrativeBullets && brief.narrativeBullets.length > 0 && (
        <div className="animate-slide-up-fade" style={{ animationDelay: "100ms" }}>
          <NarrativeBullets bullets={brief.narrativeBullets} />
        </div>
      )}

      {/* Weekly Headline - Glass Card (AM only or fallback) */}
      {role === "am" && (
        <div className="animate-slide-up-fade" style={{ animationDelay: "50ms" }}>
          <WeeklyHeadline headline={brief.headline} updatedAt={brief.updatedAt} />
        </div>
      )}

      {/* Tenant Status Counts */}
      <div className="animate-slide-up-fade" style={{ animationDelay: role === "exec" ? "150ms" : "100ms" }}>
        <StatusCounts counts={brief.statusCounts} />
      </div>

      {/* Status Changes This Week */}
      <div className="animate-slide-up-fade" style={{ animationDelay: role === "exec" ? "200ms" : "150ms" }}>
        <StatusChanges changes={brief.statusChanges} />
      </div>

      {/* Concentration Insights (exec only) */}
      {role === "exec" && brief.concentrationInsights && brief.concentrationInsights.length > 0 && (
        <div className="animate-slide-up-fade" style={{ animationDelay: "250ms" }}>
          <ConcentrationInsights insights={brief.concentrationInsights} />
        </div>
      )}

      {/* Recent Events */}
      <div className="animate-slide-up-fade" style={{ animationDelay: role === "exec" ? "300ms" : "200ms" }}>
        <RecentEvents events={brief.recentEvents} />
      </div>

      {/* Exec Questions (exec only) */}
      {role === "exec" && brief.execQuestions && brief.execQuestions.length > 0 && (
        <div className="animate-slide-up-fade" style={{ animationDelay: "350ms" }}>
          <ExecQuestions questions={brief.execQuestions} />
        </div>
      )}

      {/* Coverage Statement */}
      <div className="animate-fade-in" style={{ animationDelay: role === "exec" ? "400ms" : "300ms" }}>
        <CoverageStatement coverage={brief.coverage} />
      </div>
    </div>
  );
}

function formatDateRange(asOfDate: string): string {
  const endDate = new Date(asOfDate);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 4); // Week is 5 days (Mon-Fri)

  const formatOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const start = startDate.toLocaleDateString("en-US", formatOptions);
  const end = endDate.toLocaleDateString("en-US", { ...formatOptions, year: "numeric" });

  return `${start}–${end}`;
}
