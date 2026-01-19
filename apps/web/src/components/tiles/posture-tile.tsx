'use client';

import { TileBase } from './tile-base';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PostureTile as PostureTileType } from '@/types';

interface PostureTileProps {
  tile: PostureTileType;
  onClick: () => void;
}

const statusConfig = {
  critical: {
    label: 'Critical',
    countClass: 'text-negative',
    bgClass: 'bg-negative/5',
  },
  watch: {
    label: 'Watch',
    countClass: 'text-warning',
    bgClass: 'bg-warning/5',
  },
  stable: {
    label: 'Stable',
    countClass: 'text-foreground',
    bgClass: 'bg-muted/50',
  },
};

const deltaIcons = {
  up: TrendingUp,
  down: TrendingDown,
  unchanged: Minus,
};

export function PostureTile({ tile, onClick }: PostureTileProps) {
  const config = statusConfig[tile.status];
  const DeltaIcon = deltaIcons[tile.deltaDirection];

  return (
    <TileBase
      variant="standard"
      onClick={onClick}
      className={cn('text-center', config.bgClass)}
    >
      {/* Label */}
      <p className="text-xs text-muted-foreground mb-1">{config.label}</p>

      {/* Count */}
      <p className={cn('text-3xl font-bold tabular-nums', config.countClass)}>
        {tile.count}
      </p>

      {/* Delta */}
      {tile.delta !== 0 && (
        <div className={cn(
          'flex items-center justify-center gap-1 mt-2 text-xs',
          tile.deltaDirection === 'up' ? 'text-negative' : 'text-positive'
        )}>
          <DeltaIcon className="h-3 w-3" />
          <span>{tile.deltaDirection === 'up' ? '+' : ''}{tile.delta}</span>
        </div>
      )}
    </TileBase>
  );
}
