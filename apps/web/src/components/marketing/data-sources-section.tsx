"use client";

import {
  FileText,
  Newspaper,
  Gavel,
  Building,
  TrendingUp,
  Database,
  Wifi,
} from "lucide-react";

const dataSources = [
  {
    icon: Building,
    name: "Dun & Bradstreet",
    description: "Business credit reports, payment history, and financial stability indicators",
    category: "Credit Bureau",
    status: "live",
  },
  {
    icon: TrendingUp,
    name: "Moody's Analytics",
    description: "Credit ratings, risk assessments, and economic forecasts",
    category: "Ratings Agency",
    status: "live",
  },
  {
    icon: FileText,
    name: "SEC Filings",
    description: "10-K, 10-Q, 8-K filings and material event disclosures",
    category: "Regulatory",
    status: "live",
  },
  {
    icon: Newspaper,
    name: "News & Press",
    description: "Real-time news monitoring from 10,000+ sources",
    category: "Media",
    status: "live",
  },
  {
    icon: Gavel,
    name: "Court Records",
    description: "Bankruptcy filings, liens, judgments, and litigation alerts",
    category: "Legal",
    status: "live",
  },
  {
    icon: Database,
    name: "Custom Integrations",
    description: "Connect your own data sources via API or CSV upload",
    category: "Your Data",
    status: "configurable",
  },
];

export function DataSourcesSection() {
  return (
    <section className="py-24">
      <div className="container px-4">
        {/* Section Header with animated connecting dots */}
        <div className="text-center mb-16">
          {/* Animated dots with gradient lines */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="w-12 h-0.5 bg-gradient-to-r from-primary/30 to-primary/60" />
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: "300ms" }} />
            <div className="w-12 h-0.5 bg-gradient-to-r from-primary/60 to-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: "450ms" }} />
            <div className="w-16 h-0.5 bg-gradient-to-r from-primary/30 to-primary" />
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: "600ms" }} />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Comprehensive data coverage
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We aggregate data from the most trusted sources to give you a complete picture of tenant credit health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {dataSources.map((source, index) => {
            const Icon = source.icon;
            return (
              <div
                key={index}
                className="group relative rounded-xl border-2 border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                {/* Category badge - top right */}
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 rounded-md text-[10px] font-semibold text-muted-foreground bg-muted uppercase tracking-wider">
                    {source.category}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-4 group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground transition-all duration-300">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {source.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {source.description}
                </p>

                {/* Live connection indicator - bottom */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    {source.status === "live" ? (
                      <>
                        <div className="relative">
                          <Wifi className="h-4 w-4 text-positive" />
                          <div className="absolute inset-0 animate-ping">
                            <Wifi className="h-4 w-4 text-positive/50" />
                          </div>
                        </div>
                        <span className="text-xs font-medium text-positive">Live connection</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Configurable</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
