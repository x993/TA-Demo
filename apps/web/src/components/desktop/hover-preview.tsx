'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Tenant, Property } from '@/types';

interface HoverPreviewProps {
  children: React.ReactNode;
  tenant?: Tenant;
  property?: Property;
}

export function HoverPreview({ children, tenant, property }: HoverPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.right + 8,
      y: rect.top,
    });
    setIsHovered(true);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {children}

      <AnimatePresence>
        {isHovered && (tenant || property) && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 100,
            }}
            className="w-64 p-4 rounded-xl border border-border bg-card shadow-xl"
          >
            {tenant && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{tenant.name}</h4>
                  <StatusBadge status={tenant.status} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {tenant.industry} · {tenant.entityType}
                </p>
                {tenant.latestEvent && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">Latest:</p>
                    <p className="text-xs line-clamp-2">{tenant.latestEvent.headline}</p>
                  </div>
                )}
              </>
            )}

            {property && (
              <>
                <h4 className="font-semibold text-sm mb-1">{property.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {property.city}, {property.state}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {property.tenantCount} tenants · {property.eventsCount} events
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
