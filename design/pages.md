# Credit Oversight Demo

## Complete Page-Level UX & Layout Guide

---

# GLOBAL PRINCIPLES

### 1. Mobile-first always

* Primary viewport: iPhone 13 / 14 Pro (390 × 844 pts)
* Desktop is progressive enhancement, not redesign
* All tap targets ≥ 44px
* Thumb-zone friendly navigation

### 2. No dead ends

Every screen answers: "What would I naturally do next?"

* Always a clear primary action
* Back navigation always available
* Empty states have actionable guidance

### 3. Progressive disclosure

* Summary first → Detail second → Evidence last
* Nothing dense appears without user intent
* Expandable sections over new pages where possible

### 4. Fact-based, not advisory

We report **what happened** — not what it means for their risk.

* ✅ "Apex Retail disclosed going concern language in 10-Q"
* ❌ "Portfolio risk increased this week"

We surface events. They decide what matters.

---

# GLOBAL APP SHELL

## Top Header

**Height:** 56px (mobile), 64px (desktop)

**Left side:**
* App logo/wordmark (max 120px wide)
* Subtle, not dominant

**Right side:**
* Role switcher button:
  ```
  ┌─────────────────────────┐
  │ 👤 Head of Assets  ▾    │
  └─────────────────────────┘
  ```
* Tap opens dropdown:
  * "Head of Assets" (Exec view)
  * "Asset Manager" (AM view)
  * Muted label: "Demo role switch"

**Styling:**
* Background: `bg-background/95 backdrop-blur-sm`
* Border bottom: `border-border/50`
* Sticky on scroll

---

## Bottom Navigation (Mobile)

**Height:** 72px (including safe area)

Four tabs, icon + label:

| Tab | Icon | Label | Route |
|-----|------|-------|-------|
| 1 | `FileText` | Brief | `/` |
| 2 | `Building` | Properties | `/properties` |
| 3 | `Bell` | Alerts | `/alerts` |
| 4 | `Search` | Search | `/search` |

**Active state:**
* Icon: `text-primary`
* Label: `text-primary font-medium`
* Subtle glow under icon

**Inactive state:**
* Icon + label: `text-muted-foreground`

**Interaction:**
* Tap switches tab instantly (no transition delay)
* Current tab re-tap scrolls to top

---

## Desktop Navigation

Bottom nav replaced with horizontal nav in header:

```
Logo    [Brief]  [Properties]  [Alerts]  [Search]         [Role ▾]
```

Active link: `text-primary border-b-2 border-primary`

---

# PAGE 1 — WEEKLY SUMMARY

**Route:** `/`
**Role:** Both (content differs)

This is the landing page. It must communicate value in 5 seconds.

---

## Layout Structure

```
┌────────────────────────────────────┐
│ Header                             │
├────────────────────────────────────┤
│                                    │
│  Page Title                        │
│  "Weekly Summary"                  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │   WEEKLY HEADLINE            │  │
│  │   (Glass Card)               │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌────┐│
│  │Crit. │ │Watch │ │Stable│ │Impr││
│  │  3   │ │  6   │ │  18  │ │  3 ││
│  └──────┘ └──────┘ └──────┘ └────┘│
│                                    │
│  Status Changes This Week          │
│  ┌──────────────────────────────┐  │
│  │ • 4 new Watch/Critical       │  │
│  │ • 1 moved to Improving       │  │
│  │ • 25 unchanged               │  │
│  └──────────────────────────────┘  │
│                                    │
│  Recent Events                     │
│  ┌──────────────────────────────┐  │
│  │ Event Card 1                 │  │
│  ├──────────────────────────────┤  │
│  │ Event Card 2                 │  │
│  ├──────────────────────────────┤  │
│  │ Event Card 3                 │  │
│  └──────────────────────────────┘  │
│                                    │
│  Coverage Statement (muted)        │
│                                    │
├────────────────────────────────────┤
│ Bottom Nav                         │
└────────────────────────────────────┘
```

---

## Section 1: Page Title

