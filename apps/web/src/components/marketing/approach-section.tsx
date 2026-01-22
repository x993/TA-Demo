"use client";

import {
  Database,
  GitMerge,
  Bell,
  LayoutDashboard,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Database,
    title: "Connect your tenant data",
    description:
      "Upload your tenant list or connect via API. We match tenants to their corporate entities across our data sources.",
  },
  {
    number: "02",
    icon: GitMerge,
    title: "We aggregate signals",
    description:
      "Credit reports, SEC filings, court records, and news are pulled together into a unified view for each tenant.",
  },
  {
    number: "03",
    icon: Bell,
    title: "Get notified of changes",
    description:
      "When something changes—a new filing, a credit score shift, a legal action—you see it in your dashboard and inbox.",
  },
  {
    number: "04",
    icon: LayoutDashboard,
    title: "Review and act",
    description:
      "Structured data and clear categorization help you decide which tenants need attention and when.",
  },
];

export function ApproachSection() {
  return (
    <section className="relative py-14 overflow-hidden">
      {/* Dark background with subtle pattern */}
      <div className="absolute inset-0 bg-[#0f1419]">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.5) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container relative px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider mb-4">
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              From fragmented data to structured insight
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No black boxes. Credit Oversight collects, organizes, and surfaces
              information so you can make informed decisions about tenant risk.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative group">
                  {/* Connector line (hidden on last item and mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-32px)] h-px bg-gradient-to-r from-border to-transparent" />
                  )}

                  <div className="relative p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-primary/30 transition-all duration-300">
                    {/* Step number */}
                    <div className="absolute -top-3 -left-1 text-4xl font-bold text-primary/20 select-none">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Content */}
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clarifying note - no hype */}
          <div className="mt-8 p-5 rounded-xl border border-border/30 bg-background/50 backdrop-blur-sm">
            <div className="flex items-start gap-4 max-w-3xl mx-auto">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary text-sm font-medium">i</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-medium">
                    A note on methodology:
                  </span>{" "}
                  Credit Oversight surfaces information and organizes it for
                  review. We don't predict defaults or guarantee outcomes. Our
                  job is to give you faster, more complete visibility—what you
                  do with it is up to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
