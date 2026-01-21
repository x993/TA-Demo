"use client";

import {
  FileText,
  Newspaper,
  Gavel,
  Building,
  TrendingUp,
  Database,
} from "lucide-react";

const dataSources = [
  {
    icon: Building,
    name: "Dun & Bradstreet",
    description: "Business credit reports, payment history, and financial stability indicators",
    category: "Credit Bureau",
  },
  {
    icon: TrendingUp,
    name: "Moody's Analytics",
    description: "Credit ratings, risk assessments, and economic forecasts",
    category: "Ratings Agency",
  },
  {
    icon: FileText,
    name: "SEC Filings",
    description: "10-K, 10-Q, 8-K filings and material event disclosures",
    category: "Regulatory",
  },
  {
    icon: Newspaper,
    name: "News & Press",
    description: "Real-time news monitoring from 10,000+ sources",
    category: "Media",
  },
  {
    icon: Gavel,
    name: "Court Records",
    description: "Bankruptcy filings, liens, judgments, and litigation alerts",
    category: "Legal",
  },
  {
    icon: Database,
    name: "Custom Integrations",
    description: "Connect your own data sources via API or CSV upload",
    category: "Your Data",
  },
];

export function DataSourcesSection() {
  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="text-center mb-12">
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
                className="group relative rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {source.category}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {source.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {source.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
