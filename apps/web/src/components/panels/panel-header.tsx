'use client';

import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/ui/status-badge';
import { X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TenantStatus } from '@/types';

interface PanelHeaderProps {
  type: 'property' | 'tenant';
  title: string;
  subtitle?: string;
  status: TenantStatus | string;
  imageUrl?: string;
  issuesCount?: number;
  onClose: () => void;
  layoutId?: string;
}

export function PanelHeader({
  type,
  title,
  subtitle,
  status,
  imageUrl,
  issuesCount,
  onClose,
  layoutId,
}: PanelHeaderProps) {
  const fallbackBg = `hsl(${title.charCodeAt(0) * 10 % 360}, 30%, 20%)`;

  return (
    <motion.div
      layoutId={layoutId}
      className="relative"
    >
      {/* Hero image */}
      <div
        className={cn(
          'h-32 md:h-40 bg-cover bg-center relative',
          !imageUrl && 'bg-gradient-to-br from-muted to-background'
        )}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : { background: fallbackBg }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/50
                     backdrop-blur-sm hover:bg-background/70 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content overlay */}
      <div className="px-4 -mt-12 relative">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <StatusBadge status={status as TenantStatus} />
        </div>

        {/* Issues count */}
        {issuesCount !== undefined && issuesCount > 0 && (
          <div className="flex items-center gap-1 mt-2 text-sm text-warning">
            <AlertCircle className="h-4 w-4" />
            <span>{issuesCount} issue{issuesCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
