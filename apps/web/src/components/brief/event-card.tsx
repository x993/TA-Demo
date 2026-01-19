"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EventTypeBadge } from "@/components/ui/status-badge";
import { formatDateShort } from "@/lib/utils";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="p-4 hover:border-white/10 transition-colors cursor-pointer">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <EventTypeBadge type={event.eventType} />
          <span className="text-xs text-muted-foreground">
            {formatDateShort(event.eventDate)}
          </span>
        </div>

        {/* Tenant name */}
        <h3 className="font-semibold text-sm mb-1">{event.tenantName}</h3>

        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {event.headline}
        </p>

        {/* Property badges */}
        {event.properties.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.properties.map((property) => (
              <span
                key={property.id}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {property.name}
              </span>
            ))}
          </div>
        )}
      </Card>
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
      <div className="py-12 text-center">
        <div className="text-4xl mb-4">📄</div>
        <p className="text-sm font-medium text-foreground mb-1">
          No material events this week
        </p>
        <p className="text-xs text-muted-foreground">
          All monitored tenants had quiet disclosure activity.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Recent Events</h3>
        {hasMore && (
          <Link
            href="/alerts"
            className="text-xs text-primary hover:underline"
          >
            View All →
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {displayEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
