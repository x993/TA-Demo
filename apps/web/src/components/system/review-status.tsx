'use client';

import { useUIStore } from '@/stores/ui-store';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { ReviewStats } from '@/types';

interface ReviewStatusProps {
  stats: ReviewStats;
}

export function ReviewStatus({ stats }: ReviewStatusProps) {
  const { openRunDetailsModal } = useUIStore();

  return (
    <button
      onClick={openRunDetailsModal}
      className="flex items-center gap-4 text-xs text-muted-foreground
                 hover:text-foreground transition-colors"
    >
      {/* Last review time */}
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        <span>Last review: {formatDateTime(stats.lastReviewTime)}</span>
      </div>

      {/* Review counts */}
      <div className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5" />
        <span>
          Reviewed: {stats.tenantsReviewed} · Surfaced: {stats.tenantsSurfaced}
        </span>
      </div>

      {/* New indicator */}
      {stats.newSinceLastReview > 0 && (
        <div className="flex items-center gap-1.5 text-primary">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{stats.newSinceLastReview} new</span>
        </div>
      )}
    </button>
  );
}
