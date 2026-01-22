"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Calendar, Play, Building2, Users } from "lucide-react";
import { format, subDays } from "date-fns";

interface ConfigureScanTabProps {
  onStartScan: (config: ScanConfiguration) => void;
}

interface ScanConfiguration {
  tenantSelection: "all" | "by_status" | "custom";
  selectedStatuses: string[];
  selectedTenantIds: string[];
  selectedPropertyIds: string[];
  dataSources: string[];
  dateRange: { from: Date; to: Date };
}

const statusOptions = [
  { id: "critical", label: "Critical", color: "bg-negative" },
  { id: "watch", label: "Watch", color: "bg-amber-500" },
  { id: "stable", label: "Stable", color: "bg-positive" },
  { id: "improving", label: "Improving", color: "bg-blue-500" },
];

const dataSourceOptions = [
  { id: "sec", label: "SEC Filings", enabled: true },
  { id: "news", label: "News & Press", enabled: true },
  { id: "courts", label: "Court Records", enabled: true },
  { id: "dnb", label: "D&B", enabled: true },
  { id: "moodys", label: "Moody's", enabled: false },
  { id: "experian", label: "Experian", enabled: false },
];

const dateRangeOptions = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "14d", label: "Last 14 days", days: 14 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "custom", label: "Custom range", days: null },
];

// Mock tenant data
const mockTenants = [
  { id: "apex", name: "Apex Retail Group", status: "watch" },
  { id: "northstar", name: "Northstar Holdings", status: "critical" },
  { id: "metro", name: "Metro Grocers", status: "stable" },
  { id: "techcorp", name: "TechCorp Solutions", status: "stable" },
  { id: "greenleaf", name: "Greenleaf Industries", status: "improving" },
];

// Mock property data
const mockProperties = [
  { id: "prop-1", name: "Downtown Tower", tenantCount: 12 },
  { id: "prop-2", name: "Riverside Plaza", tenantCount: 8 },
  { id: "prop-3", name: "Tech Campus West", tenantCount: 15 },
  { id: "prop-4", name: "Harbor Point", tenantCount: 6 },
];

