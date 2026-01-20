import type {
  BriefResponse,
  Tenant,
  Event,
  TenantDetailResponse,
  Evidence,
  DataSource,
  DataSourceCategory,
  Scan,
  ScanConfig,
  EntityNote,
  PortfolioEntity,
} from "@/types";

// Mock Brief Response
export const mockBrief: BriefResponse = {
  id: "brief-001",
  asOfDate: "2026-01-17",
  headline: "3 tenants disclosed material events this week. 4 status changes from last week.",
  updatedAt: "2026-01-17T06:00:00-06:00",
  statusCounts: {
    critical: 3,
    watch: 6,
    stable: 18,
    improving: 3,
  },
  statusChanges: {
    toWatchOrCritical: [
      {
        tenantId: "tenant-apex",
        tenantName: "Apex Retail Group",
        previousStatus: "watch",
        newStatus: "critical",
        eventId: "event-001",
        eventHeadline: "Disclosed going concern language in 10-Q filing",
      },
      {
        tenantId: "tenant-northstar",
        tenantName: "Northstar Apparel",
        previousStatus: "watch",
        newStatus: "critical",
        eventId: "event-002",
        eventHeadline: "Filed Chapter 11 bankruptcy petition",
      },
      {
        tenantId: "tenant-meridian",
        tenantName: "Meridian Healthcare",
        previousStatus: "stable",
        newStatus: "watch",
        eventId: "event-003",
        eventHeadline: "Engaged restructuring advisor per 8-K",
      },
      {
        tenantId: "tenant-techflow",
        tenantName: "TechFlow Solutions",
        previousStatus: "stable",
        newStatus: "watch",
        eventId: "event-004",
        eventHeadline: "Disclosed covenant waiver in credit agreement",
      },
    ],
    toImproving: [
      {
        tenantId: "tenant-bluesky",
        tenantName: "BlueSky Manufacturing",
        previousStatus: "watch",
        newStatus: "improving",
        eventId: "event-005",
        eventHeadline: "Completed debt refinancing, extended maturities to 2030",
      },
    ],
    unchanged: 25,
  },
  recentEvents: [
    {
      id: "event-001",
      tenantId: "tenant-apex",
      tenantName: "Apex Retail Group",
      eventType: "sec_filing",
      eventDate: "2026-01-15",
      headline: "Disclosed going concern language and covenant breach in Q3 10-Q filing",
      summary: "The company filed its Q3 2025 10-Q with the SEC, including language indicating substantial doubt about its ability to continue as a going concern.",
      evidenceCount: 4,
      properties: [
        { id: "prop-park", name: "Park Plaza" },
        { id: "prop-south", name: "Southfield" },
      ],
    },
    {
      id: "event-002",
      tenantId: "tenant-northstar",
      tenantName: "Northstar Apparel",
      eventType: "court_filing",
      eventDate: "2026-01-14",
      headline: "Filed voluntary Chapter 11 bankruptcy petition in Delaware",
      summary: "Northstar Apparel Inc. filed a voluntary petition for reorganization under Chapter 11 of the Bankruptcy Code.",
      evidenceCount: 3,
      properties: [
        { id: "prop-metro", name: "Metropolitan Center" },
      ],
    },
    {
      id: "event-003",
      tenantId: "tenant-meridian",
      tenantName: "Meridian Healthcare",
      eventType: "sec_filing",
      eventDate: "2026-01-13",
      headline: "Engaged Alvarez & Marsal as restructuring advisor per 8-K disclosure",
      summary: "The company disclosed the engagement of a restructuring advisor to assist with balance sheet optimization.",
      evidenceCount: 2,
      properties: [
        { id: "prop-gateway", name: "Gateway Medical" },
        { id: "prop-harbor", name: "Harbor Point" },
      ],
    },
    {
      id: "event-005",
      tenantId: "tenant-bluesky",
      tenantName: "BlueSky Manufacturing",
      eventType: "press_release",
      eventDate: "2026-01-12",
      headline: "Completed $150M debt refinancing, extended maturities to 2030",
      summary: "BlueSky announced successful completion of refinancing, improving liquidity position and extending debt maturities.",
      evidenceCount: 2,
      properties: [
        { id: "prop-lakewood", name: "Lakewood Industrial" },
      ],
    },
  ],
  coverage: {
    tenantsMonitored: 30,
    tenantsWithDisclosures: 6,
    sources: ["SEC EDGAR", "Reuters", "Court Records"],
    asOfDate: "2026-01-17",
  },
};

