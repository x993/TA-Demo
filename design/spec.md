Below is an implementation-grade **Minimum Lovable Product (MLP) spec** for an **instant + flawless**, **mobile-first** demo app that surfaces **credit quality updates** for TA Realty’s tenant base with **expert-level relevance filtering** and **zero noise** by default.

---

# 1) Product Scope

## 1.1 Objective

Deliver a **Railway-hosted demo web app** that:

* Automatically surfaces **credit-material tenant events** (news + SEC filings + other signals),
* Produces **analyst-quality, structured memos** with citations,
* Provides **portfolio + property + tenant** views for two personas,
* Is **mobile-responsive** and feels **instant** (precomputed/cached).

## 1.2 Non-goals (explicitly out of scope for MLP)

* Valuation modeling
* Underwriting, rent roll analytics, lease abstraction
* Live monitoring during demo (we simulate “monitoring” via precomputed snapshots)
* Full tenant ingestion UI and data ops tooling (we’ll hardcode/import a demo dataset)

---

# 2) Personas & Core Use Cases

## 2.1 Personas

### Asset Manager (AM)

* Manages 20–30 properties, 1–12+ tenants each
* Needs: “What changed? What should I do? Show me only material items.”

### Head of Assets (HoA)

* Manages AMs and wants a global view
* Needs: “Where are the critical issues? Which AM should act? What’s trending?”

*(Head of Valuations can map to HoA experience: portfolio-wide clarity and auditability.)*

## 2.2 Primary Use Cases (demo must nail)

1. **Portfolio Credit Brief (mobile):** Top 3–7 actionable items only
2. **One-tap Action Memo:** What changed → why it matters → what to do → evidence
3. **Property view:** Issues for that property + tenant roster with statuses
4. **Tenant timeline:** Sparse, material-only event history with citations
5. **Search:** Find any tenant/property instantly; resolves entities cleanly
6. **Alert inbox:** A small, curated queue of “needs review”

---

# 3) UX/IA: Mobile-First Information Architecture

## 3.1 Navigation (mobile thumb-friendly)

Bottom Tab Bar:

1. **Brief**
2. **Properties**
3. **Alerts**
4. **Search**

Top right:

* Role switch (Demo): **Head of Assets / Asset Manager**
* Profile menu (optional)

## 3.2 “No noise by default” UX rules

* **Never show raw feeds** by default.
* Cap “Brief” to **max 7 cards**.
* Cap evidence per memo to **max 10 sources**.
* Hide “Stable” tenants behind a toggle.
* Each screen has **one primary action** and **progressive disclosure**.

## 3.3 Screen specs (mobile)

### A) Brief (Portfolio Credit Brief) — default landing

**Goal:** immediate “wow”: clarity + actionability.

**UI components**

* Header: “Today’s Credit Brief”
* Subheader: “Updated: Jan 17, 2026 6:00am CT” (or similar)
* Filter chips: `Critical`, `Watch`, `All` (default = Critical+Watch)
* List of **cards** (max 7):

  * Tenant name
  * Property badge(s) (or “3 properties”)
  * One-line “What changed”
  * Severity pill (Critical/Watch)
  * Confidence badge (High/Med)
  * Time horizon (Immediate/Near-term/Structural)

**Primary interaction**

* Tap card → **Action Memo**

**Delight interactions**

* Long-press card → Quick Peek (score trend + last event)
* Swipe left → “Assign” (demo-only)

---

### B) Action Memo (Tenant Event Memo) — hero screen

**Goal:** feels like a senior credit analyst wrote it.

**Structure (tight, scannable)**

* Header row:

  * Tenant + status pill
  * Watch score (0–100) + 7-day trend arrow
* Section 1: **What changed** (2–3 sentences max)
* Section 2: **Why it matters (credit)** (max 3 bullets)
* Section 3: **Recommended actions** (max 3 bullets)
* Section 4: **What to watch next** (max 2 bullets)
* CTA button: **View Evidence (N)** opens bottom sheet

**Evidence bottom sheet**

* List (3–10) sources:

  * title, publisher, date
  * “Key excerpt” (2–3 lines)
  * external link icon (opens new tab / in-app viewer)

