"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EventTypeBadge } from "@/components/ui/status-badge";
import { formatDateShort } from "@/lib/utils";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="rounded-xl border border-border bg-card p-4 hover:border-white/10 hover:bg-card/80 transition-all cursor-pointer group">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <EventTypeBadge type={event.eventType} />
          <span className="text-xs text-muted-foreground">
            {formatDateShort(event.eventDate)}
          </span>
        </div>

        {/* Tenant name */}
        <h3 className="font-semibold text-sm mb-1.5 text-foreground group-hover:text-primary transition-colors">
          {event.tenantName}
        </h3>

        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {event.headline}
        </p>

        {/* Property badges + chevron */}
        <div className="flex items-center justify-between">
          {event.properties.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {event.properties.map((property) => (
                <span
                  key={property.id}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted/80 text-muted-foreground border border-border/50"
                >
                  {property.name}
                </span>
              ))}
            </div>
          ) : (
            <div />
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

interface RecentEventsProps {
  events: Event[];
  maxItems?: number;
}

export function RecentEvents({ events, maxItems = 7 }: RecentEventsProps) {
  const displayEvents = events.slice(0, maxItems);
  const hasMore = events.length > maxItems;

  if (events.length === 0) {
    return (
      <div className="py-16 text-center rounded-xl border border-dashed border-border/50 bg-muted/20">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📄</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          No material events this week
        </p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          All monitored tenants had quiet disclosure activity.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Recent Events</h3>
        {hasMore && (
          <Link
            href="/alerts"
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View All →
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {displayEvents.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </section>
  );
}
