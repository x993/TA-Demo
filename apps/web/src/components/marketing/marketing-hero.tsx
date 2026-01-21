"use client";

import Link from "next/link";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 pt-16 pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Shield className="h-4 w-4" />
            Trusted by leading CRE firms
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Monitor tenant credit risk
            <span className="block text-primary">before it impacts your portfolio</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Real-time credit monitoring, AI-powered risk analysis, and proactive alerts for commercial real estate professionals. Stay ahead of tenant defaults.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground text-base font-medium hover:bg-muted transition-colors"
            >
              Request Demo
            </Link>
          </div>

          {/* Product mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Mock dashboard header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-negative/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-positive/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-background/50 text-xs text-muted-foreground">
                    dashboard.creditoversight.com
                  </div>
                </div>
              </div>

              {/* Mock dashboard content */}
              <div className="p-6 bg-gradient-to-b from-card to-card/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Stat cards */}
                  <div className="rounded-lg border border-border/50 bg-background/50 p-4">
                    <div className="flex items-center gap-2 text-negative mb-2">
                      <div className="w-2 h-2 rounded-full bg-negative animate-pulse" />
                      <span className="text-xs font-medium">Critical</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <div className="text-xs text-muted-foreground">Tenants requiring action</div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-background/50 p-4">
                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-xs font-medium">Watch</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">8</div>
                    <div className="text-xs text-muted-foreground">Under monitoring</div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-background/50 p-4">
                    <div className="flex items-center gap-2 text-positive mb-2">
                      <div className="w-2 h-2 rounded-full bg-positive" />
                      <span className="text-xs font-medium">Stable</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">24</div>
                    <div className="text-xs text-muted-foreground">Performing well</div>
                  </div>
                </div>

                {/* Mock content rows */}
                <div className="space-y-3">
                  <div className="h-12 rounded-lg bg-muted/30 animate-pulse" />
                  <div className="h-12 rounded-lg bg-muted/20 animate-pulse" />
                  <div className="h-12 rounded-lg bg-muted/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
