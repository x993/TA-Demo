'use client';

import { TileBase } from './tile-base';
import { Layers } from 'lucide-react';
import type { ClusterTile as ClusterTileType } from '@/types';

interface ClusterTileProps {
  tile: ClusterTileType;
  onClick: () => void;
}

export function ClusterTile({ tile, onClick }: ClusterTileProps) {
  const totalAffected = tile.affectedTenantIds.length + tile.affectedPropertyIds.length;

  return (
    <TileBase
      variant="standard"
      onClick={onClick}
      layoutId={`cluster-tile-${tile.id}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-muted">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        {tile.segment && (
          <span className="text-xs text-muted-foreground capitalize">
            {tile.segment}
          </span>
        )}
      </div>

      {/* Statement */}
      <p className="text-sm leading-snug line-clamp-2 mb-2">
        {tile.statement}
      </p>

      {/* Affected count */}
      <p className="text-xs text-muted-foreground">
        Affects {totalAffected} entit{totalAffected !== 1 ? 'ies' : 'y'}
      </p>
    </TileBase>
  );
}