**Secondary chips**

* `Why` → expands 1–2 sentence credit mechanism
* `Exposure` → shows “Properties: X | Leases: Y | Rent share: (demo)”
* `History` → opens tenant timeline (material-only)

---

### C) Properties

**List view**

* Search bar (property name/city)
* Filter chips: `Needs attention`, `All`
* Property cards:

  * Property name, city
  * Status pill (Critical/Watch/Stable)
  * “Issues: 2” + “Tenants: 9”

**Property detail**

* Section 1: “Issues” (cards, max 5)
* Section 2: “Tenant roster”

  * Default shows only Critical/Watch tenants
  * Toggle: “Show stable tenants”
* Tap a tenant → Tenant timeline

---

### D) Tenant Timeline (material-only)

A vertical timeline of **only** material events with:

* Date + severity
* Title
* 1 sentence summary
* Link to memo / evidence

---

### E) Alerts (Inbox)

A small queue:

* Grouped sections: `Critical`, `Watch`
* Each item supports:

  * Mark reviewed
  * Snooze (24h / 7d) (demo-only, stored locally)

---

### F) Search (instant)

* Typeahead results for **tenants + properties**
* Tenants show “Resolved entity” badge:

  * Public / Private / Unknown
* Tap result → tenant or property

---

# 4) Demo Mode Strategy: “Instant & Flawless”

## 4.1 Demo data principle

Everything is **precomputed**:

* Evidence packs (curated sources)
* LLM adjudications (structured memos + scoring)
* Portfolio snapshots (today vs last week)

Runtime is simply fast retrieval + rendering.

## 4.2 Freshness illusion (honest + confidence-building)

Every page shows:

* “Last refreshed” timestamp
* “Refresh cadence” (Daily / Filing-triggered / Weekly summary)

No claim of “real-time web search” in-demo.

---

# 5) Data Model (Postgres + JSONB)

## 5.1 Entities

### Tenant

* `id` (uuid)
* `name_display`
* `name_legal` (nullable)
* `entity_type` enum: `public | private | unknown`
* `identifiers` jsonb: `{ ticker?, cik?, lei?, website_domain?, duns? }`
* `industry` (nullable)
* `confidence_entity_resolution` float (0–1)
* `created_at`, `updated_at`

### Property

* `id` (uuid)
* `name`
* `address_city`, `address_state`
* `asset_class` (optional)
* `created_at`, `updated_at`

### Lease / Occupancy link (simplified for demo)

* `id`
* `property_id`
* `tenant_id`
* `lease_label` (e.g., “Suite 400”, optional)
* `rent_share_estimate` float (nullable) *(demo can fake this)*

### EvidenceSource

Represents one source item (news/filing/press release).

* `id`
* `tenant_id`
* `source_type` enum: `sec_filing | news | press_release | court | other`
* `title`
* `publisher`
* `published_at`
* `url`
* `excerpt` text (short)
* `raw_text` text (optional, stored but not displayed)
* `dedupe_hash`
* `created_at`

### Event (material-only)

One “credit event” derived from evidence and adjudication.

* `id`
* `tenant_id`
* `event_date`
* `event_type` enum (see below)
* `severity` int (0–100)
* `confidence` float (0–1)
* `time_horizon` enum: `immediate | near_term | structural`
* `headline`
* `summary` text (1–2 lines)
* `memo` jsonb (structured memo output)
* `evidence_ids` uuid[] (references EvidenceSource)
* `created_at`

### TenantScoreSnapshot

* `id`
* `tenant_id`
* `as_of_date` (date)
* `watch_score` int (0–100)
* `delta_7d` int
* `status` enum: `critical | watch | stable`
* `top_event_id` uuid (nullable)

### PropertyScoreSnapshot

* `id`
* `property_id`
* `as_of_date`
* `status` enum
* `watch_score` int
* `issues_count` int

### User (demo-simple)

* `id`
* `role` enum: `hoa | am`
* `name`
* `assigned_property_ids` uuid[] (for AM)

---

# 6) Event Types & Severity Policy

## 6.1 Event types (demo-ready)

