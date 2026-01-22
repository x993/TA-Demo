"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search as SearchIcon, User, Building, ChevronRight, X } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { TenantStatus } from "@/types";

interface TenantResult {
  id: string;
  name: string;
  ticker: string | null;
  entityType: string;
  status: TenantStatus;
}

interface PropertyResult {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface SearchResults {
  tenants: TenantResult[];
  properties: PropertyResult[];
}

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults(null);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`/api/v1/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      setResults({ tenants: [], properties: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((q: string) => performSearch(q), 300),
    [performSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const totalResults = results ? results.tenants.length + results.properties.length : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find tenants and properties
        </p>
      </header>

      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, ticker, or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full h-12 pl-12 pr-12 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-base"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Query State */}
      {!loading && !hasSearched && (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Type at least 2 characters to search
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && hasSearched && results && (
        <div className="space-y-6">
          {/* Results Count */}
          <p className="text-sm text-muted-foreground">
            {totalResults === 0
              ? "No results found"
              : `${totalResults} result${totalResults !== 1 ? "s" : ""} found`}
          </p>

          {/* Tenants Section */}
          {results.tenants.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Tenants ({results.tenants.length})
              </h2>
              <div className="rounded-xl border border-border bg-card divide-y divide-border">
                {results.tenants.map((tenant) => (
                  <Link
                    key={tenant.id}
                    href={`/tenants/${tenant.id}`}
                    className="block p-4 hover:bg-muted/50 transition-colors group first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            {tenant.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {tenant.ticker && <span>{tenant.ticker} · </span>}
                            <span className="capitalize">{tenant.entityType}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={tenant.status} size="sm" />
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Properties Section */}
          {results.properties.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Properties ({results.properties.length})
              </h2>
              <div className="rounded-xl border border-border bg-card divide-y divide-border">
                {results.properties.map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="block p-4 hover:bg-muted/50 transition-colors group first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Building className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            {property.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {property.city}, {property.state}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* No Results State */}
          {totalResults === 0 && (
            <div className="py-12 text-center rounded-xl border border-dashed border-border/50 bg-muted/20">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No results for "{query}"</p>
              <p className="text-xs text-muted-foreground">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