**Content:**
* "Weekly Summary" (Exec)
* "Your Properties" (AM)

**Styling:**
* `text-2xl font-bold tracking-tight`
* `mb-6`

**Subtext (optional):**
* "Jan 13–17, 2026"
* `text-sm text-muted-foreground`

---

## Section 2: Weekly Headline

**Component:** Glass Card (premium treatment)

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│  This Week                                  │  ← Label (muted, small)
│                                             │
│  3 tenants disclosed material events.       │  ← Main text (large)
│  4 status changes from last week.           │
│                                             │
│  Updated Jan 17, 2026 · 6:00 AM CT          │  ← Timestamp (muted, tiny)
│                                             │
└─────────────────────────────────────────────┘
```

**Styling:**
```css
/* Glass card treatment */
.weekly-headline {
  background: hsl(var(--card) / 0.5);
  backdrop-filter: blur(24px);
  border: 1px solid hsl(0 0% 100% / 0.05);
  border-radius: 0.75rem;
  padding: 1.5rem;
}
```

**Typography:**
* Label: `text-xs uppercase tracking-wide text-muted-foreground`
* Main: `text-lg font-medium text-foreground leading-relaxed`
* Timestamp: `text-xs text-muted-foreground mt-4`

**Rules:**
* Max 2 sentences
* No risk language
* Always includes counts

**Examples:**
* "3 tenants disclosed material events. 4 status changes from last week."
* "Quiet week. No material disclosures across 30 monitored tenants."
* "1 tenant disclosed going concern language. 2 positive announcements."

---

## Section 3: Tenant Status Counts

**Layout:** 2×2 grid (mobile), 4×1 row (desktop)

**Gap:** `0.75rem`

```
┌─────────────┐  ┌─────────────┐
│ ▲ Critical  │  │ ● Watch     │
│     3       │  │     6       │
│ severe      │  │ notable     │
│ disclosures │  │ disclosures │
└─────────────┘  └─────────────┘

┌─────────────┐  ┌─────────────┐
│ ○ Stable    │  │ ▼ Improving │
│    18       │  │     3       │
│ no material │  │ positive    │
│ events      │  │ disclosures │
└─────────────┘  └─────────────┘
```

**Card Structure:**
```tsx
<div className="rounded-xl border border-white/5 bg-gradient-to-br from-muted/50 to-muted/20 p-4">
  <div className="flex items-center gap-2 mb-2">
    <StatusIcon />
    <span className="text-sm text-muted-foreground">Critical</span>
  </div>
  <div className="text-3xl font-bold tracking-tight tabular-nums">3</div>
  <p className="text-xs text-muted-foreground mt-1">severe disclosures</p>
</div>
```

**Color coding:**
| Status | Icon Color | Count Color |
|--------|------------|-------------|
| Critical | `text-negative` | `text-foreground` |
| Watch | `text-warning` | `text-foreground` |
| Stable | `text-muted-foreground` | `text-foreground` |
| Improving | `text-positive` | `text-foreground` |

**Interaction:**
* Tap → Navigate to `/tenants?status={status}`
* Hover: `hover-lift` effect (subtle translateY)

**What these statuses mean:**
* **Critical:** Going concern, bankruptcy filing, covenant default, severe liquidity
* **Watch:** Covenant amendment, guidance cut, material litigation, restructuring advisor
* **Stable:** No material disclosures found in monitoring period
* **Improving:** Debt paydown, earnings beat, rating upgrade, expansion announcement

---

## Section 4: Status Changes This Week

**Purpose:** Show movement since last snapshot (week-over-week delta)

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Status Changes This Week                    │
├─────────────────────────────────────────────┤
│                                             │
│  ↗  4 moved to Watch or Critical            │  → tap to see list
│     New material disclosures                │
│                                             │
│  ↘  1 moved to Improving                    │  → tap to see list
│     Positive disclosures                    │
│                                             │
│  →  25 unchanged                            │
│     No new material events                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Row Structure:**
```tsx
<button className="flex items-start gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left">
  <span className="text-warning mt-0.5">↗</span>
  <div className="flex-1">
    <p className="text-sm font-medium">4 moved to Watch or Critical</p>
    <p className="text-xs text-muted-foreground">New material disclosures</p>
  </div>
  <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
