"use client";

import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Building2,
  AlertTriangle,
  Eye,
  CheckCircle,
  Search,
  FileText,
  Bell,
} from "lucide-react";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Dark gradient background with subtle grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1419] via-background to-background">
        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.4) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Gradient overlay for depth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container relative px-4 pt-16 pb-10">
        <div className="max-w-6xl mx-auto">
          {/* Two-column layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              {/* Section label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Tenant Credit Intelligence
              </div>

              {/* Headline - problem-focused */}
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                See tenant risk clearly.
                <span className="block text-muted-foreground mt-2">
                  Act before it becomes a problem.
                </span>
              </h1>

              {/* Subheadline - explains what it does without hype */}
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Credit Oversight aggregates public and private data sources to
                surface credit signals for commercial tenants. Faster visibility.
                Fewer surprises.
              </p>

              {/* CTA Buttons - low pressure */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Request a Walkthrough
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  Explore the Product
                </Link>
              </div>

              {/* Trust signals - understated */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-positive" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            {/* Right: Product Preview */}
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl blur-2xl" />

              {/* Main product card */}
              <div className="relative rounded-xl border border-border/50 bg-card/90 backdrop-blur-sm shadow-2xl overflow-hidden">
                {/* App header bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-negative/50" />
                      <div className="w-3 h-3 rounded-full bg-warning/50" />
                      <div className="w-3 h-3 rounded-full bg-positive/50" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      Portfolio Overview
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
                    Live
                  </div>
                </div>

                {/* Dashboard content preview */}
                <div className="p-5 space-y-4">
                  {/* Risk summary tiles */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-negative/5 border border-negative/20 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-negative" />
                        <span className="text-[10px] font-semibold text-negative uppercase tracking-wider">
                          Critical
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">3</div>
                      <div className="text-[10px] text-muted-foreground">
                        Requires review
                      </div>
                    </div>

                    <div className="rounded-lg bg-warning/5 border border-warning/20 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Eye className="h-3.5 w-3.5 text-warning" />
                        <span className="text-[10px] font-semibold text-warning uppercase tracking-wider">
                          Watch
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">12</div>
                      <div className="text-[10px] text-muted-foreground">
                        Monitoring
                      </div>
                    </div>

                    <div className="rounded-lg bg-positive/5 border border-positive/20 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <CheckCircle className="h-3.5 w-3.5 text-positive" />
                        <span className="text-[10px] font-semibold text-positive uppercase tracking-wider">
                          Stable
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">47</div>
                      <div className="text-[10px] text-muted-foreground">
                        As expected
                      </div>
                    </div>
                  </div>

                  {/* Recent signal */}
                  <div className="rounded-lg border border-border/50 bg-background/50 p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-warning" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground truncate">
                            New SEC Filing Detected
                          </span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            2h ago
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Acme Corp filed 10-Q with material changes to debt
                          covenants
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tenant row preview */}
                  <div className="space-y-2">
                    {[
                      {
                        name: "TechStart Inc",
                        location: "San Francisco, CA",
                        status: "watch",
                        trend: "down",
                      },
                      {
                        name: "Global Retail Co",
                        location: "Austin, TX",
                        status: "stable",
                        trend: "up",
                      },
                    ].map((tenant, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-border/30 bg-background/30 hover:bg-background/50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {tenant.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {tenant.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {tenant.trend === "up" ? (
                            <TrendingUp className="h-3.5 w-3.5 text-positive" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-negative" />
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              tenant.status === "watch"
                                ? "bg-warning/10 text-warning"
                                : "bg-positive/10 text-positive"
                            }`}
                          >
                            {tenant.status === "watch" ? "Watch" : "Stable"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