* `bankruptcy_or_restructuring`
* `liquidity_stress`
* `covenant_or_debt_event`
* `rating_action` *(stub if not licensed; can still exist as “reported rating action” with source)*
* `sec_material_disclosure` (8-K / risk factor change)
* `earnings_shock_or_guidance_cut`
* `operational_disruption` (closures, layoffs, supply)
* `litigation_or_regulatory`
* `mna_or_divestiture`
* `positive_credit_improvement` (optional)

## 6.2 Severity policy (simple + believable)

Severity = weighted combination:

* Type base weight (e.g., bankruptcy highest)
* Credibility (source tier)
* Confirmation count (independent sources)
* Tenant importance (exposure proxy)

Then **tenant watch score** is a smoothed value over time:

* Sticky, non-twitchy
* Big events move it, small events barely nudge

---

# 7) LLM Adjudication: Schemas & Prompts (Precomputed)

## 7.1 Evidence Pack (input to LLM)

We feed Gemini 3 Pro a tight bundle (max 10 evidence items), already deduped, with the tenant entity card.

### Example `EvidencePack` (stored JSON)

```json
{
  "tenant": {
    "id": "uuid",
    "name_display": "Acme Retail",
    "entity_type": "public",
    "identifiers": { "ticker": "ACME", "cik": "0000123456" },
    "industry": "Retail"
  },
  "as_of": "2026-01-17T12:00:00Z",
  "evidence": [
    {
      "evidence_id": "uuid",
      "source_type": "sec_filing",
      "title": "8-K: Amendment to Credit Agreement",
      "publisher": "SEC EDGAR",
      "published_at": "2026-01-16T21:10:00Z",
      "url": "https://...",
      "excerpt": "Company disclosed covenant relief and increased pricing..."
    }
  ]
}
```

## 7.2 Required LLM Output Schema (strict)

This output is what drives the UI + scoring.

```json
{
  "tenant_id": "uuid",
  "material_event": true,
  "event_type": "covenant_or_debt_event",
  "severity": 86,
  "confidence": 0.87,
  "time_horizon": "near_term",
  "headline": "Covenant relief and pricing increase signals tightening liquidity",
  "what_changed": "2-3 sentences max.",
  "why_it_matters": ["bullet1", "bullet2", "bullet3"],
  "recommended_actions": ["bullet1", "bullet2", "bullet3"],
  "what_to_watch_next": ["bullet1", "bullet2"],
  "citations": [
    {
      "claim": "Covenant relief was obtained and pricing increased.",
      "evidence_id": "uuid",
      "url": "https://..."
    }
  ],
  "evidence_classifications": [
    {
      "evidence_id": "uuid",
      "material": true,
      "reason": "1 sentence",
      "signals": ["covenant_relief", "pricing_increase"]
    }
  ]
}
```

## 7.3 Prompting strategy (so it behaves like a credit analyst)

* System: “You are a senior credit analyst for CRE tenancy risk. You must be conservative. No speculation. Every material claim must cite evidence_id.”
* Hard constraints:

  * Max bullets
  * Max sentence lengths
  * Must output valid JSON
  * If weak evidence → `material_event=false` + short explanation

## 7.4 Precompute workflow

* For each tenant in demo universe:

  1. Build evidence pack
  2. Run adjudication
  3. Validate JSON schema
  4. Create `Event` if material and above thresholds
  5. Compute score snapshots and portfolio brief

*(The demo app never calls the model.)*

---

# 8) Backend API (Fast + Cacheable)

Base URL: `/api/v1`

## 8.1 Auth (demo)

* Simple “role token” query param or header:

  * `X-DEMO-ROLE: hoa|am`
  * `X-DEMO-USER: jane`

## 8.2 Endpoints

### Brief

* `GET /brief?asOf=2026-01-17`
  Returns top 3–7 items for role.

Response:

```json
{
  "as_of": "2026-01-17",
  "updated_at": "2026-01-17T12:00:00Z",
  "items": [
    {
      "tenant_id": "uuid",
      "tenant_name": "Acme Retail",
      "property_badges": ["Park Plaza", "Riverside Mall"],
      "status": "critical",
      "severity": 86,
      "confidence": "high",
      "time_horizon": "near_term",
      "one_liner": "Covenant relief and higher borrowing costs disclosed in 8-K."
    }
  ]
}
```