// Mock Tenant Detail
export const mockTenantDetail: TenantDetailResponse = {
  tenant: {
    id: "tenant-apex",
    name: "Apex Retail Group",
    ticker: "APEX",
    cik: "0001234567",
    industry: "Retail",
    entityType: "public",
    status: "critical",
    propertyCount: 2,
  },
  properties: [
    {
      id: "prop-park",
      name: "Park Plaza Shopping Center",
      city: "Dallas",
      state: "TX",
      assetClass: "Retail",
      tenantCount: 4,
      eventsCount: 1,
    },
    {
      id: "prop-south",
      name: "Southfield Retail Center",
      city: "Houston",
      state: "TX",
      assetClass: "Retail",
      tenantCount: 6,
      eventsCount: 1,
    },
  ],
  events: [
    {
      id: "event-001",
      tenantId: "tenant-apex",
      tenantName: "Apex Retail Group",
      eventType: "sec_filing",
      eventDate: "2026-01-15",
      headline: "Disclosed going concern language and covenant breach in Q3 10-Q filing",
      summary: "The company filed its Q3 2025 10-Q with the SEC, including language indicating substantial doubt about its ability to continue as a going concern.",
      memo: {
        whatWasDisclosed: "The company filed its Q3 2025 10-Q with the SEC, including language indicating substantial doubt about its ability to continue as a going concern. The filing also discloses that the company was not in compliance with its debt service coverage ratio covenant as of September 30, 2025.",
        keyDetails: [
          { fact: "Going concern language included in Note 1 to financial statements", citation: "10-Q, p.12" },
          { fact: "Debt service coverage ratio covenant breached as of Sept 30, 2025", citation: "10-Q, p.47" },
          { fact: "Same-store sales declined 18% year-over-year", citation: "10-Q, p.23" },
          { fact: "Company in active discussions with lenders regarding amendments", citation: "8-K, Item 8.01" },
        ],
        context: [
          "This tenant occupies space at 2 properties in the portfolio",
          "Anchor tenant at both Park Plaza and Southfield Retail Center",
          "This is the second credit agreement amendment disclosed in the past 12 months",
        ],
      },
      evidenceCount: 4,
      properties: [
        { id: "prop-park", name: "Park Plaza" },
        { id: "prop-south", name: "Southfield" },
      ],
    },
  ],
};

// Mock Evidence
export const mockEvidence: Evidence[] = [
  {
    id: "ev-001",
    eventId: "event-001",
    sourceType: "sec_filing",
    title: "Form 10-Q Q3 2025",
    publisher: "SEC EDGAR",
    date: "2026-01-14",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001234567",
    excerpt: "These conditions raise substantial doubt about the Company's ability to continue as a going concern within one year after the date these financial statements are issued.",
    pageReference: "p.12",
  },
  {
    id: "ev-002",
    eventId: "event-001",
    sourceType: "sec_filing",
    title: "Form 8-K Current Report",
    publisher: "SEC EDGAR",
    date: "2026-01-15",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001234567",
    excerpt: "The Company has entered into discussions with its lenders regarding potential amendments to its credit facilities.",
  },
  {
    id: "ev-003",
    eventId: "event-001",
    sourceType: "news",
    title: "Apex Retail warns of going concern risk amid declining sales",
    publisher: "Reuters",
    date: "2026-01-15",
    url: "https://reuters.com/example",
    excerpt: "Apex Retail Group Inc disclosed substantial doubt about its ability to continue operating...",
  },
  {
    id: "ev-004",
    eventId: "event-001",
    sourceType: "news",
    title: "Retail sector struggles continue as Apex reports covenant breach",
    publisher: "Wall Street Journal",
    date: "2026-01-15",
    url: "https://wsj.com/example",
  },
];

