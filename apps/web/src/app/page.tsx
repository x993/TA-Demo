'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/lib/api';

// Tiles
import {
  ClusterTile,
  PropertyTile,
  PostureTile
} from '@/components/tiles';

// Brief components (existing)
import { WeeklyHeadline } from '@/components/brief/weekly-headline';
import { PortfolioVerdictCard } from '@/components/brief/portfolio-verdict';
import { StatusChanges } from '@/components/brief/status-changes';
import { RecentEvents } from '@/components/brief/event-card';

// System components
import { RunDetailsModal } from '@/components/system/run-details-modal';

// Panels & Drawers
import { PanelSheet } from '@/components/panels';
import { CoverageDrawer, TenantScopeSheet } from '@/components/coverage';

// Desktop
import { CommandPalette } from '@/components/desktop';

// Mission Control
import { MissionControl } from '@/components/mission-control';

// Activity Feed (right sidebar)
import { ActivityFeed } from '@/components/activity-feed';

// Tenant Search
import { TenantSearch } from '@/components/tenant-search';

// Hero
import { HeroSection } from '@/components/hero';

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
  const [showAllProperties, setShowAllProperties] = useState(true);

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

  // Build cluster tiles from concentration insights
  const clusterTiles = brief.concentrationInsights?.slice(0, 4).map((insight, i) => ({
    id: `cluster-${i}`,
    statement: insight.text,
    affectedTenantIds: insight.affectedTenantIds,
    affectedPropertyIds: insight.affectedPropertyIds,
    segment: undefined,
  })) || [];

  // Get all properties (sorted by issues count, then by status)
  const allProperties = brief.propertiesAttention?.slice(0, showAllProperties ? undefined : 4) || [];

  const hasMoreProperties = (brief.propertiesAttention?.length || 0) > 4;

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        statusCounts={brief.statusCounts}
        tenantsMonitored={brief.coverage.tenantsMonitored}
      />

      {/* Main content with sidebar layout */}
      <div id="portfolio-content" className="container mx-auto px-4 pb-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Mission Control */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <MissionControl
                statusCounts={brief.statusCounts}
                coverage={brief.coverage}
              />
            </div>
          </aside>

          {/* Main content area */}
          <div className="flex-1 max-w-2xl">
            {/* Coverage button for mobile */}
            <div className="flex justify-end mb-4 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={openCoverageDrawer}
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Coverage
              </Button>
            </div>

            {/* Executive view */}
            {isExec && (
              <StaggerContainer className="space-y-8">
                {/* Section A: Portfolio Verdict */}
                {brief.portfolioVerdict && (
                  <StaggerItem>
                    <section>
                      <PortfolioVerdictCard
                        verdict={brief.portfolioVerdict}
                        statusChanges={brief.statusChanges}
                      />
                    </section>
                  </StaggerItem>
                )}

                {/* Section B: Properties */}
                {allProperties.length > 0 && (
                  <StaggerItem>
                    <section className="rounded-xl border border-border bg-card overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-border/50">
                        <h3 className="text-base font-semibold text-foreground">
                          Properties
                        </h3>
                      </div>
                      {/* Content */}
                      <div className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {allProperties.map(prop => (
                            <PropertyTile
                              key={prop.id}
                              property={prop}
                              onClick={() => openPanel('property', prop.id)}
                            />
                          ))}
                        </div>
                        {hasMoreProperties && (
                          <button
                            onClick={() => setShowAllProperties(!showAllProperties)}
                            className="w-full mt-3 py-2 text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 transition-colors"
                          >
                            {showAllProperties ? 'Show less' : `View all ${brief.propertiesAttention?.length || 0} properties`}
                            <ChevronRight className={`h-3 w-3 transition-transform ${showAllProperties ? '-rotate-90' : ''}`} />
                          </button>
                        )}
                      </div>
                    </section>
                  </StaggerItem>
                )}

                {/* Divider */}
                <div className="flex justify-center">
                  <div className="w-16 h-px bg-border" />
                </div>

                {/* Section C: Tenant Lookup */}
                <StaggerItem>
                  <TenantSearch />
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

                {/* Status counts grid with properties */}
                <section>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
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

                  {/* Your properties */}
                  {allProperties.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xs text-muted-foreground mb-3">
                        Your properties
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {allProperties.map(prop => (
                          <PropertyTile
                            key={prop.id}
                            property={prop}
                            onClick={() => openPanel('property', prop.id)}
                          />
                        ))}
                      </div>
                      {hasMoreProperties && (
                        <button
                          onClick={() => setShowAllProperties(!showAllProperties)}
                          className="w-full mt-3 py-2 text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 transition-colors"
                        >
                          {showAllProperties ? 'Show less' : `View all ${brief.propertiesAttention?.length || 0} properties`}
                          <ChevronRight className={`h-3 w-3 transition-transform ${showAllProperties ? '-rotate-90' : ''}`} />
                        </button>
                      )}
                    </div>
                  )}
                </section>

                {/* Tenant Lookup */}
                <TenantSearch />
              </div>
            )}
          </div>

          {/* Right Sidebar - Activity Feed */}
          <aside className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-20">
              <ActivityFeed
                concentrationInsights={brief.concentrationInsights}
                recentEvents={brief.recentEvents}
              />
            </div>
          </aside>
        </div>

        {/* CTA Section - Outside the flex container so sidebars don't extend past */}
        <div className="text-center py-12 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Stay ahead of tenant credit risk
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Get weekly insights on CRE credit trends, portfolio monitoring best practices, and product updates delivered to your inbox.
          </p>
        </div>
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