### Memo

* `GET /tenants/:tenantId/memo?eventId=:eventId`

### Tenant timeline

* `GET /tenants/:tenantId/timeline`

### Evidence list

* `GET /events/:eventId/evidence`

### Properties list

* `GET /properties`
* `GET /properties/:propertyId`

### Alerts inbox

* `GET /alerts`
* `POST /alerts/:alertId/reviewed`
* `POST /alerts/:alertId/snooze` (stores local/demo)

### Search

* `GET /search?q=acme`

## 8.3 Performance

* All endpoints cacheable with ETag
* CDN caching for evidence excerpts
* Prefetch memo + evidence on touchstart

---

# 9) Frontend Implementation (Mobile-first)

## 9.1 Tech

* Next.js (or Remix) + React
* Tailwind
* Component library: shadcn/ui (fast, clean)
* Route-level data loading + prefetch
* Skeleton loaders (but target near-zero visible loading)

## 9.2 Responsive rules

* Mobile-first CSS; desktop is progressive enhancement
* Avoid tables; use stacked cards
* Bottom sheets for evidence
* Tap targets ≥ 44px

## 9.3 Micro-interactions (wow moments)

* Card tap animates into memo (shared element transition)
* Evidence sheet slides up with snap points
* “Why” chip expands inline (no navigation)
* “Exposure” chip shows tiny modal card

---

# 10) Demo Dataset: What to Build

## 10.1 Size

* **12 properties**
* **80–120 tenants**
* **~25 material events** across two snapshots (today vs last week)

## 10.2 Composition

* 8–12 public tenants:

  * include at least: 8-K debt/covenant, 10-Q liquidity language, earnings shock
* 15–25 private tenants:

  * closures/layoffs/litigation
* 50–70 stable tenants:

  * intentionally boring, to prove “no noise”

## 10.3 Scripted storylines (so clicks always wow)

* 3 critical “red” events
* 7–10 watch “yellow”
* 12+ “stable”
  And each critical has:
* Memo
* Evidence pack with 3–6 items
* A clear “next step” action list

---

# 11) Railway Deployment

## 11.1 Services

* Web (Next.js)
* API (Node/Express or FastAPI)
* Postgres
* Redis (optional; can rely on CDN + in-memory for demo)

## 11.2 Demo configuration

* Seed script loads dataset + snapshots
* Environment variable `DEMO_ASOF_DATE=2026-01-17`
* Option to switch to “last week” snapshot via UI toggle

---

# 12) QA & Acceptance Criteria (Demo Readiness)

## 12.1 UX acceptance

* Opening link on iPhone loads Brief and is usable immediately
* Every tap yields a meaningful next step:

  * Brief → Memo → Evidence
* No empty states in demo flow (always something to show)

## 12.2 Noise acceptance

* Brief never exceeds 7 items
* Tenant timeline shows only material events
* Evidence never exceeds 10 sources and is deduped

## 12.3 Credibility acceptance

* Every memo claim maps to a citation (evidence_id + URL)
* Timestamps and “refresh cadence” visible
* Conservative language (no speculation)

## 12.4 Performance acceptance (perceived)

* Time-to-first-content under ~1 second on typical mobile
* Tap transitions feel immediate (prefetch + cached JSON)

---

# 13) What you hand the Head of Valuations in the demo (script)

1. Open link → “Today’s Credit Brief” (5 items)
2. Tap top critical → see memo with recommended actions
3. Tap “View Evidence” → shows filing + excerpt + link
4. Tap “Exposure” → shows which properties impacted
5. Back → Properties → pick a property → Issues list
6. Search a tenant → resolved entity badge + status

He should walk away thinking:

* “This is exactly how we should monitor tenant credit risk”
* “This saves my team hours”
* “This is low-noise and highly actionable”

---

If you want the fastest path to build: next I can output (1) **exact page-by-page component checklist** for the frontend, (2) a **database schema migration**, (3) the **seed dataset format** (CSV/JSON), and (4) the exact **LLM adjudication prompt + JSON Schema** you validate against.