</button>
```

**Interaction:**
* Tap "moved to Watch/Critical" → Modal or inline expansion showing:
  * Tenant name
  * Previous status → New status
  * Event that triggered change
* Tap each tenant → Navigate to event memo

**Arrow colors:**
* ↗ (negative change): `text-warning`
* ↘ (positive change): `text-positive`
* → (unchanged): `text-muted-foreground`

---

## Section 5: Recent Events

**Purpose:** Chronological list of material disclosures this period

**Header:**
```
Recent Events                    [View All →]
```

**Constraints:**
* Max 7 cards on summary page
* "View All" links to `/alerts` if more exist

**Event Card Structure:**
```
┌─────────────────────────────────────────────┐
│ ┌────────────┐                              │
│ │ SEC Filing │  Jan 15                      │  ← Badge + Date
│ └────────────┘                              │
│                                             │
│ Apex Retail Group                           │  ← Tenant name (bold)
│                                             │
│ Disclosed going concern language and        │  ← Summary (2 lines max)
│ covenant breach in Q3 10-Q filing           │
│                                             │
│ ┌──────────────┐ ┌──────────────┐           │
│ │ Park Plaza   │ │ Southfield   │           │  ← Property badges
│ └──────────────┘ └──────────────┘           │
│                                             │
└─────────────────────────────────────────────┘
```

**Event Card Styling:**
```tsx
<div className="rounded-xl border border-border bg-card p-4 hover:border-white/10 transition-colors cursor-pointer">
  {/* Header row */}
  <div className="flex items-center justify-between mb-3">
    <Badge variant="outline" className="text-xs">
      {eventType}
    </Badge>
    <span className="text-xs text-muted-foreground">{date}</span>
  </div>

  {/* Tenant name */}
  <h3 className="font-semibold text-sm mb-1">{tenantName}</h3>

  {/* Summary */}
  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
    {summary}
  </p>

  {/* Property badges */}
  <div className="flex flex-wrap gap-1.5">
    {properties.map(p => (
      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
        {p.name}
      </span>
    ))}
  </div>
</div>
```

**Event Type Badges:**
| Type | Label | Color |
|------|-------|-------|
| sec_filing | SEC Filing | `bg-primary/10 text-primary` |
| news | News | `bg-muted text-muted-foreground` |
| press_release | Press Release | `bg-muted text-muted-foreground` |
| court | Court Filing | `bg-warning/10 text-warning` |

**Interaction:**
* Tap card → Navigate to `/events/{eventId}`
* Tap property badge → Navigate to `/properties/{propertyId}`

**Empty State:**
```
┌─────────────────────────────────────────────┐
│                                             │
│            📄                               │
│                                             │
│     No material events this week            │
│                                             │
│     All 30 monitored tenants had            │
│     quiet disclosure activity.              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Section 6: Coverage Statement

**Purpose:** Communicate scope and recency

**Position:** Bottom of page, before nav

**Content:**
```
30 tenants monitored · 6 had material disclosures
Sources: SEC EDGAR, Reuters, court records
As of Jan 17, 2026
```

**Styling:**
* `text-xs text-muted-foreground text-center`
* `py-6 border-t border-border/50`

---

## Asset Manager Variant

When role = "am", this page changes:

**Title:** "Your Properties" instead of "Weekly Summary"

**Filters applied:**
* Only shows tenants at AM's assigned properties
* Status counts filtered to assigned properties
* Events filtered to assigned tenants

**Additional section:** Property quick links
```
Your Properties (4)
┌──────────────┐ ┌──────────────┐
│ Park Plaza   │ │ Riverside    │
│ 2 events     │ │ 1 event      │
└──────────────┘ └──────────────┘
```

---

# PAGE 2 — TENANT LIST

