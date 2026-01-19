"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import { EventTypeBadge } from "@/components/ui/status-badge";
import type { EventType } from "@/types";

interface EventFromBrief {
  id: string;
  tenantId: string;
  tenantName: string;
  eventType: EventType;
  eventDate: string;
  headline: string;
  summary: string;
  evidenceCount: number;
  properties: { id: string; name: string }[];
}

interface BriefResponse {
  recentEvents: EventFromBrief[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateStr);
}

export default function AlertsPage() {
  const [events, setEvents] = useState<EventFromBrief[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/brief");
        const data: BriefResponse = await response.json();
        setEvents(data.recentEvents || []);
      } catch (error) {
        console.error("Failed to load alerts:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Material disclosures requiring attention
        </p>
      </header>

      {/* Alerts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4">
              <div className="h-4 bg-muted rounded w-1/4 mb-3"></div>
              <div className="h-5 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed border-border/50 bg-muted/20">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No alerts</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            All monitored tenants had quiet disclosure activity this week.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block rounded-xl border border-border bg-card p-4 hover:border-white/10 hover:bg-card/80 transition-all group"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <EventTypeBadge type={event.eventType} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeDate(event.eventDate)}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Tenant Name */}
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1.5">
                {event.tenantName}
              </h3>

              {/* Headline */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {event.headline}
              </p>

              {/* Properties + Evidence Count */}
              <div className="flex items-center justify-between">
                {event.properties.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {event.properties.slice(0, 3).map((property) => (
                      <span
                        key={property.id}
                        className="text-xs px-2.5 py-1 rounded-full bg-muted/80 text-muted-foreground border border-border/50"
                      >
                        {property.name}
                      </span>
                    ))}
                    {event.properties.length > 3 && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-muted/80 text-muted-foreground">
                        +{event.properties.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <div />
                )}
                <span className="text-xs text-muted-foreground">
                  {event.evidenceCount} source{event.evidenceCount !== 1 ? "s" : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
