"use client";

import {
  Eye,
  FileCheck,
  Lock,
  BookOpen,
  Server,
  RefreshCw,
} from "lucide-react";

const principles = [
  {
    icon: Eye,
    title: "Transparent methodology",
    description:
      "Every data point shows its source. You always know where information came from and when it was last updated.",
  },
  {
    icon: FileCheck,
    title: "Explainable categorization",
    description:
      "Risk categories are based on clear criteria you can review. No mysterious scores or hidden logic.",
  },
  {
    icon: BookOpen,
    title: "Full audit trail",
    description:
      "See the complete history of changes for any tenant. Export logs for compliance or internal review.",
  },
  {
    icon: Lock,
    title: "Enterprise security",
    description:
      "Data encrypted at rest and in transit. Role-based access controls.",
  },
  {
    icon: Server,
    title: "Your data stays yours",
    description:
      "Tenant lists and portfolio data are never shared or used to train models. Full data deletion on request.",
  },
  {
    icon: RefreshCw,
    title: "Continuous monitoring",
    description:
      "Data sources are checked on a regular schedule. You'll see the refresh timestamp for each source.",
  },
];

export function TrustSection() {
  return (
    <section className="relative py-14 overflow-hidden">
      {/* Dark background with pattern */}
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
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider mb-4">
              Why Trust Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Clarity over claims
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're a new company building a product we'd want to use ourselves.
              That means being honest about what we do well and transparent
              about how we do it.
            </p>
          </div>

          {/* Principles grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={index}
                  className="p-5 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-primary/30 transition-all"
                >
                  <Icon className="h-5 w-5 text-primary mb-3" />
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Honest note */}
          <div className="mt-8 p-5 rounded-xl border border-border/30 bg-background/50 backdrop-blur-sm">
            <div className="max-w-3xl">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                A note on what we don't do
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We don't predict tenant defaults. We don't guarantee outcomes.
                We don't replace your judgment or your existing processes.
                Credit Oversight is a tool that gives you better visibility
                faster—but the decisions are always yours to make.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
