"use client";

import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, TrendingDown, Building2, AlertTriangle, Eye, CheckCircle } from "lucide-react";

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

          {/* Realistic Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-negative/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-positive/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-background/80 text-xs text-muted-foreground font-mono">
                    dashboard.creditoversight.com
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-gradient-to-b from-background/80 to-background/60">
                {/* Portfolio Summary Bar */}
                <div className="flex items-center justify-between mb-6 px-4 py-3 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Health Score</div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-foreground">73</span>
                          <span className="text-xs text-positive flex items-center">
                            <TrendingUp className="h-3 w-3" />+5
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div>
                      <div className="text-xs text-muted-foreground">Total Value</div>
                      <div className="text-lg font-bold text-foreground">$2.4B</div>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div>
                      <div className="text-xs text-muted-foreground">Tenants</div>
                      <div className="text-lg font-bold text-foreground">62</div>
                    </div>
                  </div>
                </div>

                {/* Posture Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Critical */}
                  <div className="rounded-lg border border-negative/30 bg-negative/5 p-4 relative overflow-hidden">
                    <div className="absolute top-3 right-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-negative animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-negative" />
                      <span className="text-xs font-semibold text-negative uppercase tracking-wider">Critical</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">3</span>
                      <span className="text-sm text-negative flex items-center">
                        <TrendingUp className="h-3 w-3 mr-0.5" />+1
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Requires immediate action</div>
                  </div>

                  {/* Watch */}
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 relative overflow-hidden">
                    <div className="absolute top-3 right-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Watch</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">12</span>
                      <span className="text-sm text-positive flex items-center">
                        <TrendingDown className="h-3 w-3 mr-0.5" />-2
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Under active monitoring</div>
                  </div>

                  {/* Stable */}
                  <div className="rounded-lg border border-positive/30 bg-positive/5 p-4 relative overflow-hidden">
                    <div className="absolute top-3 right-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-positive" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-4 w-4 text-positive" />
                      <span className="text-xs font-semibold text-positive uppercase tracking-wider">Stable</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">47</span>
                      <span className="text-sm text-positive flex items-center">
                        <TrendingUp className="h-3 w-3 mr-0.5" />+3
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Performing as expected</div>
                  </div>
                </div>

                {/* Property Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Property 1 */}
                  <div className="rounded-lg border border-border/50 bg-card/50 overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="h-20 bg-gradient-to-br from-blue-500/20 via-primary/10 to-purple-500/20" />
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-foreground">Downtown Tower</h4>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-positive/10 text-positive">Stable</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">San Francisco, CA</div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground"><Building2 className="h-3 w-3 inline mr-1" />12 tenants</span>
                        <span className="text-negative">2 issues</span>
                      </div>
                    </div>
                  </div>

                  {/* Property 2 */}
                  <div className="rounded-lg border border-border/50 bg-card/50 overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="h-20 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20" />
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-foreground">Riverside Plaza</h4>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500">Watch</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">Austin, TX</div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground"><Building2 className="h-3 w-3 inline mr-1" />8 tenants</span>
                        <span className="text-amber-500">1 issue</span>
                      </div>
                    </div>
                  </div>

                  {/* Property 3 */}
                  <div className="rounded-lg border border-border/50 bg-card/50 overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="h-20 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20" />
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-foreground">Tech Campus West</h4>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-negative/10 text-negative">Critical</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">Seattle, WA</div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground"><Building2 className="h-3 w-3 inline mr-1" />15 tenants</span>
                        <span className="text-negative">4 issues</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