**Route:** `/tenants` or `/tenants?status=critical`
**Purpose:** Filtered list of all tenants

---

## Layout

```
┌────────────────────────────────────┐
│ Header                             │
├────────────────────────────────────┤
│                                    │
│  Tenants                           │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🔍 Search tenants...         │  │
│  └──────────────────────────────┘  │
│                                    │
│  [All] [Critical] [Watch] [Stable] │  ← Filter chips
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Tenant Row 1                 │  │
│  ├──────────────────────────────┤  │
│  │ Tenant Row 2                 │  │
│  ├──────────────────────────────┤  │
│  │ Tenant Row 3                 │  │
│  │ ...                          │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│ Bottom Nav                         │
└────────────────────────────────────┘
```

---

## Filter Chips

**Layout:** Horizontal scroll on mobile

```tsx
<div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
  <FilterChip active={filter === 'all'}>All (30)</FilterChip>
  <FilterChip active={filter === 'critical'}>Critical (3)</FilterChip>
  <FilterChip active={filter === 'watch'}>Watch (6)</FilterChip>
  <FilterChip active={filter === 'improving'}>Improving (3)</FilterChip>
  <FilterChip active={filter === 'stable'}>Stable (18)</FilterChip>
</div>
```

**Active chip:** `bg-primary text-primary-foreground`
**Inactive chip:** `bg-muted text-muted-foreground`

---

## Tenant Row

```
┌─────────────────────────────────────────────┐
│                                             │
│  Apex Retail Group              [Critical]  │
│  APEX · Retail · 2 properties               │
│                                             │
│  Latest: Going concern disclosed in 10-Q    │
│  Jan 15, 2026                               │
│                                             │
└─────────────────────────────────────────────┘
```

**Structure:**
```tsx
<Link href={`/tenants/${tenant.id}`} className="block p-4 border-b border-border hover:bg-muted/50 transition-colors">
  <div className="flex items-start justify-between mb-1">
    <h3 className="font-semibold text-sm">{tenant.name}</h3>
    <StatusBadge status={tenant.status} />
  </div>

  <p className="text-xs text-muted-foreground mb-2">
    {tenant.ticker && `${tenant.ticker} · `}
    {tenant.industry}
    {` · ${tenant.propertyCount} properties`}
  </p>

  {tenant.latestEvent && (
    <div className="text-xs">
      <span className="text-muted-foreground">Latest: </span>
      <span className="text-foreground">{tenant.latestEvent.summary}</span>
      <span className="text-muted-foreground ml-2">{tenant.latestEvent.date}</span>
    </div>
  )}
</Link>
```

**Interaction:**
* Tap row → Navigate to `/tenants/{id}`

---

# PAGE 3 — TENANT DETAIL

**Route:** `/tenants/{id}`
**Purpose:** All information about one tenant

---

## Layout

```
┌────────────────────────────────────┐
│ ← Back    Tenant                   │
├────────────────────────────────────┤
│                                    │
│  Apex Retail Group                 │
│  [Critical]  APEX · Retail         │
│                                    │
│  ════════════════════════════════  │
│                                    │
│  PROPERTIES (2)                    │
│  ┌────────────┐ ┌────────────┐     │
│  │ Park Plaza │ │ Southfield │     │
│  │ Anchor     │ │ Anchor     │     │
│  └────────────┘ └────────────┘     │
│                                    │
│  ════════════════════════════════  │
│                                    │
│  RECENT EVENTS                     │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Event Card 1 (expandable)    │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ Event Card 2 (expandable)    │  │
│  └──────────────────────────────┘  │
│                                    │
│  ════════════════════════════════  │
│                                    │
│  TENANT INFO                       │
│  Entity Type: Public               │
│  Ticker: APEX                      │
│  CIK: 0001234567                   │
│  Industry: Retail                  │
│                                    │
├────────────────────────────────────┤
│ Bottom Nav                         │
└────────────────────────────────────┘
```

---

## Tenant Header

