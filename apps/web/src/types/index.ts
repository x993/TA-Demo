// Status types
export type TenantStatus = "critical" | "watch" | "stable" | "improving";

export type EventType =
  | "sec_filing"
  | "news"
  | "press_release"
  | "court_filing"
  | "credit_report";

export type SourceType =
  | "sec_filing"
  | "news"
  | "press_release"
  | "court_filing"
  | "credit_report";

// Entity types
export interface Tenant {
  id: string;
  name: string;
  ticker?: string;
  cik?: string;
  industry?: string;
  entityType: "public" | "private";
  status: TenantStatus;
  propertyCount: number;
  latestEvent?: EventSummary;
  logoUrl?: string;
}

export interface Property {
  id: string;
  name: string;
  city: string;
  state: string;
  assetClass: string;
  imageUrl?: string;
  tenantCount: number;
  eventsCount: number;
}

export interface Event {
  id: string;
  tenantId: string;
  tenantName: string;
  eventType: EventType;
  eventDate: string;
  headline: string;
  summary: string;
  memo?: EventMemo;
  evidenceCount: number;
  properties: PropertyBadge[];
}

export interface EventSummary {
  id: string;
  eventType: EventType;
  headline: string;
  date: string;
}

export interface EventMemo {
  whatWasDisclosed: string;
  keyDetails: MemoDetail[];
  context: string[];
  // Action sections
  whyItMatters?: string;
  recommendedActions?: string[];
  whatToWatch?: string[];
}

export interface MemoDetail {
  fact: string;
  citation: string;
}

export interface Evidence {
  id: string;
  eventId: string;
  sourceType: SourceType;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  excerpt?: string;
  pageReference?: string;
}

export interface PropertyBadge {
  id: string;
  name: string;
}

// Executive layer types
export interface PortfolioVerdict {
  direction: string;
  magnitude: string;
  statement: string;
  confidence: number;
}

export interface NarrativeBullet {
  priority: number; // 1 = requires discussion, 2 = monitor, 3 = FYI
  text: string;
  supportingTenantIds: string[];
}

export interface ConcentrationInsight {
  text: string;
  affectedPropertyIds: string[];
  affectedTenantIds: string[];
}

// API Response types
export interface BriefResponse {
  id: string;
  asOfDate: string;
  headline: string;
  updatedAt: string;
  statusCounts: StatusCounts;
  statusChanges: StatusChanges;
  recentEvents: Event[];
  coverage: CoverageStatement;
  // Executive layer (present for exec role only)
  portfolioVerdict?: PortfolioVerdict;
  narrativeBullets?: NarrativeBullet[];
  concentrationInsights?: ConcentrationInsight[];
  execQuestions?: string[];
  // New tile system fields
  reviewStats?: ReviewStats;
  priorityTiles?: PriorityTile[];
  postureTiles?: PostureTile[];
  clusterTiles?: ClusterTile[];
  propertiesAttention?: PropertyAttentionItem[];
  questions?: QuestionItem[];
}

export interface StatusCounts {
  critical: number;
  watch: number;
  stable: number;
  improving: number;
}

export interface StatusChanges {
  toWatchOrCritical: StatusChangeItem[];
  toImproving: StatusChangeItem[];
  unchanged: number;
}

export interface StatusChangeItem {
  tenantId: string;
  tenantName: string;
  previousStatus: TenantStatus;
  newStatus: TenantStatus;
  eventId: string;
  eventHeadline: string;
}

export interface CoverageStatement {
  tenantsMonitored: number;
  tenantsWithDisclosures: number;
  sources: string[];
  asOfDate: string;
}

export interface TenantDetailResponse {
  tenant: Tenant;
  properties: Property[];
  events: Event[];
}

export interface EventDetailResponse {
  event: Event;
  evidence: Evidence[];
}

// Demo role type
export type DemoRole = "exec" | "am";

// === TILE SYSTEM TYPES ===

