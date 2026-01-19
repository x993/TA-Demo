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