```tsx
<div className="mb-6">
  <h1 className="text-xl font-bold tracking-tight mb-2">{tenant.name}</h1>
  <div className="flex items-center gap-3">
    <StatusBadge status={tenant.status} />
    {tenant.ticker && (
      <span className="text-sm text-muted-foreground">{tenant.ticker}</span>
    )}
    <span className="text-sm text-muted-foreground">{tenant.industry}</span>
  </div>
</div>
```

---

## Properties Section

**Header:** "Properties (2)" with count

**Cards:** Small property cards in horizontal scroll or 2-col grid

```tsx
<div className="grid grid-cols-2 gap-3">
  {properties.map(p => (
    <Link href={`/properties/${p.id}`} className="rounded-lg border border-border p-3 hover:border-white/10">
      <p className="font-medium text-sm">{p.name}</p>
      <p className="text-xs text-muted-foreground">{p.city}, {p.state}</p>
      {p.suiteLabel && (
        <p className="text-xs text-muted-foreground mt-1">{p.suiteLabel}</p>
      )}
    </Link>
  ))}
</div>
```

---

## Events Section

**Header:** "Recent Events" or "Event History"

**Event Card (Expandable):**

```
┌─────────────────────────────────────────────┐
│ SEC Filing                        Jan 15 ▼  │
├─────────────────────────────────────────────┤
│                                             │
│ Going concern and covenant breach           │
│ disclosed in Q3 10-Q                        │
│                                             │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  ← Expanded content below
│                                             │
│ WHAT WAS DISCLOSED                          │
│                                             │
│ The company filed its Q3 2025 10-Q with     │
│ the SEC, disclosing substantial doubt       │
│ about its ability to continue as a going    │
│ concern. The filing also indicates breach   │
│ of the debt service coverage covenant.      │
│                                             │
│ KEY DETAILS                                 │
│ • Going concern language in Note 1          │
│ • DSCR covenant breached as of Sept 30      │
│ • Same-store sales declined 18% YoY         │
│ • Negotiations with lenders ongoing         │
│                                             │
│ CONTEXT                                     │
│ • Tenant at 2 properties in portfolio       │
│ • Anchor tenant at both locations           │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │        View Source Documents (4)        │ │
│ └─────────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

**Collapsed state:** Shows only header + 1-line summary
**Expanded state:** Full memo content

**Interaction:**
* Tap header → Toggle expand/collapse
* Tap "View Source Documents" → Open evidence drawer

---

## Tenant Info Section

Static metadata about the tenant entity:

```
TENANT INFO

Entity Type     Public
Ticker          APEX
CIK             0001234567
Industry        Retail
Website         apexretail.com
```

**Styling:** Key-value pairs with muted labels

---

# PAGE 4 — EVENT MEMO

**Route:** `/events/{eventId}`
**Purpose:** Full detail on a single disclosed event

This can also be shown inline (expanded) on the tenant detail page.

---

## Layout

```
┌────────────────────────────────────┐
│ ← Back to Tenant                   │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐  │
│  │ SEC Filing        Jan 15     │  │
│  │                              │  │
│  │ Apex Retail Group            │  │
│  │ [Critical]                   │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │  WHAT WAS DISCLOSED          │  │
│  │                              │  │
│  │  2-3 sentence summary of     │  │
│  │  the disclosure...           │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │  KEY DETAILS                 │  │
│  │                              │  │
│  │  • Bullet point 1            │  │
│  │  • Bullet point 2            │  │
│  │  • Bullet point 3            │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │  CONTEXT                     │  │
│  │                              │  │
│  │  Factual observations...     │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │   View Source Documents (4)  │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│ Bottom Nav                         │
└────────────────────────────────────┘
```

---

## Section: What Was Disclosed

**Purpose:** Plain-language summary of the disclosure

**Constraints:**
* 2-3 sentences max
* No jargon
* No interpretation or opinion
* Present tense ("The company disclosed..." not "This suggests...")

**Example:**
> The company filed its Q3 2025 10-Q with the SEC, including language indicating substantial doubt about its ability to continue as a going concern. The filing also discloses that the company was not in compliance with its debt service coverage ratio covenant as of September 30, 2025.

**Styling:**
* `text-sm leading-relaxed text-foreground`
* Standard card, not glass

---

## Section: Key Details

**Purpose:** Bulleted facts extracted from the source documents

**Constraints:**
* Max 5 bullets
* Each bullet is a fact, not interpretation
* Each bullet should cite source (e.g., "10-Q, Note 1")
* No "this means" or "this suggests" language

**Example:**
* Going concern language included in Note 1 to financial statements *(10-Q, p.12)*
* Debt service coverage ratio covenant breached as of Sept 30, 2025 *(10-Q, p.47)*
* Same-store sales declined 18% year-over-year *(10-Q, p.23)*
* Company in active discussions with lenders regarding amendments *(8-K, Item 8.01)*

**Styling:**
```tsx
<ul className="space-y-2">
  {details.map(d => (
    <li className="flex gap-2 text-sm">
      <span className="text-muted-foreground">•</span>
      <span>
        {d.fact}
        <span className="text-xs text-muted-foreground ml-1">({d.citation})</span>
      </span>
    </li>
  ))}
