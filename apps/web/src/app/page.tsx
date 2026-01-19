'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/lib/api';

// Tiles
import {
  PriorityTile,
  ClusterTile,
  PropertyTile,
  PostureTile
} from '@/components/tiles';

// Brief components (existing)
import { WeeklyHeadline } from '@/components/brief/weekly-headline';
import { PortfolioVerdictCard } from '@/components/brief/portfolio-verdict';
import { StatusChanges } from '@/components/brief/status-changes';
import { RecentEvents } from '@/components/brief/event-card';
import { CoverageStatement } from '@/components/brief/coverage-statement';

// System components
import { ReviewStatus } from '@/components/system/review-status';
import { RunDetailsModal } from '@/components/system/run-details-modal';

// Panels & Drawers
import { PanelSheet } from '@/components/panels';
import { CoverageDrawer, TenantScopeSheet } from '@/components/coverage';

// Desktop
import { CommandPalette } from '@/components/desktop';

// UI
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StaggerContainer, StaggerItem } from '@/components/ui/stagger-children';
import { Settings2, ChevronRight } from 'lucide-react';

import type { BriefResponse, PostureTile as PostureTileType } from '@/types';

export default function HomePage() {
  const { role, openCoverageDrawer, openPanel } = useUIStore();
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
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, [role]);

  const isExec = role === 'exec';

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !brief) {
    return <ErrorState message={error || 'No data available'} onRetry={fetchBrief} />;
  }

  // Build posture tiles from status counts
  const postureTiles: PostureTileType[] = [
    {
      status: 'critical',
      count: brief.statusCounts.critical,
      delta: brief.statusChanges.toWatchOrCritical.filter(c => c.newStatus === 'critical').length,
      deltaDirection: brief.statusChanges.toWatchOrCritical.filter(c => c.newStatus === 'critical').length > 0 ? 'up' : 'unchanged',
    },
    {
      status: 'watch',
      count: brief.statusCounts.watch,
      delta: brief.statusChanges.toWatchOrCritical.filter(c => c.newStatus === 'watch').length,
      deltaDirection: brief.statusChanges.toWatchOrCritical.filter(c => c.newStatus === 'watch').length > 0 ? 'up' : 'unchanged',
    },
    {
      status: 'stable',
      count: brief.statusCounts.stable,
      delta: 0,
      deltaDirection: 'unchanged',
    },
  ];

  // Build priority tiles from narrative bullets
  const priorityTiles = brief.narrativeBullets?.slice(0, 5).map((bullet, i) => ({
    id: `priority-${i}`,
    priority: bullet.priority as 1 | 2 | 3,
    statement: bullet.text,
    affectedTenantCount: bullet.supportingTenantIds.length,
    affectedPropertyCount: 0,
    primaryTenantIds: bullet.supportingTenantIds.slice(0, 3),
    primaryPropertyIds: [],
    isNew: false,
  })) || [];

  // Build cluster tiles from concentration insights
  const clusterTiles = brief.concentrationInsights?.slice(0, 4).map((insight, i) => ({
    id: `cluster-${i}`,
    statement: insight.text,
    affectedTenantIds: insight.affectedTenantIds,
    affectedPropertyIds: insight.affectedPropertyIds,
    segment: undefined,
  })) || [];

  // Build questions from exec questions
  const questions = brief.execQuestions?.slice(0, 5).map((q, i) => ({
    id: `question-${i}`,
    text: q,
    relatedTenantIds: [],
    relatedPropertyIds: [],
  })) || [];

  // Mock review stats (in production, this comes from API)
  const reviewStats = {
    tenantsReviewed: brief.coverage.tenantsMonitored,
    tenantsSurfaced: brief.coverage.tenantsWithDisclosures,
    lastReviewTime: brief.updatedAt,
    newSinceLastReview: 0,
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header section */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {isExec ? 'Portfolio' : 'Your Properties'}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={openCoverageDrawer}
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Coverage
            </Button>
          </div>

          {/* Review status */}
          <ReviewStatus stats={reviewStats} />
        </header>

        {/* Executive view */}
        {isExec && (
          <StaggerContainer className="space-y-8">
            {/* Section A: Portfolio Verdict */}
            {brief.portfolioVerdict && (
              <StaggerItem>
                <section>
                  <PortfolioVerdictCard verdict={brief.portfolioVerdict} />
                </section>
              </StaggerItem>
            )}

            {/* Section B: Priority Tiles */}
            {priorityTiles.length > 0 && (
              <StaggerItem>
                <section>
                  <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Priorities
                  </h2>
                  <div className="space-y-3">
                    {priorityTiles.map(tile => (
                      <PriorityTile
                        key={tile.id}
                        tile={tile}
                        onClick={() => {
                          const tenantId = tile.primaryTenantIds[0];
                          if (tenantId) {
                            openPanel('priority', tenantId, tile);
                          }
                        }}
                      />
                    ))}
                  </div>
                </section>
              </StaggerItem>
            )}

            {/* Section C: Risk Posture Tiles */}
            <StaggerItem>
              <section>
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Risk Posture
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {postureTiles.map(tile => (
                    <PostureTile
                      key={tile.status}
                      tile={tile}
                      onClick={() => {
                        window.location.href = `/tenants?status=${tile.status}`;
                      }}
                    />
                  ))}
                </div>
              </section>
            </StaggerItem>

            {/* Section D: Status Changes */}
            <StaggerItem>
              <StatusChanges changes={brief.statusChanges} />
            </StaggerItem>

            {/* Section E: Concentration / Clusters */}
            {clusterTiles.length > 0 && (
              <StaggerItem>
                <section>
                  <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Where risk is clustering
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {clusterTiles.map(tile => (
                      <ClusterTile
                        key={tile.id}
                        tile={tile}
                        onClick={() => {
                          const propertyId = tile.affectedPropertyIds[0];
                          if (propertyId) {
                            openPanel('cluster', propertyId, tile);
                          }
                        }}
                      />
                    ))}
                  </div>
                </section>
              </StaggerItem>
            )}

            {/* Section F: Recent Events */}
            <StaggerItem>
              <RecentEvents events={brief.recentEvents} />
            </StaggerItem>

            {/* Section G: Questions to Raise */}
            {questions.length > 0 && (
              <StaggerItem>
                <section>
                  <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Questions to raise
                  </h2>
                  <div className="space-y-2">
                    {questions.map(question => (
                      <button
                        key={question.id}
                        onClick={() => {
                          const tenantId = question.relatedTenantIds[0];
                          if (tenantId) {
                            openPanel('tenant', tenantId);
                          }
                        }}
                        className="w-full text-left p-3 rounded-lg bg-muted/30
                                   hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-sm">{question.text}</p>
                      </button>
                    ))}
                  </div>
                </section>
              </StaggerItem>
            )}

            {/* Coverage statement */}
            <StaggerItem>
              <CoverageStatement coverage={brief.coverage} />
            </StaggerItem>
          </StaggerContainer>
        )}

        {/* Asset Manager view */}
        {!isExec && (
          <div className="space-y-6">
            <WeeklyHeadline
              headline={brief.headline}
              updatedAt={brief.updatedAt}
            />

            {/* Status counts grid */}
            <section>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {postureTiles.map(tile => (
                  <PostureTile
                    key={tile.status}
                    tile={tile}
                    onClick={() => {
                      window.location.href = `/tenants?status=${tile.status}`;
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Status changes */}
            <StatusChanges changes={brief.statusChanges} />

            {/* Recent events */}
            <RecentEvents events={brief.recentEvents} />

            {/* Coverage statement */}
            <CoverageStatement coverage={brief.coverage} />
          </div>
        )}
      </div>

      {/* Global overlays */}
      <PanelSheet />
      <CoverageDrawer />
      <TenantScopeSheet />
      <RunDetailsModal />
      <CommandPalette />
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
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
