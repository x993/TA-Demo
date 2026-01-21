"use client";

import {
  Brain,
  Bell,
  Users,
  LineChart,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Our AI continuously analyzes tenant data to identify risk patterns and predict potential defaults before they happen.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Get instant notifications when tenant credit profiles change, new filings appear, or risk scores shift.",
  },
  {
    icon: Users,
    title: "Easy Onboarding",
    description: "Upload your tenant list and we'll automatically match and begin monitoring. Setup takes minutes, not days.",
  },
  {
    icon: LineChart,
    title: "Risk Scoring",
    description: "Proprietary risk scores combine multiple data sources into a single, actionable metric for each tenant.",
  },
  {
    icon: Shield,
    title: "Portfolio Protection",
    description: "Identify concentration risk, sector exposure, and portfolio-wide vulnerabilities at a glance.",
  },
  {
    icon: Zap,
    title: "Automated Scans",
    description: "Schedule regular scans or run them on-demand. We check all enabled sources and surface what matters.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container px-4">
        {/* Section Header with accent line */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need to monitor tenant risk
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Purpose-built for commercial real estate professionals who need to stay ahead of tenant credit risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient highlight overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
