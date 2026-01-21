'use client';

import { TileBase } from './tile-base';
import { StatusBadge } from '@/components/ui/status-badge';
import { Globe, Lock } from 'lucide-react';
import type { Tenant } from '@/types';

interface TenantTileProps {
  tenant: Tenant;
  onClick: () => void;
  showLatestEvent?: boolean;
}

export function TenantTile({ tenant, onClick, showLatestEvent = true }: TenantTileProps) {
  // Generate monogram
  const monogram = tenant.name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

  const EntityIcon = tenant.entityType === 'public' ? Globe : Lock;

  return (
    <TileBase
      variant="standard"
      onClick={onClick}
      layoutId={`tenant-tile-${tenant.id}`}
    >
      <div className="flex items-start gap-3">
        {/* Logo/Monogram */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
          {tenant.logoUrl ? (
            <img
              src={tenant.logoUrl}
              alt={tenant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">
              {monogram}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">{tenant.name}</h3>
            <StatusBadge status={tenant.status} size="sm" />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <EntityIcon className="h-3 w-3" />
            <span className="capitalize">{tenant.entityType}</span>
            {tenant.ticker && (
              <>
                <span>·</span>
                <span>{tenant.ticker}</span>
              </>
            )}
            {tenant.industry && (
              <>
                <span>·</span>
                <span>{tenant.industry}</span>
              </>
            )}
          </div>

          {/* Latest event */}
          {showLatestEvent && tenant.latestEvent && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
              Latest: {tenant.latestEvent.headline}
            </p>
          )}
        </div>
      </div>
    </TileBase>
  );
}
