"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Filter } from "lucide-react";
import { EventTypeBadge } from "@/components/ui/status-badge";
import { formatDateShort } from "@/lib/utils";
import type { Event, EventType } from "@/types";

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

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  sec_filing: "SEC Filing",
  news: "News",
  press_release: "Press Release",
  court_filing: "Court Filing",
  credit_report: "Credit Report",
};

interface RecentEventsProps {
  events: Event[];
}

export function RecentEvents({ events }: RecentEventsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<EventType>>(new Set());

  // Get unique event types from the events
  const availableTypes = useMemo(() => {
    const types = new Set<EventType>();
    events.forEach(e => types.add(e.eventType));
    return Array.from(types);
  }, [events]);

  // Filter events by selected types
  const filteredEvents = useMemo(() => {
    if (selectedTypes.size === 0) return events;
    return events.filter(e => selectedTypes.has(e.eventType));
  }, [events, selectedTypes]);

  // Determine how many to show
  const displayEvents = isExpanded ? filteredEvents : filteredEvents.slice(0, 3);
  const hasMore = filteredEvents.length > 3;

  const toggleType = (type: EventType) => {
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setSelectedTypes(newTypes);
  };

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
      {/* Header with filter toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Recent Events</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            showFilters || selectedTypes.size > 0
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filter
          {selectedTypes.size > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
              {selectedTypes.size}
            </span>
          )}
        </button>
      </div>

      {/* Filter checkboxes */}
      {showFilters && (
        <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Show event types:</p>
          <div className="flex flex-wrap gap-2">
            {availableTypes.map(type => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.has(type)}
                  onChange={() => toggleType(type)}
                  className="rounded border-border text-primary focus:ring-primary/50"
                />
                <span className="text-sm">{EVENT_TYPE_LABELS[type]}</span>
              </label>
            ))}
          </div>
          {selectedTypes.size > 0 && (
            <button
              onClick={() => setSelectedTypes(new Set())}
              className="mt-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Events list */}
      <div className="space-y-3">
        {displayEvents.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>

      {/* Expand/collapse button */}
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 py-2.5 rounded-lg border border-border/50 bg-muted/20
                     hover:bg-muted/40 transition-colors text-sm font-medium text-muted-foreground
                     hover:text-foreground flex items-center justify-center gap-2"
        >
          {isExpanded ? (
            <>
              Show less
              <ChevronDown className="h-4 w-4 rotate-180" />
            </>
          ) : (
            <>
              Show {filteredEvents.length - 3} more events
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </section>
  );
}
