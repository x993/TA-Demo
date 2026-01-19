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
