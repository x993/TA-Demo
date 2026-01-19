'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { MonitoringStatus } from '@/types';

interface StatusIndicatorProps {
  status: MonitoringStatus;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { dot: 'w-2 h-2', ring: 'w-4 h-4' },
  md: { dot: 'w-2.5 h-2.5', ring: 'w-5 h-5' },
  lg: { dot: 'w-3 h-3', ring: 'w-6 h-6' },
};

const statusConfig = {
  active: {
    dotClass: 'bg-positive',
    ringClass: 'bg-positive/20',
    shadow: '0 0 12px hsl(var(--positive))',
  },
  paused: {
    dotClass: 'bg-warning',
    ringClass: 'bg-warning/20',
    shadow: '0 0 8px hsl(var(--warning))',
  },
  scanning: {
    dotClass: 'bg-primary',
    ringClass: 'bg-primary/20',
    shadow: '0 0 12px hsl(var(--primary))',
  },
};

const pulseVariants = {
  active: {
    scale: [1, 1.15, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  paused: {
    scale: 1,
    opacity: 0.85,
  },
  scanning: {
    scale: [1, 1.25, 1],
    opacity: [1, 0.6, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const ringVariants = {
  active: {
    scale: [1, 1.3, 1],
    opacity: [0.4, 0.1, 0.4],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  paused: {
    scale: 1,
    opacity: 0.2,
  },
  scanning: {
    scale: [1, 1.5, 1],
    opacity: [0.5, 0, 0.5],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export function StatusIndicator({ status, size = 'md' }: StatusIndicatorProps) {
  const { dot, ring } = sizeConfig[size];
  const { dotClass, ringClass, shadow } = statusConfig[status];

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulsing ring */}
      <motion.div
        className={cn('absolute rounded-full', ring, ringClass)}
        variants={ringVariants}
        animate={status}
      />

      {/* Core status light */}
      <motion.div
        className={cn('relative rounded-full', dot, dotClass)}
        style={{ boxShadow: shadow }}
        variants={pulseVariants}
        animate={status}
      />
    </div>
  );
}
