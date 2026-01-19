"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, User, ChevronRight } from "lucide-react";
import { StatusBadge, EventTypeBadge } from "@/components/ui/status-badge";
import type { TenantStatus, EventType } from "@/types";

interface PropertyDetail {
  id: string;
  name: string;
  city: string;
  state: string;
  assetClass: string;
}

interface TenantAtProperty {
  id: string;
  name: string;
  status: TenantStatus;
  suiteLabel: string | null;
  rentShareEstimate: number | null;
  latestEvent: {
    id: string;
    headline: string;
    date: string;
  } | null;
}

interface RecentEvent {
  id: string;
  tenantId: string;
  eventType: EventType;
  headline: string;
  date: string;
}

interface PropertyDetailResponse {
  property: PropertyDetail;
  tenants: TenantAtProperty[];
  recentEvents: RecentEvent[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [data, setData] = useState<PropertyDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllTenants, setShowAllTenants] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/properties/${propertyId}`);
        if (!response.ok) throw new Error("Failed to load property");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to load property:", error);
      } finally {
        setLoading(false);
      }
    }
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

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
        <p className="text-muted-foreground">Property not found</p>
        <Link href="/properties" className="text-primary hover:underline mt-2 inline-block">
          ← Back to properties
        </Link>
      </div>
    );
  }

  const { property, tenants = [], recentEvents = [] } = data;

  // Filter tenants: show only those with events or watch/critical status, unless "Show all" is enabled
  const filteredTenants = showAllTenants
    ? tenants
    : tenants.filter(
        (t) => t.latestEvent || t.status === "critical" || t.status === "watch"
      );

  const tenantsWithEvents = tenants.filter((t) => t.latestEvent || t.status === "critical" || t.status === "watch");
  const hiddenStableCount = tenants.length - tenantsWithEvents.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back Link */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to properties
      </Link>

      {/* Property Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          {property.name}
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{property.city}, {property.state}</span>
          <span className="px-2 py-0.5 rounded bg-muted text-xs">{property.assetClass}</span>
        </div>
      </header>

      {/* Tenants Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Tenants ({filteredTenants.length}{!showAllTenants && hiddenStableCount > 0 ? ` of ${tenants.length}` : ""})
          </h2>
          {hiddenStableCount > 0 && (
            <button
              onClick={() => setShowAllTenants(!showAllTenants)}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              {showAllTenants ? "Hide stable tenants" : `Show all (${hiddenStableCount} stable)`}
            </button>
          )}
        </div>
        {filteredTenants.length === 0 ? (
          <div className="py-12 text-center rounded-xl border border-dashed border-border/50 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              {showAllTenants ? "No tenants at this property" : "No tenants with events or alerts"}
            </p>
            {!showAllTenants && hiddenStableCount > 0 && (
              <button
                onClick={() => setShowAllTenants(true)}
                className="text-xs text-primary hover:underline mt-2"
              >
                Show {hiddenStableCount} stable tenants
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {filteredTenants.map((tenant) => (
              <Link
                key={tenant.id}
                href={`/tenants/${tenant.id}`}
                className="block p-4 hover:bg-muted/50 transition-colors group first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {tenant.name}
                      </h3>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {tenant.suiteLabel && <span>{tenant.suiteLabel}</span>}
                        {tenant.rentShareEstimate && (
                          <span> · {(tenant.rentShareEstimate * 100).toFixed(0)}% rent share</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={tenant.status} size="sm" />
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                {tenant.latestEvent && (
                  <div className="ml-11 text-xs">
                    <span className="text-muted-foreground">Latest: </span>
                    <span className="text-foreground">{tenant.latestEvent.headline}</span>
                    <span className="text-muted-foreground ml-2">{formatDate(tenant.latestEvent.date)}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Events Section */}
      {recentEvents.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Recent Events
          </h2>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block rounded-xl border border-border bg-card p-4 hover:border-white/10 hover:bg-card/80 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <EventTypeBadge type={event.eventType} size="sm" />
                  <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
                </div>
                <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {event.headline}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