export function ConfigureScanTab({ onStartScan }: ConfigureScanTabProps) {
  const [tenantSelection, setTenantSelection] = useState<"all" | "by_status" | "custom">("all");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["critical", "watch"]);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [dataSources, setDataSources] = useState<string[]>(["sec", "news", "courts", "dnb"]);
  const [dateRange, setDateRange] = useState("7d");
  const [customFromDate, setCustomFromDate] = useState(format(subDays(new Date(), 7), "yyyy-MM-dd"));
  const [customToDate, setCustomToDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [tenantSearch, setTenantSearch] = useState("");

  const toggleStatus = (statusId: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((s) => s !== statusId)
        : [...prev, statusId]
    );
  };

  const toggleDataSource = (sourceId: string) => {
    setDataSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((s) => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  const toggleTenant = (tenantId: string) => {
    setSelectedTenants((prev) =>
      prev.includes(tenantId)
        ? prev.filter((t) => t !== tenantId)
        : [...prev, tenantId]
    );
  };

  const toggleProperty = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((p) => p !== propertyId)
        : [...prev, propertyId]
    );
  };

  const filteredTenants = mockTenants.filter((t) =>
    t.name.toLowerCase().includes(tenantSearch.toLowerCase())
  );

  const handleStartScan = () => {
    const selectedRange = dateRangeOptions.find((r) => r.id === dateRange);
    const from = dateRange === "custom"
      ? new Date(customFromDate)
      : subDays(new Date(), selectedRange?.days || 7);
    const to = dateRange === "custom" ? new Date(customToDate) : new Date();

    onStartScan({
      tenantSelection,
      selectedStatuses,
      selectedTenantIds: selectedTenants,
      selectedPropertyIds: selectedProperties,
      dataSources,
      dateRange: { from, to },
    });
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Tenant & Property Selection */}
          <div className="space-y-6">
            {/* Tenant Selection */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Tenant Selection
                </h3>
              </div>

              <div className="space-y-3">
                {/* All tenants */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tenantSelection"
                    checked={tenantSelection === "all"}
                    onChange={() => setTenantSelection("all")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-foreground">
                    All tenants ({mockTenants.length})
                  </span>
                </label>

                {/* By status */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tenantSelection"
                    checked={tenantSelection === "by_status"}
                    onChange={() => setTenantSelection("by_status")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-foreground">By status:</span>
                </label>

                {tenantSelection === "by_status" && (
                  <div className="ml-7 flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status.id}
                        onClick={() => toggleStatus(status.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                          selectedStatuses.includes(status.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full", status.color)} />
                        {status.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Custom selection */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tenantSelection"
                    checked={tenantSelection === "custom"}
                    onChange={() => setTenantSelection("custom")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-foreground">Custom selection</span>
                </label>

                {tenantSelection === "custom" && (
                  <div className="ml-7 space-y-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search tenants..."
                        value={tenantSearch}
                        onChange={(e) => setTenantSearch(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    {/* Tenant list */}
                    <div className="space-y-1 max-h-40 overflow-auto">
                      {filteredTenants.map((tenant) => (
                        <label
                          key={tenant.id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTenants.includes(tenant.id)}
                            onChange={() => toggleTenant(tenant.id)}
                            className="w-4 h-4 rounded text-primary"
                          />
                          <span className="text-sm text-foreground">{tenant.name}</span>
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full ml-auto",
                              tenant.status === "critical" && "bg-negative",
                              tenant.status === "watch" && "bg-amber-500",
                              tenant.status === "stable" && "bg-positive",
                              tenant.status === "improving" && "bg-blue-500"
                            )}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Selection */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Property Selection
                </h3>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProperties.length === 0}
                    onChange={() => setSelectedProperties([])}
                    className="w-4 h-4 rounded text-primary"
                  />
                  <span className="text-sm text-foreground">
                    All properties ({mockProperties.length})
                  </span>
                </label>

                <div className="space-y-1 pl-7">
                  {mockProperties.map((property) => (
                    <label
                      key={property.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedProperties.length > 0 &&
                          selectedProperties.includes(property.id)
                        }
                        onChange={() => toggleProperty(property.id)}
                        className="w-4 h-4 rounded text-primary"
                      />
                      <span className="text-sm text-foreground">{property.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {property.tenantCount} tenants
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Date Range
                </h3>
              </div>

              <div className="space-y-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {dateRangeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {dateRange === "custom" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        From
                      </label>
                      <input
                        type="date"
                        value={customFromDate}
                        onChange={(e) => setCustomFromDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        To
                      </label>
                      <input
                        type="date"
                        value={customToDate}
                        onChange={(e) => setCustomToDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Data Sources */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Data Sources
              </h3>

              <div className="space-y-2">
                {dataSourceOptions.map((source) => (
                  <label
                    key={source.id}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer",
                      dataSources.includes(source.id)
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:bg-muted/50",
                      !source.enabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={dataSources.includes(source.id)}
                      onChange={() => source.enabled && toggleDataSource(source.id)}
                      disabled={!source.enabled}
                      className="w-4 h-4 rounded text-primary"
                    />
                    <span className="text-sm text-foreground">{source.label}</span>
                    {!source.enabled && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        Not configured
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Summary & Start */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Scan Summary
              </h3>

              <dl className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tenants:</dt>
                  <dd className="text-foreground font-medium">
                    {tenantSelection === "all"
                      ? `All (${mockTenants.length})`
                      : tenantSelection === "by_status"
                      ? `${selectedStatuses.length} statuses`
                      : `${selectedTenants.length} selected`}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Properties:</dt>
                  <dd className="text-foreground font-medium">
                    {selectedProperties.length === 0
                      ? `All (${mockProperties.length})`
                      : `${selectedProperties.length} selected`}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Data sources:</dt>
                  <dd className="text-foreground font-medium">
                    {dataSources.length} enabled
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Date range:</dt>
                  <dd className="text-foreground font-medium">
                    {dateRangeOptions.find((r) => r.id === dateRange)?.label}
                  </dd>
                </div>
              </dl>

              <button
                onClick={handleStartScan}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Play className="h-4 w-4" />
                Start Scan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