</ul>
```

---

## Section: Context

**Purpose:** Factual observations about this tenant's presence in the portfolio

**Constraints:**
* Only facts we know from our data
* No risk implications

**Example:**
* This tenant occupies space at 2 properties in the portfolio
* Anchor tenant at both Park Plaza and Southfield Retail Center
* This is the second credit agreement amendment disclosed in the past 12 months

**Styling:** Same as Key Details, but in a separate card

---

## CTA: View Source Documents

**Button styling:**
```tsx
<Button variant="outline" className="w-full">
  <FileText className="h-4 w-4 mr-2" />
  View Source Documents (4)
</Button>
```

**Interaction:** Opens Evidence Drawer (bottom sheet)

---

# EVIDENCE DRAWER

**Trigger:** "View Source Documents" button
**Type:** Bottom sheet (mobile), Side drawer (desktop)

---

## Layout

```
┌─────────────────────────────────────────────┐
│ Source Documents                        ✕   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 📄 Form 10-Q Q3 2025               │    │
│  │    SEC EDGAR · Jan 14, 2026         │    │
│  │                                     │    │
│  │    "These conditions raise          │    │
│  │    substantial doubt about the      │    │
│  │    Company's ability to continue    │    │
│  │    as a going concern..."           │    │
│  │                                     │    │
│  │    [View on SEC EDGAR →]            │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 📄 Form 8-K Current Report         │    │
│  │    SEC EDGAR · Jan 15, 2026         │    │
│  │                                     │    │
│  │    "The Company has entered into    │    │
│  │    discussions with its lenders..." │    │
│  │                                     │    │
│  │    [View on SEC EDGAR →]            │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 📰 "Apex Retail warns of going..."  │    │
│  │    Reuters · Jan 15, 2026           │    │
│  │                                     │    │
│  │    [View Article →]                 │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Evidence Card Structure

```tsx
<div className="rounded-lg border border-border p-4 mb-3">
  {/* Header */}
  <div className="flex items-start gap-3 mb-3">
    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
    <div className="flex-1">
      <p className="font-medium text-sm">{evidence.title}</p>
      <p className="text-xs text-muted-foreground">
        {evidence.publisher} · {evidence.date}
      </p>
    </div>
  </div>

  {/* Excerpt (if available) */}
  {evidence.excerpt && (
    <blockquote className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 mb-3">
      "{evidence.excerpt}"
    </blockquote>
  )}

  {/* Link */}
  <a href={evidence.url} target="_blank" className="text-sm text-primary hover:underline flex items-center gap-1">
    View {evidence.sourceType === 'sec_filing' ? 'on SEC EDGAR' : 'Article'}
    <ExternalLink className="h-3 w-3" />
  </a>
</div>
```

---

## Source Ordering

1. SEC filings first (Tier 1)
2. Company press releases (Tier 1)
3. Major news (Tier 2)
4. Other sources (Tier 3)

