"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { TenantStatus } from "@/types";

interface TenantFromAPI {
  id: string;
  name: string;
  ticker: string | null;
  cik: string | null;
  industry: string | null;
  entityType: string;
  status: TenantStatus;
  propertyCount: number;
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
  { value: "improving", label: "Improving" },
  { value: "stable", label: "Stable" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function TenantsPage() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") as TenantStatus) || "all";

  const [tenants, setTenants] = useState<TenantFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TenantStatus | "all">(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadTenants() {
      setLoading(true);
      try {
        const statusParam = filter === "all" ? undefined : filter;
        const response = await fetch(`/api/v1/tenants${statusParam ? `?status=${statusParam}` : ""}`);
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

  // Filter by search query
  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tenant.ticker && tenant.ticker.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Count by status
  const statusCounts = tenants.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tenants</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {tenants.length} tenants in portfolio
        </p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tenants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {statusFilters.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilter(status.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              filter === status.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {status.label}
            {filter === "all" && statusCounts[status.value] !== undefined && (
              <span className="ml-1.5 opacity-70">({statusCounts[status.value] || 0})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tenant List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4">
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed border-border/50 bg-muted/20">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No tenants found</p>
          <p className="text-xs text-muted-foreground">
            {searchQuery ? "Try adjusting your search" : "No tenants match this filter"}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {filteredTenants.map((tenant, index) => (
            <Link
              key={tenant.id}
              href={`/tenants/${tenant.id}`}
              className="block p-4 hover:bg-muted/50 transition-colors group first:rounded-t-xl last:rounded-b-xl"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-start justify-between mb-1.5">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {tenant.name}
                </h3>
                <div className="flex items-center gap-2">
                  <StatusBadge status={tenant.status} size="sm" />
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {tenant.ticker && <span>{tenant.ticker} · </span>}
                {tenant.industry && <span>{tenant.industry} · </span>}
                <span>{tenant.propertyCount} {tenant.propertyCount === 1 ? "property" : "properties"}</span>
              </p>

              {tenant.latestEvent && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Latest: </span>
                  <span className="text-foreground">{tenant.latestEvent.headline}</span>
                  <span className="text-muted-foreground ml-2">{formatDate(tenant.latestEvent.date)}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