// Mock Tenants List
export const mockTenants: Tenant[] = [
  {
    id: "tenant-apex",
    name: "Apex Retail Group",
    ticker: "APEX",
    industry: "Retail",
    entityType: "public",
    status: "critical",
    propertyCount: 2,
    latestEvent: {
      id: "event-001",
      eventType: "sec_filing",
      headline: "Going concern disclosed in 10-Q",
      date: "2026-01-15",
    },
  },
  {
    id: "tenant-northstar",
    name: "Northstar Apparel",
    ticker: "NSTR",
    industry: "Retail",
    entityType: "public",
    status: "critical",
    propertyCount: 1,
    latestEvent: {
      id: "event-002",
      eventType: "court_filing",
      headline: "Chapter 11 bankruptcy filed",
      date: "2026-01-14",
    },
  },
  {
    id: "tenant-urban",
    name: "Urban Fitness Centers",
    industry: "Fitness",
    entityType: "private",
    status: "critical",
    propertyCount: 3,
    latestEvent: {
      id: "event-006",
      eventType: "news",
      headline: "Announced closure of 15 locations",
      date: "2026-01-13",
    },
  },
  {
    id: "tenant-meridian",
    name: "Meridian Healthcare",
    ticker: "MHCS",
    industry: "Healthcare",
    entityType: "public",
    status: "watch",
    propertyCount: 2,
    latestEvent: {
      id: "event-003",
      eventType: "sec_filing",
      headline: "Engaged restructuring advisor",
      date: "2026-01-13",
    },
  },
  {
    id: "tenant-bluesky",
    name: "BlueSky Manufacturing",
    ticker: "BSKY",
    industry: "Manufacturing",
    entityType: "public",
    status: "improving",
    propertyCount: 1,
    latestEvent: {
      id: "event-005",
      eventType: "press_release",
      headline: "Completed debt refinancing",
      date: "2026-01-12",
    },
  },
];

// === SCANS PAGE MOCK DATA ===

// Mock Data Sources
export const mockDataSources: DataSourceCategory[] = [
  {
    id: "public",
    name: "Public Sources",
    expanded: true,
    sources: [
      {
        id: "sec",
        name: "SEC Filings",
        type: "public",
        category: "public",
        enabled: true,
        status: "connected",
        lastSync: "2026-01-20T14:30:00Z",
      },
      {
        id: "news",
        name: "News & Press",
        type: "public",
        category: "public",
        enabled: true,
        status: "connected",
        lastSync: "2026-01-20T14:25:00Z",
      },
      {
        id: "court",
        name: "Court Records",
        type: "public",
        category: "public",
        enabled: true,
        status: "connected",
        lastSync: "2026-01-20T12:00:00Z",
      },
    ],
  },
  {
    id: "subscription",
    name: "Subscriptions",
    expanded: true,
    sources: [
      {
        id: "dnb",
        name: "Dun & Bradstreet",
        type: "subscription",
        category: "subscription",
        enabled: true,
        status: "connected",
        lastSync: "2026-01-20T10:00:00Z",
        isPremium: true,
      },
      {
        id: "experian",
        name: "Experian Business",
        type: "subscription",
        category: "subscription",
        enabled: false,
        status: "pending",
        isPremium: true,
      },
      {
        id: "moodys",
        name: "Moody's Analytics",
        type: "subscription",
        category: "subscription",
        enabled: true,
        status: "connected",
        lastSync: "2026-01-19T18:00:00Z",
        isPremium: true,
      },
    ],
  },
  {
    id: "custom",
    name: "Custom APIs",
    expanded: false,
    sources: [
      {
        id: "internal-crm",
        name: "Internal CRM",
        type: "custom",
        category: "custom",
        enabled: true,
        status: "connected",
        lastSync: "2026-01-20T14:00:00Z",
      },
    ],
  },
  {
    id: "internal",
    name: "Internal Data",
    expanded: false,
    sources: [
      {
        id: "lease-data",
        name: "Lease Database",
        type: "internal",
        category: "internal",
        enabled: true,
        status: "connected",
        lastSync: "2026-01-20T08:00:00Z",
      },
    ],
  },
];

