"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Building, ChevronDown, ChevronUp, FileText, ExternalLink } from "lucide-react";
import { StatusBadge, EventTypeBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { TenantStatus, EventType } from "@/types";

interface TenantDetail {
  id: string;
  name: string;
  ticker: string | null;
  cik: string | null;
  industry: string | null;
  entityType: string;
  status: TenantStatus;
  propertyCount: number;
}

interface PropertySummary {
  id: string;
  name: string;
  city: string;
  state: string;
  assetClass: string;
}

interface MemoDetail {
  fact: string;
  citation: string;
}

interface EventMemo {
  whatWasDisclosed: string | null;
  keyDetails: MemoDetail[];
  context: string[];
}

interface EventDetail {
  id: string;
  tenantId: string;
  tenantName: string;
  eventType: EventType;
  eventDate: string;
  headline: string;
  summary: string;
  memo: EventMemo | null;
  evidenceCount: number;
  properties: { id: string; name: string }[];
}

interface TenantDetailResponse {
  tenant: TenantDetail;
  properties: PropertySummary[];
  events: EventDetail[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ExpandableEventCard({
  event,
  onViewEvidence,
}: {
  event: EventDetail;
  onViewEvidence: (eventId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start justify-between text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <EventTypeBadge type={event.eventType} size="sm" />
            <span className="text-xs text-muted-foreground">{formatDate(event.eventDate)}</span>
          </div>
          <p className="text-sm font-medium text-foreground line-clamp-2">
            {event.headline}
          </p>
        </div>
        <div className="ml-3 flex-shrink-0">
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && event.memo && (
        <div className="px-4 pb-4 pt-0 border-t border-border/50 animate-fade-in">
          {/* What was disclosed */}
          {event.memo.whatWasDisclosed && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                What Was Disclosed
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                {event.memo.whatWasDisclosed}
              </p>
            </div>
          )}

          {/* Key Details */}
          {event.memo.keyDetails && event.memo.keyDetails.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Key Details
              </h4>
              <ul className="space-y-2">
                {event.memo.keyDetails.map((detail, idx) => (
                  <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      {detail.fact}
                      {detail.citation && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({detail.citation})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Context */}
          {event.memo.context && event.memo.context.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Context
              </h4>
              <ul className="space-y-1.5">
                {event.memo.context.map((ctx, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-muted-foreground/50 mt-1">•</span>
                    <span>{ctx}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* View Evidence Button */}
          {event.evidenceCount > 0 && (
            <button
              onClick={() => onViewEvidence(event.id)}
              className="mt-4 w-full py-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium text-foreground flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              View Source Documents ({event.evidenceCount})
            </button>
          )}
        </div>
      )}

      {/* Collapsed hint */}
      {!expanded && event.memo && (
        <div className="px-4 pb-3 -mt-1">
          <p className="text-xs text-muted-foreground">
            Tap to see details and {event.evidenceCount} source{event.evidenceCount !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}

export default function TenantDetailPage() {
  const params = useParams();
  const tenantId = params.id as string;

  const [data, setData] = useState<TenantDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEvidence, setShowEvidence] = useState<string | null>(null);

  useEffect(() => {
    async function loadTenant() {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/tenants/${tenantId}`);
        if (!response.ok) throw new Error("Failed to load tenant");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to load tenant:", error);
      } finally {
        setLoading(false);
      }
    }
    if (tenantId) {
      loadTenant();
    }
  }, [tenantId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
          <div className="h-32 bg-muted rounded-xl mb-4"></div>
          <div className="h-48 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-muted-foreground">Tenant not found</p>
        <Link href="/tenants" className="text-primary hover:underline mt-2 inline-block">
          ← Back to tenants
        </Link>
      </div>
    );
  }

  const { tenant, properties, events } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back Link */}
      <Link
        href="/tenants"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tenants
      </Link>

      {/* Tenant Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          {tenant.name}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={tenant.status} />
          {tenant.ticker && (
            <span className="text-sm text-muted-foreground">{tenant.ticker}</span>
          )}
          {tenant.industry && (
            <span className="text-sm text-muted-foreground">{tenant.industry}</span>
          )}
        </div>
      </header>

      {/* Properties Section */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Properties ({properties.length})
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="rounded-xl border border-border bg-card p-4 hover:border-white/10 hover:bg-card/80 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Building className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {property.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {property.city}, {property.state}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {property.assetClass}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Recent Events ({events.length})
        </h2>
        {events.length === 0 ? (
          <div className="py-12 text-center rounded-xl border border-dashed border-border/50 bg-muted/20">
            <p className="text-sm text-muted-foreground">No events for this tenant</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <ExpandableEventCard
                key={event.id}
                event={event}
                onViewEvidence={(eventId) => setShowEvidence(eventId)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Tenant Info Section */}
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Tenant Info
        </h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Entity Type</dt>
            <dd className="text-foreground font-medium capitalize">{tenant.entityType}</dd>
          </div>
          {tenant.ticker && (
            <div>
              <dt className="text-muted-foreground">Ticker</dt>
              <dd className="text-foreground font-medium">{tenant.ticker}</dd>
            </div>
          )}
          {tenant.cik && (
            <div>
              <dt className="text-muted-foreground">CIK</dt>
              <dd className="text-foreground font-medium">{tenant.cik}</dd>
            </div>
          )}
          {tenant.industry && (
            <div>
              <dt className="text-muted-foreground">Industry</dt>
              <dd className="text-foreground font-medium">{tenant.industry}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Evidence Drawer would go here - we'll build it as a separate component */}
    </div>
  );
}
