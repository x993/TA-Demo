"use client";

import {
  Code2,
  Upload,
  Database,
  ArrowRight,
  Shield,
} from "lucide-react";

const integrations = [
  {
    icon: Code2,
    title: "REST API",
    description: "Full API access for custom integrations. Push data in, pull insights out.",
    features: ["webhooks --real-time", "bulk import/export", "rate-limit config"],
  },
  {
    icon: Upload,
    title: "CSV Upload",
    description: "Drop a spreadsheet and we'll handle the rest. Automatic field mapping included.",
    features: ["drag-and-drop", "smart-column-detect", "validation --strict"],
  },
  {
    icon: Database,
    title: "Database Sync",
    description: "Connect directly to your property management system or data warehouse.",
    features: ["scheduled-sync", "stream --real-time", "yardi mri --connect"],
  },
];

export function IntegrationsSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container px-4">
        {/* Header with terminal chrome */}
        <div className="text-center mb-16">
          {/* Enterprise Ready badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Enterprise Ready
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Connect your data, your way
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Multiple integration options to fit your existing workflow. Get started in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <div
                key={index}
                className="group rounded-xl border border-border overflow-hidden bg-gradient-to-b from-card to-background hover:border-primary/30 transition-all duration-300"
              >
                {/* Terminal window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-negative/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-positive/60" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono ml-2">
                    integration.config
                  </span>
                </div>

                <div className="p-6">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {integration.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    {integration.description}
                  </p>

                  {/* Code-style features with $ prefix */}
                  <div className="space-y-2 font-mono text-sm">
                    {integration.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/80 transition-colors"
                      >
                        <span className="text-primary">$</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* API docs link */}
        <div className="text-center mt-10">
          <a
            href="/docs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <Code2 className="h-4 w-4" />
            View API Documentation
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