// Mock Scan History
export const mockScans: Scan[] = [
  {
    id: "scan-001",
    startTime: "2026-01-20T14:30:00Z",
    endTime: "2026-01-20T14:32:15Z",
    status: "done",
    tenantsScanned: 12,
    alertsGenerated: 3,
    duration: 135,
    sources: ["sec", "news", "court", "dnb"],
  },
  {
    id: "scan-002",
    startTime: "2026-01-20T13:30:00Z",
    endTime: "2026-01-20T13:31:45Z",
    status: "done",
    tenantsScanned: 12,
    alertsGenerated: 0,
    duration: 105,
    sources: ["sec", "news", "court", "dnb"],
  },
  {
    id: "scan-003",
    startTime: "2026-01-20T12:30:00Z",
    endTime: "2026-01-20T12:32:00Z",
    status: "done",
    tenantsScanned: 12,
    alertsGenerated: 1,
    duration: 120,
    sources: ["sec", "news", "court", "dnb"],
  },
  {
    id: "scan-004",
    startTime: "2026-01-20T11:30:00Z",
    endTime: "2026-01-20T11:31:30Z",
    status: "done",
    tenantsScanned: 12,
    alertsGenerated: 0,
    duration: 90,
    sources: ["sec", "news", "court"],
  },
  {
    id: "scan-005",
    startTime: "2026-01-20T10:30:00Z",
    endTime: "2026-01-20T10:32:45Z",
    status: "done",
    tenantsScanned: 12,
    alertsGenerated: 2,
    duration: 165,
    sources: ["sec", "news", "court", "dnb", "moodys"],
  },
  {
    id: "scan-006",
    startTime: "2026-01-20T09:30:00Z",
    status: "failed",
    tenantsScanned: 8,
    alertsGenerated: 0,
    sources: ["sec", "news"],
  },
  {
    id: "scan-007",
    startTime: "2026-01-20T08:30:00Z",
    endTime: "2026-01-20T08:31:20Z",
    status: "done",
    tenantsScanned: 12,
    alertsGenerated: 1,
    duration: 80,
    sources: ["sec", "news", "court"],
  },
];

// Mock Scan Config
export const mockScanConfig: ScanConfig = {
  frequency: "hourly",
  focusAreas: ["revenue", "litigation"],
  customPrompt: "",
  notifyOnAlerts: true,
};

// Focus area options
export const focusAreaOptions = [
  { id: "bankruptcy", label: "Bankruptcy & Insolvency" },
  { id: "revenue", label: "Revenue Decline" },
  { id: "litigation", label: "Litigation & Legal" },
  { id: "leadership", label: "Leadership Changes" },
  { id: "credit", label: "Credit Rating Changes" },
  { id: "layoffs", label: "Workforce Reductions" },
];

// === PORTFOLIO PAGE MOCK DATA ===

// Mock Entity Notes
export const mockNotes: EntityNote[] = [
  {
    id: "note-001",
    entityType: "tenant",
    entityId: "tenant-apex",
    content: "Spoke with CFO about Q4 guidance revision. They expect to beat lowered expectations.",
    createdAt: "2026-01-18T10:30:00Z",
    createdBy: "John Smith",
  },
  {
    id: "note-002",
    entityType: "property",
    entityId: "prop-park",
    content: "Lease renewal discussion scheduled for Feb 15. Tenant seeking 5% rent reduction.",
    createdAt: "2026-01-15T14:00:00Z",
    createdBy: "Jane Doe",
  },
  {
    id: "note-003",
    entityType: "tenant",
    entityId: "tenant-meridian",
    content: "Monitoring potential M&A activity. No immediate risk to lease obligations.",
    createdAt: "2026-01-19T09:15:00Z",
    createdBy: "John Smith",
  },
];

