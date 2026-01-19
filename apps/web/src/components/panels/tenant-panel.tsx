'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/lib/api';
import { PanelHeader } from './panel-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText, Settings2, Calendar, Shield, Globe,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property, PriorityTile, TenantDetailResponse } from '@/types';

interface TenantPanelProps {
  tenantId: string;
  tileData?: PriorityTile | null;
}

export function TenantPanel({ tenantId, tileData }: TenantPanelProps) {
  const { closePanel, openTenantScopeSheet, openEvidenceDrawer, openPanel } = useUIStore();
  const [tenant, setTenant] = useState<TenantDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await api.getTenant(tenantId);
        setTenant(data);
      } catch (error) {
        console.error('Failed to fetch tenant:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tenantId]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!tenant) return null;

  const latestEvent = tenant.events?.[0];

  return (
    <div className="pb-6">
      {/* Header */}
      <PanelHeader
        type="tenant"
        title={tenant.tenant.name}
        subtitle={tenant.tenant.industry}
        status={tenant.tenant.status}
        onClose={closePanel}
        layoutId={`tenant-tile-${tenantId}`}
      />

      {/* Entity info badges */}
      <div className="px-4 mt-4 flex items-center gap-2">
        <span className="px-2 py-1 rounded-full text-xs bg-muted flex items-center gap-1">
          <Globe className="h-3 w-3" />
          {tenant.tenant.entityType}
        </span>
        {tenant.tenant.ticker && (
          <span className="px-2 py-1 rounded-full text-xs bg-muted">
            {tenant.tenant.ticker}
          </span>
        )}
      </div>

      {/* Snapshot block */}
      <section className="px-4 mt-6">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Snapshot
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">Last material change</span>
            </div>
            <p className="text-sm font-medium">
              {latestEvent ? new Date(latestEvent.eventDate).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric'
              }) : 'None'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Shield className="h-3.5 w-3.5" />
              <span className="text-xs">Confidence</span>
            </div>
            <p className="text-sm font-medium">High</p>
          </div>
        </div>
      </section>

      {/* Why this surfaced */}
      {(tileData || latestEvent) && (
        <section className="px-4 mt-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Why this surfaced
          </h3>
          <div className="space-y-2">
            {tileData && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm">{tileData.statement}</p>
              </div>
            )}
            {latestEvent && latestEvent.memo && (
              <ul className="space-y-2">
                {latestEvent.memo.keyDetails?.slice(0, 3).map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{detail.fact}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Credit relevance (collapsible) */}
      {latestEvent?.memo?.whyItMatters && (
        <section className="px-4 mt-6">
          <button
            onClick={() => setExpandedSection(
              expandedSection === 'credit' ? null : 'credit'
            )}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Credit relevance
            </h3>
            <ChevronDown className={cn(
              'h-4 w-4 text-muted-foreground transition-transform',
              expandedSection === 'credit' && 'rotate-180'
            )} />
          </button>

          {expandedSection === 'credit' && (
            <div className="mt-3 p-3 rounded-lg bg-muted/50">
              <p className="text-sm">{latestEvent.memo.whyItMatters}</p>
            </div>
          )}
        </section>
      )}

      {/* Affected properties */}
      {tenant.properties && tenant.properties.length > 0 && (
        <section className="px-4 mt-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Properties affected ({tenant.properties.length})
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tenant.properties.map((prop: Property) => (
              <button
                key={prop.id}
                onClick={() => openPanel('property', prop.id)}
                className="flex-shrink-0 px-3 py-2 rounded-lg bg-muted/50
                           hover:bg-muted transition-colors text-left"
              >
                <p className="text-sm font-medium">{prop.name}</p>
                <p className="text-xs text-muted-foreground">
                  {prop.city}, {prop.state}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Evidence preview */}
      {latestEvent && (
        <section className="px-4 mt-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Evidence
          </h3>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => openEvidenceDrawer(latestEvent.id)}
          >
            <FileText className="h-4 w-4 mr-2" />
            View source documents ({latestEvent.evidenceCount || 0})
          </Button>
        </section>
      )}

      {/* CTAs */}
      <section className="px-4 mt-6 space-y-2">
        <Button variant="outline" className="w-full" asChild>
          <a href={`/tenants/${tenantId}`}>
            <FileText className="h-4 w-4 mr-2" />
            Open full memo
          </a>
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => openTenantScopeSheet(tenantId)}
        >
          <Settings2 className="h-4 w-4 mr-2" />
          Monitoring scope
        </Button>
      </section>
    </div>
  );
}
