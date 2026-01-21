"use client";

import {
  Code2,
  Upload,
  Database,
  ArrowRight,
} from "lucide-react";

const integrations = [
  {
    icon: Code2,
    title: "REST API",
    description: "Full API access for custom integrations. Push data in, pull insights out.",
    features: ["Webhooks for real-time updates", "Bulk import/export", "Rate limiting controls"],
  },
  {
    icon: Upload,
    title: "CSV Upload",
    description: "Drop a spreadsheet and we'll handle the rest. Automatic field mapping included.",
    features: ["Drag-and-drop interface", "Smart column detection", "Validation & error handling"],
  },
  {
    icon: Database,
    title: "Database Sync",
    description: "Connect directly to your property management system or data warehouse.",
    features: ["Scheduled syncs", "Real-time streaming", "Yardi, MRI & more"],
  },
];

export function IntegrationsSection() {
  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="text-center mb-12">
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
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {integration.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {integration.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {integration.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* API docs link */}
        <div className="text-center mt-8">
          <a
            href="/docs"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View API Documentation
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
