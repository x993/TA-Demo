"use client";

import { Building2, Users, Shield, Clock } from "lucide-react";

const stats = [
  {
    icon: Building2,
    value: "$50B+",
    label: "Portfolio Value Monitored",
    description: "Across commercial properties",
  },
  {
    icon: Users,
    value: "500+",
    label: "Tenants Tracked",
    description: "Active credit monitoring",
  },
  {
    icon: Shield,
    value: "99.9%",
    label: "Platform Uptime",
    description: "Enterprise-grade reliability",
  },
  {
    icon: Clock,
    value: "<24h",
    label: "Alert Response Time",
    description: "For critical risk events",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-muted/30 border-y border-border/50">
      <div className="container px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
