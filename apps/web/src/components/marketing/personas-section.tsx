"use client";

import { Building2, Briefcase, Shield, Users } from "lucide-react";

const personas = [
  {
    icon: Building2,
    title: "Asset Managers",
    workflow: "Review tenant health as part of property oversight",
    benefit:
      "See which tenants need attention without manually pulling credit reports for each one.",
    decisions: [
      "Lease renewal negotiations",
      "Property disposition timing",
      "Tenant outreach priorities",
    ],
  },
  {
    icon: Briefcase,
    title: "Portfolio Managers",
    workflow: "Monitor risk across multiple properties and markets",
    benefit:
      "Get a portfolio-wide view of tenant concentration risk and exposure by sector or geography.",
    decisions: [
      "Acquisition due diligence",
      "Risk allocation reviews",
      "LP reporting preparation",
    ],
  },
  {
    icon: Shield,
    title: "Credit & Risk Teams",
    workflow: "Evaluate tenant creditworthiness for new deals",
    benefit:
      "Access structured data to support underwriting decisions without chasing down multiple sources.",
    decisions: [
      "New lease approvals",
      "Guarantor requirements",
      "Security deposit levels",
    ],
  },
];

export function PersonasSection() {
  return (
    <section className="py-14 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4">
              Use Cases
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Built for teams that manage tenant risk
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're reviewing a single property or a multi-billion
              dollar portfolio, Credit Oversight fits into your existing
              workflow.
            </p>
          </div>

          {/* Persona cards */}
          <div className="grid lg:grid-cols-3 gap-6">
            {personas.map((persona, index) => {
              const Icon = persona.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-border/80 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {persona.title}
                    </h3>
                  </div>

                  {/* Workflow context */}
                  <p className="text-sm text-muted-foreground mb-4 pb-4 border-b border-border/30">
                    {persona.workflow}
                  </p>

                  {/* Benefit */}
                  <p className="text-sm text-foreground/80 mb-5">
                    {persona.benefit}
                  </p>

                  {/* Decisions supported */}
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Decisions supported
                    </div>
                    <ul className="space-y-2">
                      {persona.decisions.map((decision, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                          {decision}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
