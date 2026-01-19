'use client';

import { ArrowDown, Shield, TrendingUp, AlertTriangle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StatusCounts } from '@/types';

interface HeroSectionProps {
  statusCounts: StatusCounts;
  tenantsMonitored: number;
}

export function HeroSection({ statusCounts, tenantsMonitored }: HeroSectionProps) {
  const totalIssues = statusCounts.critical + statusCounts.watch;
  const healthyPercentage = Math.round(
    ((statusCounts.stable + statusCounts.improving) / tenantsMonitored) * 100
  );

  const scrollToContent = () => {
    const content = document.getElementById('portfolio-content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-12 md:py-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Main headline */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Your tenants. <span className="text-primary">Always in view.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Real-time credit monitoring across your entire portfolio.
            Know when tenant health changes—before it impacts your NOI.
          </p>

          {/* Quick stats row */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Shield className="h-4 w-4 text-positive" />
                <span className="text-2xl font-bold tabular-nums">{healthyPercentage}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Portfolio health</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold tabular-nums">{tenantsMonitored}</span>
              </div>
              <p className="text-xs text-muted-foreground">Tenants tracked</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-2xl font-bold tabular-nums">{totalIssues}</span>
              </div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </div>
          </div>

          {/* Supporting copy */}
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8">
            SEC filings, news, and court records analyzed daily.
            Actionable insights delivered to your dashboard.
          </p>

          {/* CTA */}
          <button
            onClick={scrollToContent}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            View portfolio status
            <ArrowDown className="h-4 w-4" />
          </button>
        </motion.div>
      </div>

      {/* Decorative divider */}
      <div className="relative mt-12">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