---

## Constraints

* Max 10 evidence items
* No duplicates (same story from multiple outlets = show primary only)
* Excerpts max 150 characters

---

# PAGE 5 — PROPERTY LIST

**Route:** `/properties`
**Purpose:** All properties in portfolio

---

## Layout

```
┌────────────────────────────────────┐
│ Header                             │
├────────────────────────────────────┤
│                                    │
│  Properties                        │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🔍 Search properties...      │  │
│  └──────────────────────────────┘  │
│                                    │
│  [All] [Has Events] [By City]      │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Property Row 1               │  │
│  ├──────────────────────────────┤  │
│  │ Property Row 2               │  │
│  │ ...                          │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│ Bottom Nav                         │
└────────────────────────────────────┘
```

---

## Property Row

```
┌─────────────────────────────────────────────┐
│                                             │
│  Park Plaza Shopping Center                 │
│  Dallas, TX · Retail                        │
│                                             │
│  4 tenants · 2 with events                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Interaction:** Tap → Navigate to `/properties/{id}`

---

# PAGE 6 — PROPERTY DETAIL

**Route:** `/properties/{id}`
**Purpose:** All information about one property

---

## Layout

```
┌────────────────────────────────────┐
│ ← Back    Property                 │
├────────────────────────────────────┤
│                                    │
│  Park Plaza Shopping Center        │
│  Dallas, TX · Retail               │
│                                    │
│  ════════════════════════════════  │
│                                    │
│  RECENT EVENTS AT THIS PROPERTY    │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Event Card (tenant event)    │  │
│  └──────────────────────────────┘  │
│                                    │
│  ════════════════════════════════  │
│                                    │
│  TENANTS (4)                       │
│                                    │
│  [Show with events only ▾]         │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ Tenant Row 1                 │  │
│  ├──────────────────────────────┤  │
│  │ Tenant Row 2                 │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│ Bottom Nav                         │
└────────────────────────────────────┘
```

---

## Property Header

```tsx
<div className="mb-6">
  <h1 className="text-xl font-bold tracking-tight mb-1">{property.name}</h1>
  <p className="text-sm text-muted-foreground">
    {property.city}, {property.state} · {property.assetClass}
  </p>
