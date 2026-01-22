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
    <section className="relative py-20 bg-muted/30 border-y border-border/50 overflow-hidden">
      {/* Centered glow background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container relative px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center group">
                {/* Icon with gradient background and hover shadow */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary mb-5 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Large value with hover-to-primary transition */}
                <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {stat.value}
                </div>

                <div className="text-sm font-semibold text-foreground mb-1">
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
