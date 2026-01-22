"use client";

import {
  Building,
  TrendingUp,
  FileText,
  Newspaper,
  Gavel,
  Database,
  ArrowRight,
  LayoutDashboard,
  Bell,
  LineChart,
  Filter,
  Download,
} from "lucide-react";

const dataSources = [
  { icon: Building, name: "D&B / Experian", category: "Credit bureaus" },
  { icon: TrendingUp, name: "Moody's / S&P", category: "Ratings" },
  { icon: FileText, name: "SEC EDGAR", category: "Regulatory filings" },
  { icon: Newspaper, name: "News & Press", category: "Media monitoring" },
  { icon: Gavel, name: "Court Records", category: "Legal filings" },
  { icon: Database, name: "Your Data", category: "Custom sources" },
];

const outputs = [
  {
    icon: LayoutDashboard,
    title: "Portfolio dashboard",
    description: "See all tenants in one view, sorted by risk posture",
  },
  {
    icon: Bell,
    title: "Real-time alerts",
    description: "Get notified when something changes for any tenant",
  },
  {
    icon: LineChart,
    title: "Trend visibility",
    description: "Track how tenant credit profiles change over time",
  },
  {
    icon: Filter,
    title: "Smart categorization",
    description: "Tenants grouped by Critical, Watch, and Stable status",
  },
  {
    icon: Download,
    title: "Export & reporting",
    description: "Pull data for investment committees or LP reports",
  },
];

export function CapabilitiesSection() {
  return (
    <section className="py-14 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4">
              What You Get
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              From scattered sources to structured visibility
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We handle the data collection and organization. You get a clear
              picture of tenant health across your entire portfolio.
            </p>
          </div>

          {/* Three-column layout: Inputs → Processing → Outputs */}
          <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-8 items-start">
            {/* Inputs - Data Sources */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                  1
                </span>
                Data Sources
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {dataSources.map((source, index) => {
                  const Icon = source.icon;
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all"
                    >
                      <Icon className="h-5 w-5 text-primary mb-2" />
                      <div className="text-sm font-medium text-foreground">
                        {source.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {source.category}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Arrow connector */}
            <div className="hidden lg:flex flex-col items-center justify-center py-20">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-border to-border" />
              <div className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center my-4">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
              <div className="w-px h-16 bg-gradient-to-b from-border via-border to-transparent" />
            </div>

            {/* Mobile arrow */}
            <div className="lg:hidden flex justify-center py-4">
              <div className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center rotate-90 lg:rotate-0">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Outputs */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                  2
                </span>
                What You See
              </h3>
              <div className="space-y-3">
                {outputs.map((output, index) => {
                  const Icon = output.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {output.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {output.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
