'use client';

import { TileBase } from './tile-base';
import { cn } from '@/lib/utils';
import type { PriorityTile as PriorityTileType } from '@/types';

interface PriorityTileProps {
  tile: PriorityTileType;
  onClick: () => void;
}

const priorityConfig = {
  1: {
    label: 'Priority 1',
    badgeClass: 'bg-negative/10 text-negative border-negative/20',
    glowClass: 'shadow-negative/10',
  },
  2: {
    label: 'Priority 2',
    badgeClass: 'bg-warning/10 text-warning border-warning/20',
    glowClass: '',
  },
  3: {
    label: 'Priority 3',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    glowClass: '',
  },
};

export function PriorityTile({ tile, onClick }: PriorityTileProps) {
  const config = priorityConfig[tile.priority];
  const isHighPriority = tile.priority === 1;

  return (
    <TileBase
      variant={isHighPriority ? 'glass' : 'standard'}
      onClick={onClick}
      isNew={tile.isNew}
      layoutId={`priority-tile-${tile.id}`}
      className={cn(isHighPriority && config.glowClass)}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium border',
          config.badgeClass
        )}>
          {config.label}
        </span>

        {/* Scope chips */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {tile.affectedTenantCount > 0 && (
            <span>{tile.affectedTenantCount} tenant{tile.affectedTenantCount !== 1 ? 's' : ''}</span>
          )}
          {tile.affectedTenantCount > 0 && tile.affectedPropertyCount > 0 && (
            <span>·</span>
          )}
          {tile.affectedPropertyCount > 0 && (
            <span>{tile.affectedPropertyCount} prop{tile.affectedPropertyCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Main statement */}
      <p className="text-sm font-medium leading-snug line-clamp-2">
        {tile.statement}
      </p>
    </TileBase>
  );
}