// Mock Portfolio Entities (unified view)
export const mockPortfolioEntities: PortfolioEntity[] = [
  // Properties
  {
    id: "prop-park",
    type: "property",
    name: "Park Plaza Shopping Center",
    status: "watch",
    subtitle: "Dallas, TX",
    metadata: {
      assetClass: "Retail",
      tenantCount: 4,
      sqft: "125K",
    },
    lastActivity: "2026-01-18T10:30:00Z",
    notes: [],
  },
  {
    id: "prop-south",
    type: "property",
    name: "Southfield Retail Center",
    status: "watch",
    subtitle: "Houston, TX",
    metadata: {
      assetClass: "Retail",
      tenantCount: 6,
      sqft: "180K",
    },
    lastActivity: "2026-01-19T14:00:00Z",
    notes: [],
  },
  {
    id: "prop-metro",
    type: "property",
    name: "Metropolitan Center",
    status: "critical",
    subtitle: "Chicago, IL",
    metadata: {
      assetClass: "Office",
      tenantCount: 12,
      sqft: "450K",
    },
    lastActivity: "2026-01-17T08:00:00Z",
    notes: [],
  },
  {
    id: "prop-gateway",
    type: "property",
    name: "Gateway Medical Campus",
    status: "stable",
    subtitle: "Phoenix, AZ",
    metadata: {
      assetClass: "Medical",
      tenantCount: 8,
      sqft: "275K",
    },
    lastActivity: "2026-01-16T11:00:00Z",
    notes: [],
  },
  {
    id: "prop-lakewood",
    type: "property",
    name: "Lakewood Industrial Park",
    status: "improving",
    subtitle: "Denver, CO",
    metadata: {
      assetClass: "Industrial",
      tenantCount: 3,
      sqft: "520K",
    },
    lastActivity: "2026-01-15T09:30:00Z",
    notes: [],
  },
  // Tenants
  {
    id: "tenant-apex",
    type: "tenant",
    name: "Apex Retail Group",
    status: "critical",
    subtitle: "APEX \u2022 Retail",
    metadata: {
      propertyCount: 2,
      annualRent: "$2.4M",
      leaseEnd: "Dec 2027",
    },
    lastActivity: "2026-01-20T09:00:00Z",
    notes: [],
  },
  {
    id: "tenant-northstar",
    type: "tenant",
    name: "Northstar Apparel",
    status: "critical",
    subtitle: "NSTR \u2022 Retail",
    metadata: {
      propertyCount: 1,
      annualRent: "$890K",
      leaseEnd: "Mar 2026",
    },
    lastActivity: "2026-01-19T16:30:00Z",
    notes: [],
  },
  {
    id: "tenant-meridian",
    type: "tenant",
    name: "Meridian Healthcare",
    status: "watch",
    subtitle: "MHCS \u2022 Healthcare",
    metadata: {
      propertyCount: 2,
      annualRent: "$3.1M",
      leaseEnd: "Jun 2028",
    },
    lastActivity: "2026-01-18T13:45:00Z",
    notes: [],
  },
  {
    id: "tenant-bluesky",
    type: "tenant",
    name: "BlueSky Manufacturing",
    status: "improving",
    subtitle: "BSKY \u2022 Manufacturing",
    metadata: {
      propertyCount: 1,
      annualRent: "$1.8M",
      leaseEnd: "Sep 2029",
    },
    lastActivity: "2026-01-17T10:00:00Z",
    notes: [],
  },
  {
    id: "tenant-urban",
    type: "tenant",
    name: "Urban Fitness Centers",
    status: "critical",
    subtitle: "Private \u2022 Fitness",
    metadata: {
      propertyCount: 3,
      annualRent: "$1.2M",
      leaseEnd: "Aug 2026",
    },
    lastActivity: "2026-01-16T14:20:00Z",
    notes: [],
  },
  // Alerts (events)
  {
    id: "event-001",
    type: "alert",
    name: "Going Concern - Apex Retail",
    status: "critical",
    subtitle: "SEC Filing \u2022 Jan 15, 2026",
    metadata: {
      eventType: "sec_filing",
      affectedProperties: 2,
      severity: "High",
    },
    lastActivity: "2026-01-15T09:00:00Z",
    notes: [],
  },
  {
    id: "event-002",
    type: "alert",
    name: "Chapter 11 Filing - Northstar",
    status: "critical",
    subtitle: "Court Filing \u2022 Jan 14, 2026",
    metadata: {
      eventType: "court_filing",
      affectedProperties: 1,
      severity: "High",
    },
    lastActivity: "2026-01-14T14:00:00Z",
    notes: [],
  },
  {
    id: "event-003",
    type: "alert",
    name: "Restructuring Advisor - Meridian",
    status: "watch",
    subtitle: "SEC Filing \u2022 Jan 13, 2026",
    metadata: {
      eventType: "sec_filing",
      affectedProperties: 2,
      severity: "Medium",
    },
    lastActivity: "2026-01-13T10:00:00Z",
    notes: [],
  },
  {
    id: "event-005",
    type: "alert",
    name: "Debt Refinancing - BlueSky",
    status: "improving",
    subtitle: "Press Release \u2022 Jan 12, 2026",
    metadata: {
      eventType: "press_release",
      affectedProperties: 1,
      severity: "Positive",
    },
    lastActivity: "2026-01-12T08:00:00Z",
    notes: [],
  },
];

// === HELPER FUNCTIONS ===

// Helper function to format relative time
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Helper function to format scan duration
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

// Helper function to format time
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Helper function to format date
export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
