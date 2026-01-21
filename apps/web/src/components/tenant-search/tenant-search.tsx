"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  ChevronDown,
  Building2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { TenantStatus, TenantDetailResponse } from "@/types";

interface TenantFromAPI {
  id: string;
  name: string;
  ticker: string | null;
  cik: string | null;
  industry: string | null;
  entityType: string;
  status: TenantStatus;
  propertyCount: number;
  logoUrl: string | null;
  latestEvent: {
    id: string;
    eventType: string;
    headline: string;
    date: string;
  } | null;
}

const statusFilters: { value: TenantStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "watch", label: "Watch" },
  { value: "stable", label: "Stable" },
  { value: "improving", label: "Improving" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TenantSearch() {
  const [tenants, setTenants] = useState<TenantFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TenantStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTenantId, setExpandedTenantId] = useState<string | null>(null);
  const [tenantDetails, setTenantDetails] = useState<Record<string, TenantDetailResponse>>({});
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);

  useEffect(() => {
    async function loadTenants() {
      setLoading(true);
      try {
        const statusParam = filter === "all" ? undefined : filter;
        const response = await fetch(
          `/api/v1/tenants${statusParam ? `?status=${statusParam}` : ""}`
        );
        const data = await response.json();
        setTenants(data);
      } catch (error) {
        console.error("Failed to load tenants:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTenants();
  }, [filter]);

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tenant.ticker &&
        tenant.ticker.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExpand = async (tenantId: string) => {
    if (expandedTenantId === tenantId) {
      setExpandedTenantId(null);
      return;
    }

    setExpandedTenantId(tenantId);

    // Fetch details if not cached
    if (!tenantDetails[tenantId]) {
      setLoadingDetails(tenantId);
      try {
        const details = await api.getTenant(tenantId);
        setTenantDetails((prev) => ({ ...prev, [tenantId]: details }));
      } catch (error) {
        console.error("Failed to load tenant details:", error);
      } finally {
        setLoadingDetails(null);
      }
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <h3 className="text-base font-semibold text-foreground">
          Tenant Lookup
        </h3>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or ticker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto scrollbar-hide">
          {statusFilters.map((status) => (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                filter === status.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tenant List */}
      <div className="h-[480px] overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="py-12 text-center">
            <Search className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No tenants match your search" : "No tenants found"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredTenants.slice(0, 20).map((tenant) => (
              <TenantRow
                key={tenant.id}
                tenant={tenant}
                isExpanded={expandedTenantId === tenant.id}
                isLoading={loadingDetails === tenant.id}
                details={tenantDetails[tenant.id]}
                onToggle={() => handleExpand(tenant.id)}
              />
            ))}
            {filteredTenants.length > 20 && (
              <div className="p-3 text-center">
                <Link
                  href="/tenants"
                  className="text-xs text-primary hover:underline"
                >
                  View all {filteredTenants.length} tenants
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface TenantRowProps {
  tenant: TenantFromAPI;
  isExpanded: boolean;
  isLoading: boolean;
  details?: TenantDetailResponse;
  onToggle: () => void;
}

function TenantRow({
  tenant,
  isExpanded,
  isLoading,
  details,
  onToggle,
}: TenantRowProps) {
  // Generate monogram for fallback
  const monogram = tenant.name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/30 transition-colors text-left group"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
        )}
        {/* Logo/Monogram */}
        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {tenant.logoUrl ? (
            <img
              src={tenant.logoUrl}
              alt={tenant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold text-muted-foreground">
              {monogram}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {tenant.name}
            </span>
            {tenant.ticker && (
              <span className="text-xs text-muted-foreground">
                {tenant.ticker}
              </span>
            )}
          </div>
          {tenant.industry && (
            <p className="text-xs text-muted-foreground truncate">
              {tenant.industry}
            </p>
          )}
        </div>
        <StatusBadge status={tenant.status} size="sm" />
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pl-11 animate-fade-in">
          {isLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Properties */}
              <div className="flex items-start gap-2">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    {tenant.propertyCount}{" "}
                    {tenant.propertyCount === 1 ? "property" : "properties"}
                  </p>
                  {details?.properties && details.properties.length > 0 && (
                    <div className="space-y-1">
                      {details.properties.slice(0, 3).map((prop) => (
                        <p
                          key={prop.id}
                          className="text-xs text-foreground truncate"
                        >
                          {prop.name}, {prop.city}
                        </p>
                      ))}
                      {details.properties.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{details.properties.length - 3} more
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Latest Event */}
              {tenant.latestEvent && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Latest Event
                    </p>
                    <p className="text-xs text-foreground line-clamp-2">
                      {tenant.latestEvent.headline}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatDate(tenant.latestEvent.date)}
                    </p>
                  </div>
                </div>
              )}

              {/* View Details Link */}
              <Link
                href={`/tenants/${tenant.id}`}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
              >
                View full details
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
