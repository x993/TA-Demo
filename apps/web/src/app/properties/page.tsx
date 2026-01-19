"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building, ChevronRight, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyFromAPI {
  id: string;
  name: string;
  city: string;
  state: string;
  assetClass: string;
  tenantCount: number;
  eventsCount: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/properties");
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Properties</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {properties.length} properties in portfolio
        </p>
      </header>

      {/* Property List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4">
              <div className="h-5 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed border-border/50 bg-muted/20">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Building className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No properties found</p>
          <p className="text-xs text-muted-foreground">Your portfolio is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((property, index) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="rounded-xl border border-border bg-card p-4 hover:border-white/10 hover:bg-card/80 transition-all group"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {property.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {property.city}, {property.state}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded bg-muted">{property.assetClass}</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {property.tenantCount} tenant{property.tenantCount !== 1 ? "s" : ""}
                </span>
                {property.eventsCount > 0 && (
                  <span className="flex items-center gap-1 text-warning">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {property.eventsCount} event{property.eventsCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
