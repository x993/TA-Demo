"use client";

import {
  Clock,
  FileSearch,
  AlertCircle,
  Layers,
  ArrowRight,
} from "lucide-react";

const problems = [
  {
    icon: FileSearch,
    title: "Scattered data sources",
    description:
      "Credit reports, SEC filings, news alerts, and court records live in different places. Checking them all takes hours.",
  },
  {
    icon: Clock,
    title: "Reactive, not proactive",
    description:
      "Most teams learn about tenant distress when rent is late or a filing hits the news. By then, options are limited.",
  },
  {
    icon: Layers,
    title: "No single view",
    description:
      "Spreadsheets and email threads make it hard to see which tenants need attention across a growing portfolio.",
  },
  {
    icon: AlertCircle,
    title: "Inconsistent process",
    description:
      "Without a standard workflow, some tenants get reviewed quarterly while others slip through the cracks entirely.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-14 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4">
              The Status Quo
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tenant credit monitoring is fragmented
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Asset holders piece together tenant health from multiple systems,
              often discovering issues too late to act. The current approach
              creates blind spots.
            </p>
          </div>

          {/* Problem cards - 2x2 grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {problems.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-border/80 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Transition statement */}
          <div className="mt-10 pt-10 border-t border-border/50">
            <div className="flex items-center gap-4 text-muted-foreground">
              <ArrowRight className="h-5 w-5 text-primary shrink-0" />
              <p className="text-base">
                Credit Oversight brings these sources together in one place, so
                you can monitor tenants continuously instead of chasing
                information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
