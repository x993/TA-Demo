'use client';

import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TileBaseProps {
  children: React.ReactNode;
  variant?: 'standard' | 'glass';
  onClick?: () => void;
  className?: string;
  isNew?: boolean;
  layoutId?: string;
}

export function TileBase({
  children,
  variant = 'standard',
  onClick,
  className,
  isNew,
  layoutId,
}: TileBaseProps) {
  const Component = layoutId ? motion.div : 'div';

  return (
    <Component
      layoutId={layoutId}
      onClick={onClick}
      className={cn(
        // Base styles
        'relative rounded-xl p-4 cursor-pointer transition-all duration-200 group',
        // Border
        'border border-border',
        // Variant styles
        variant === 'glass' && 'glass-card',
        variant === 'standard' && 'bg-card',
        // Hover states (desktop)
        'hover:border-white/10',
        'md:hover:translate-y-[-1px] md:hover:shadow-lg md:hover:shadow-primary/5',
        // Active state
        'active:scale-[0.99]',
        className
      )}
    >
      {/* New tag */}
      {isNew && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-medium
                     bg-primary text-primary-foreground rounded-full z-10"
        >
          New
        </motion.span>
      )}

      {children}

      {/* Chevron indicator */}
      {onClick && (
        <ChevronRight
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4
                     text-muted-foreground opacity-0 group-hover:opacity-100
                     transition-opacity md:block hidden"
        />
      )}
    </Component>
  );
}
