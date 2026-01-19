'use client';

import { TileBase } from './tile-base';
import { StatusBadge } from '@/components/ui/status-badge';
import { AlertCircle } from 'lucide-react';
import type { PropertyAttentionItem } from '@/types';

interface PropertyTileProps {
  property: PropertyAttentionItem;
  onClick: () => void;
}

export function PropertyTile({ property, onClick }: PropertyTileProps) {
  const fallbackBg = `hsl(${property.name.charCodeAt(0) * 10 % 360}, 30%, 20%)`;

  return (
    <TileBase
      variant="standard"
      onClick={onClick}
      layoutId={`property-tile-${property.id}`}
      className="p-0 overflow-hidden"
    >
      {/* Image hero */}
      <div
        className="relative h-24 bg-cover bg-center"
        style={{
          backgroundImage: property.imageUrl
            ? `url(${property.imageUrl})`
            : `linear-gradient(135deg, ${fallbackBg}, hsl(var(--muted)))`,
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <StatusBadge status={property.status} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 -mt-6 relative">
        <h3 className="font-semibold text-sm truncate">{property.name}</h3>
        <p className="text-xs text-muted-foreground">
          {property.city}, {property.state}
        </p>

        {/* Issues count */}
        {property.issuesCount > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-warning">
            <AlertCircle className="h-3 w-3" />
            <span>{property.issuesCount} issue{property.issuesCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </TileBase>
  );
}
