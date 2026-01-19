'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/lib/api';
import { PanelHeader } from './panel-header';
import { TenantTile } from '@/components/tiles/tenant-tile';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Calendar, Shield } from 'lucide-react';
import type { Property, Tenant, ClusterTile } from '@/types';

interface PropertyPanelProps {
  propertyId: string;
  tileData?: ClusterTile | null;
}

export function PropertyPanel({ propertyId, tileData }: PropertyPanelProps) {
  const { closePanel, openPanel } = useUIStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await api.getProperty(propertyId);
        setProperty(data.property);
        setTenants(data.tenants || []);
      } catch (error) {
        console.error('Failed to fetch property:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!property) return null;

  // Filter tenants with issues
  const tenantsWithIssues = tenants.filter(t =>
    t.status === 'critical' || t.status === 'watch'
  );

  return (
    <div className="pb-6">
      {/* Header */}
      <PanelHeader
        type="property"
        title={property.name}
        subtitle={`${property.city}, ${property.state}`}
        status={tenantsWithIssues.length > 0 ? 'watch' : 'stable'}
        imageUrl={property.imageUrl}
        issuesCount={tenantsWithIssues.length}
        onClose={closePanel}
        layoutId={`property-tile-${propertyId}`}
      />

      {/* Snapshot block */}
      <section className="px-4 mt-6">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Snapshot
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">Last change</span>
            </div>
            <p className="text-sm font-medium">Jan 16, 2026</p>
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

      {/* Why this surfaced (if from cluster tile) */}
      {tileData && (
        <section className="px-4 mt-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Why this surfaced
          </h3>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm">{tileData.statement}</p>
          </div>
        </section>
      )}

      {/* Tenants at this property */}
      <section className="px-4 mt-6">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Tenants ({tenants.length})
        </h3>
        <div className="space-y-2">
          {tenants.map(tenant => (
            <TenantTile
              key={tenant.id}
              tenant={tenant}
              onClick={() => {
                openPanel('tenant', tenant.id);
              }}
              showLatestEvent={false}
            />
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="px-4 mt-6 space-y-2">
        <Button variant="outline" className="w-full" asChild>
          <a href={`/properties/${propertyId}`}>
            <FileText className="h-4 w-4 mr-2" />
            View full details
          </a>
        </Button>
      </section>
    </div>
  );
}