</div>
```

---

## Tenants Section

**Filter toggle:**
* "Tenants with events" (default)
* "All tenants"

**Tenant row at property level:**
```
┌─────────────────────────────────────────────┐
│                                             │
│  Apex Retail Group              [Critical]  │
│  Anchor · Est. 35% rent share               │
│                                             │
│  Latest: Going concern disclosed            │
│                                             │
└─────────────────────────────────────────────┘
```

Shows:
* Tenant name + status
* Suite/unit label if available
* Rent share estimate if available
* Latest event summary if any

---

# PAGE 7 — ALERTS

**Route:** `/alerts`
**Purpose:** Inbox-style event review queue

---

## Layout

```
┌────────────────────────────────────┐
│ Header                             │
├────────────────────────────────────┤
│                                    │
│  Alerts                            │
│                                    │
│  THIS WEEK (3)                     │
│  ┌──────────────────────────────┐  │
│  │ Alert Item 1                 │  │
│  ├──────────────────────────────┤  │
│  │ Alert Item 2                 │  │
│  ├──────────────────────────────┤  │
│  │ Alert Item 3                 │  │
│  └──────────────────────────────┘  │
│                                    │
│  LAST WEEK (2)                     │
│  ┌──────────────────────────────┐  │
│  │ Alert Item 4                 │  │
│  ├──────────────────────────────┤  │
│  │ Alert Item 5                 │  │
│  └──────────────────────────────┘  │
│                                    │
│  OLDER                             │
│  ┌──────────────────────────────┐  │
│  │ Alert Item 6                 │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│ Bottom Nav                         │
└────────────────────────────────────┘
```

---

## Alert Item

```
┌─────────────────────────────────────────────┐
│ ○                                           │  ← Unread indicator
│    Apex Retail Group                        │
│    Going concern disclosed in 10-Q          │
│                                             │
│    SEC Filing · Jan 15                      │
│                                             │
│    [Mark Reviewed]                          │
│                                             │
└─────────────────────────────────────────────┘
```

**States:**
* Unread: `○` indicator, slightly bolder text
* Read: No indicator, normal text weight

**Actions:**
* Tap row → Navigate to event memo
* Tap "Mark Reviewed" → Toggles read state

**Styling:**
* No red/yellow urgency colors in the list
* Calm, organized inbox feel
* Group headers: `text-xs uppercase tracking-wide text-muted-foreground`

---

# PAGE 8 — SEARCH

**Route:** `/search`
**Purpose:** Find any tenant or property

---

## Layout

```
┌────────────────────────────────────┐
│ Header                             │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🔍 Search tenants, props...  │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │  Recent Searches             │  │
│  │  • Apex Retail               │  │
│  │  • Park Plaza                │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─ ─ ─ ─ After typing ─ ─ ─ ─ ─   │
│                                    │
│  TENANTS                           │
│  ┌──────────────────────────────┐  │
│  │ Apex Retail Group [Critical] │  │
│  │ Public · 2 properties        │  │
│  └──────────────────────────────┘  │
│                                    │
│  PROPERTIES                        │
│  ┌──────────────────────────────┐  │
│  │ Park Plaza Shopping Center   │  │
│  │ Dallas, TX                   │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│ Bottom Nav                         │
└────────────────────────────────────┘
```

---

## Search Input

**Behavior:**
* Auto-focus on page load
* Typeahead results appear after 2 characters
* Debounce: 150ms
* Search: tenant name, property name, city, ticker

**Styling:**
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <input
    className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-muted/50 focus:border-primary focus:ring-1 focus:ring-primary"
    placeholder="Search tenants, properties..."
  />
</div>
```

---

## Search Results

**Grouped by type:**
* "TENANTS" header
* "PROPERTIES" header

**Result item:**
```tsx
<Link className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
  <div>
    <p className="font-medium text-sm">{result.name}</p>
    <p className="text-xs text-muted-foreground">{result.subtitle}</p>
  </div>
  {result.status && <StatusBadge status={result.status} size="sm" />}
</Link>
```

---

# LOADING STATES

## Skeleton Patterns

**Card skeleton:**
```tsx
<div className="rounded-xl border border-border p-4 animate-pulse">
  <div className="h-4 w-24 bg-muted rounded mb-3" />
  <div className="h-3 w-full bg-muted rounded mb-2" />
  <div className="h-3 w-2/3 bg-muted rounded" />
</div>
```

**List skeleton:**
```tsx
<div className="space-y-3">
  {[1, 2, 3].map(i => (
    <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
  ))}
</div>
```

## Loading Principles

* Show skeleton immediately
* No spinner unless action takes >2 seconds
* Prefetch on hover/touchstart where possible

---

# ERROR STATES

## API Error

```
┌─────────────────────────────────────────────┐
│                                             │
│            ⚠️                               │
│                                             │
│     Unable to load data                     │
│                                             │
│     Please check your connection            │
│     and try again.                          │
│                                             │
│     [Retry]                                 │
│                                             │
└─────────────────────────────────────────────┘
```

## Empty Search

```
No results for "xyz"

Try searching for:
• Tenant names
• Property names
• Cities
• Ticker symbols
```

---

# RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 768px | Bottom nav, single column, full-width cards |
| Tablet | 768-1024px | Bottom nav, 2-column grids |
| Desktop | > 1024px | Header nav, side panels, wider content |

---

# ANIMATION GUIDELINES

## Allowed

* Page transitions: `200ms ease-out`
* Card hover lift: `transform: translateY(-1px)`
* Expand/collapse: `150ms ease-out`
* Bottom sheet: `300ms spring`
* Fade in on load: `300ms ease-out`

## Not Allowed

* Pulsing indicators
* Continuous animations
* Attention-grabbing effects
* Real-time update indicators

---