export interface ReviewStats {
  tenantsReviewed: number;
  tenantsSurfaced: number;
  lastReviewTime: string;
  newSinceLastReview: number;
}

export interface PriorityTile {
  id: string;
  priority: 1 | 2 | 3;
  statement: string;
  affectedTenantCount: number;
  affectedPropertyCount: number;
  primaryTenantIds: string[];
  primaryPropertyIds: string[];
  isNew: boolean;
}

export interface ClusterTile {
  id: string;
  statement: string;
  affectedTenantIds: string[];
  affectedPropertyIds: string[];
  segment?: string;
}

export interface PostureTile {
  status: 'critical' | 'watch' | 'stable';
  count: number;
  delta: number;
  deltaDirection: 'up' | 'down' | 'unchanged';
}

export interface PropertyAttentionItem {
  id: string;
  name: string;
  city: string;
  state: string;
  imageUrl?: string;
  status: TenantStatus;
  issuesCount: number;
}

export interface QuestionItem {
  id: string;
  text: string;
  relatedTenantIds: string[];
  relatedPropertyIds: string[];
}

// === PANEL TYPES ===

export type PanelType = 'property' | 'tenant' | 'priority' | 'cluster';

export interface PanelState {
  isOpen: boolean;
  type: PanelType | null;
  entityId: string | null;
  tileData?: PriorityTile | ClusterTile | null;
}

// === COVERAGE TYPES ===

export interface CoverageToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  lastRefreshed?: string;
}

export interface CoverageSettings {
  global: CoverageToggle[];
  tenantOverrides: Record<string, CoverageToggle[]>;
}

// === MISSION CONTROL / MONITORING TYPES ===

export type MonitoringStatus = 'active' | 'paused' | 'scanning';

export type ScanFrequency = 'continuous' | 'hourly' | 'daily' | 'weekly';

export interface MonitoringState {
  status: MonitoringStatus;
  frequency: ScanFrequency;
  lastScanTime: string;
  nextScheduledScan: string;
  scanProgress: number; // 0-100 when scanning
  sourcesActive: number;
  sourcesTotal: number;
}

// === PORTFOLIO TYPES ===

export interface EntityNote {
  id: string;
  entityType: 'property' | 'tenant' | 'alert';
  entityId: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface ShareConfig {
  entityType: 'property' | 'tenant' | 'alert';
  entityId: string;
  sharedWith: string[];
  permissions: 'view' | 'edit';
  shareLink?: string;
}

export type EntityFilterStatus = 'critical' | 'watch' | 'stable' | 'improving' | 'all';
export type EntityType = 'property' | 'tenant' | 'alert';

export interface PortfolioFilters {
  status: EntityFilterStatus[];
  types: EntityType[];
  search: string;
}

export type QuickAction = 'edit' | 'note' | 'share' | 'archive';

// Unified entity type for portfolio display
export interface PortfolioEntity {
  id: string;
  type: EntityType;
  name: string;
  status: TenantStatus;
  subtitle: string; // e.g., "New York, NY" for property, "AAPL • Technology" for tenant
  metadata: Record<string, string | number>;
  lastActivity?: string;
  notes: EntityNote[];
}

// === SCANS TYPES ===

export interface DataSource {
  id: string;
  name: string;
  type: 'public' | 'subscription' | 'custom' | 'internal';
  category: string;
  enabled: boolean;
  status: 'connected' | 'error' | 'pending';
  lastSync?: string;
  isPremium?: boolean;
}

export interface Scan {
  id: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'done' | 'failed';
  tenantsScanned: number;
  alertsGenerated: number;
  duration?: number;
  sources: string[];
}

export interface ScanConfig {
  frequency: ScanFrequency;
  focusAreas: string[];
  customPrompt?: string;
  notifyOnAlerts: boolean;
}

export interface DataSourceCategory {
  id: string;
  name: string;
  sources: DataSource[];
  expanded?: boolean;
}
