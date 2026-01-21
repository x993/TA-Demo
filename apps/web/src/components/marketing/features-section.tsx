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
    <section className="py-20 bg-muted/20">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need to monitor tenant risk
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Purpose-built for commercial real estate professionals who need to stay ahead of tenant credit risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="relative">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
