Below is an implementation-grade **Minimum Lovable Product (MLP) spec** for an **instant + flawless**, **mobile-first** demo app that surfaces **credit quality updates** for TA Realty’s tenant base with **expert-level relevance filtering** and **zero noise** by default.

---

# 1) Product Scope

## 1.1 Objective

Deliver a **Railway-hosted demo web app** that:

* Automatically surfaces **credit-material tenant events**—both negative and positive—(news + SEC filings + other signals),
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

### Asset Manager (AM) — 🔬 Microscope user

* Manages 20–30 properties, 1–12+ tenants each
* Asks: **"What do I do next?"**
* Needs: drill-down into specific tenants, actionable memos, evidence
* Entry point: tenant-level issues → memo → evidence

### Head of Assets / Valuations (Exec) — 🌍 Telescope user

* Oversees entire portfolio, manages AMs
* Asks: **"Where should I worry — and why — in under 30 seconds?"**
* Needs: synthesized narrative, aggregated risk posture, week-over-week delta
* Entry point: portfolio narrative → themes → affected entities → drill-down

**Key insight:** Same data, different entry points. Execs want opinionated summaries with judgment baked in — not tenant lists, tables, or dashboards.

## 2.2 Primary Use Cases (demo must nail)

**Executive (telescope):**
1. **Executive Portfolio Brief:** Synthesized narrative + risk posture + week-over-week delta in <30 seconds
2. **Concentration insights:** Where risk is clustering (not single tenants)
3. **Drill-down on demand:** Tap any insight → see supporting entities → memo → evidence

**Asset Manager (microscope):**
4. **AM Credit Brief:** Top 3–7 actionable items for assigned properties
5. **One-tap Action Memo:** What changed → why it matters → what to do → evidence
6. **Property view:** Issues for that property + tenant roster with statuses
7. **Tenant timeline:** Sparse, material-only event history with citations

**Shared:**
8. **Search:** Find any tenant/property instantly; resolves entities cleanly
9. **Alert inbox:** A small, curated queue of "needs review"

---

# 2.3) Executive Briefing Layer — The Missing Telescope

Executives do **not** want tenant lists, long tables, filters, or dashboards with 12 widgets.

They want **opinionated summaries** — the kind humans write in IC memos:

> "Here's what matters this week. Here's what changed. Here's what's getting worse. Here's what you should ask your team about."

This is where the LLM relevance engine becomes visible value.

## Design Principle: Board memo first. Footnotes later.

The executive layer sits **above** the progressive drill-down — not beside it.

**Executive mental model:**
```
Portfolio narrative → Theme → Affected tenants/properties → Analyst memo → Evidence
```

**AM mental model:**
```
Tenant issue → What changed → What to do → Evidence
```

Same data. Different entry point. That's elegant product design.

## What makes execs say "wow"

Not the UI. The **judgment**.

When the system says:

> "While two tenants triggered alerts this week, their risks are unrelated and isolated. No systemic deterioration detected."

That sentence alone is worth the demo. Humans think that way. Dashboards don't.

---

# 3) UX/IA: Mobile-First Information Architecture

## 3.1 Navigation (mobile thumb-friendly)

Bottom Tab Bar:

1. **Brief** — persona-aware landing (Exec vs AM view)
2. **Properties**
3. **Alerts**
4. **Search**

Top right:

* Role switch (Demo): **Executive / Asset Manager**
* Profile menu (optional)

**Persona-based landing:**
* Executive → lands on **Portfolio Credit Brief** (narrative + posture + delta)
* Asset Manager → lands on **AM Credit Brief** (filtered to assigned properties, action-focused)

## 3.2 “No noise by default” UX rules

* **Never show raw feeds** by default.
* Cap “Brief” to **max 7 cards**.
* Cap evidence per memo to **max 10 sources**.
* Hide “Stable” tenants behind a toggle.
* Each screen has **one primary action** and **progressive disclosure**.

## 3.3 Screen specs (mobile)

### A) Executive Portfolio Brief — default landing for Exec

**Goal:** Under 30 seconds to full portfolio understanding. Judgment, not data.

**Above-the-fold sections:**

#### Section 1 — "What you need to know right now"

**Maximum 5 bullets. Hard limit.**

Each bullet is a synthesized insight, not a tenant.

Examples:
> • **Retail exposure deteriorated this week due to two unrelated tenant liquidity events.**
> *Driven by Acme Retail and Northstar Apparel.*

> • **One office property now has >40% rent exposure to watch-list tenants.**
> *Riverside Tower.*

> • **No new bankruptcy risk identified this week.**

Each bullet is tappable → expands into supporting tenants → memo → evidence.

#### Section 2 — Portfolio Risk Posture

Not charts. Not graphs. Three large cards with counts:

* 🟥 **3 Critical exposures**
* 🟨 **9 Watch-list exposures**
* 🟩 **18 Stable**

Tap any card → filtered tenant/property list.

Execs want counts, not percentages.

#### Section 3 — What changed since last week

Three rows only:

* ↑ **4 tenants deteriorated**
* → **23 unchanged**
* ↓ **3 improved**

Tap "deteriorated" → see which ones → drill down.

This instantly communicates: "Is the ship drifting or stable?"

#### Section 4 — Concentration risk (the real exec concern)

Execs lose sleep over concentration, correlation, and clusters — not single tenants.

> **"Where risk is clustering"**

Examples:
* "Retail tenants account for 67% of all watch-list exposure."
* "Two properties contain 55% of portfolio credit risk signals."
* "Three tenants appear across five properties."

Each item expands to show: properties affected, tenants involved, short LLM-generated explanation.

**Thresholds for exec page content:**
1. Must be **aggregated** (not single-entity by default)
2. Must be **interpretable in one sentence**

If it can't be summarized cleanly, it doesn't belong here.

---

### B) AM Credit Brief — default landing for Asset Manager

**Goal:** immediate "wow": clarity + actionability for assigned properties.

**UI components**

* Header: “Today’s Credit Brief”
* Subheader: “Updated: Jan 17, 2026 6:00am CT” (or similar)
* Filter chips: `Critical`, `Watch`, `Positive`, `All` (default = Critical+Watch+Positive)
* List of **cards** (max 7):

  * Tenant name
  * Property badge(s) (or “3 properties”)
  * One-line “What changed”
  * Severity pill (Critical/Watch/Positive)
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
  * Status pill (Critical/Watch/Stable/Improving)
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

* Grouped sections: `Critical`, `Watch`, `Positive`
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

One "credit event" derived from evidence and adjudication.

* `id`
* `tenant_id`
* `event_date`
* `event_type` enum (see below)
* `sentiment` enum: `positive | negative`
* `severity` int (0–100) — magnitude of impact, regardless of sentiment
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
* `status` enum: `critical | watch | stable | improving`
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
* `role` enum: `exec | am`
* `name`
* `assigned_property_ids` uuid[] (for AM)

### PortfolioBriefSnapshot (executive layer)

Precomputed weekly synthesis for the executive view.

* `id`
* `as_of_date` (date)
* `narrative_bullets` jsonb — max 5 synthesized insights with supporting entity IDs
* `risk_posture` jsonb — `{ critical: int, watch: int, stable: int, improving: int }`
* `week_over_week` jsonb — `{ deteriorated: int, improved: int, unchanged: int }`
* `concentration_insights` jsonb — array of clustering observations with affected entity IDs
* `created_at`

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

**Positive event types (equally weighted in relevance)**

* `rating_upgrade` (upgrade or positive outlook change)
* `debt_paydown_or_refinance` (improved capital structure)
* `earnings_beat_or_guidance_raise`
* `liquidity_improvement` (new credit facility, equity raise, asset sale proceeds)
* `expansion_or_growth` (new contracts, market expansion, hiring)
* `operational_turnaround` (margin improvement, cost reduction success)
* `litigation_resolution` (favorable settlement or dismissal)

## 6.2 Severity policy (simple + believable)

Severity = weighted combination:

* Type base weight (e.g., bankruptcy highest negative, rating upgrade highest positive)
* Credibility (source tier)
* Confirmation count (independent sources)
* Tenant importance (exposure proxy)

**Positive events use the same rigor:**

* Positive severity score (0–100) measures magnitude of improvement
* Must meet same evidence thresholds as negative events
* No "hopium"—only confirmed, material improvements surface

Then **tenant watch score** is a smoothed value over time:

* Sticky, non-twitchy
* Big events move it (up or down), small events barely nudge
* Positive events can move a tenant from Watch → Stable or improve confidence

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
  "sentiment": "negative",  // "negative" | "positive"
  "severity": 86,  // 0-100, magnitude of impact (applies to both positive and negative)
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

## 7.4 Executive Portfolio Brief Schema (portfolio-level adjudication)

Once per snapshot (e.g., weekly), run a **portfolio-level synthesis** to generate the executive view.

### Input

* All material tenant events from the period
* Property/tenant relationships
* Prior snapshot for delta computation

### Output (strict schema)

```json
{
  "as_of": "2026-01-17",
  "narrative_bullets": [
    {
      "statement": "Retail exposure deteriorated modestly this week due to two tenant liquidity disclosures.",
      "confidence": 0.91,
      "supporting_tenant_ids": ["uuid1", "uuid2"],
      "supporting_property_ids": ["uuid3"]
    },
    {
      "statement": "No new bankruptcy risk identified this week.",
      "confidence": 0.95,
      "supporting_tenant_ids": [],
      "supporting_property_ids": []
    }
  ],
  "risk_posture": {
    "critical": 3,
    "watch": 9,
    "stable": 18,
    "improving": 4
  },
  "week_over_week": {
    "deteriorated": 4,
    "improved": 3,
    "unchanged": 23
  },
  "concentration_insights": [
    {
      "statement": "Two properties account for over half of current watch-list exposure.",
      "property_ids": ["uuid1", "uuid2"],
      "tenant_ids": ["uuid3", "uuid4", "uuid5"]
    },
    {
      "statement": "Retail tenants account for 67% of all watch-list exposure.",
      "property_ids": [],
      "tenant_ids": ["uuid1", "uuid2", "uuid3"],
      "segment": "retail"
    }
  ]
}
```

### Prompting for portfolio synthesis

* System: "You are a senior credit portfolio analyst. Synthesize individual tenant events into portfolio-level insights. Be conservative. Focus on systemic patterns, concentration risk, and week-over-week changes. Maximum 5 narrative bullets. Each statement must be interpretable in one sentence."
* Hard constraints:
  * Max 5 narrative bullets
  * Max 4 concentration insights
  * Every statement must reference supporting entity IDs
  * If no systemic pattern exists, say so explicitly (e.g., "risks are unrelated and isolated")

## 7.5 Precompute workflow

* For each tenant in demo universe:

  1. Build evidence pack
  2. Run adjudication
  3. Validate JSON schema
  4. Create `Event` if material and above thresholds
  5. Compute tenant score snapshots

* For portfolio (once per snapshot):

  6. Aggregate all material events
  7. Run portfolio-level synthesis
  8. Validate executive brief schema
  9. Store `PortfolioBriefSnapshot`

*(The demo app never calls the model.)*

---

# 8) Backend API (Fast + Cacheable)

Base URL: `/api/v1`

## 8.1 Auth (demo)

* Simple “role token” query param or header:

  * `X-DEMO-ROLE: hoa|am`
  * `X-DEMO-USER: jane`

## 8.2 Endpoints

### Executive Portfolio Brief

* `GET /exec/brief?asOf=2026-01-17`
  Returns the full executive view: narrative, posture, delta, concentration.

Response:

```json
{
  "as_of": "2026-01-17",
  "updated_at": "2026-01-17T12:00:00Z",
  "narrative_bullets": [
    {
      "statement": "Retail exposure deteriorated this week due to two tenant liquidity events.",
      "confidence": 0.91,
      "supporting_tenants": [
        { "tenant_id": "uuid", "tenant_name": "Acme Retail" }
      ],
      "supporting_properties": [
        { "property_id": "uuid", "property_name": "Park Plaza" }
      ]
    }
  ],
  "risk_posture": {
    "critical": 3,
    "watch": 9,
    "stable": 18,
    "improving": 4
  },
  "week_over_week": {
    "deteriorated": [
      { "tenant_id": "uuid", "tenant_name": "Acme Retail", "from_status": "watch", "to_status": "critical" }
    ],
    "improved": [],
    "unchanged_count": 23
  },
  "concentration_insights": [
    {
      "statement": "Two properties contain 55% of portfolio credit risk signals.",
      "properties": [
        { "property_id": "uuid", "property_name": "Riverside Tower" }
      ],
      "tenants": []
    }
  ]
}
```

### AM Brief

* `GET /am/brief?asOf=2026-01-17`
  Returns top 3–7 actionable items for assigned properties.

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

* **10 properties**
* **30 tenants**
* **~15 material events** across two snapshots (today vs last week)

## 10.2 Composition

**By entity type:**

* ~15 public tenants:
  * Negative examples: 8-K debt/covenant, 10-Q liquidity language, earnings shock
  * Positive examples: earnings beat, debt refinance at better terms, rating upgrade
* ~15 private tenants:
  * Negative examples: closures/layoffs/litigation
  * Positive examples: expansion announcements, new funding rounds, acquisition by stronger parent

**By status (orthogonal to entity type):**

* ~18 stable (no material news) — intentionally quiet to prove "no noise"
* ~8 watch/critical (negative events)
* ~4 improving (positive events)

## 10.3 Scripted storylines (so clicks always wow)

* 2–3 critical "red" events (deteriorating credit)
* 5–6 watch "yellow" events
* 3–4 positive "green" events (improving credit)
* ~18 stable (no material news)

Each material event (positive or negative) has:
* Memo with analyst-quality narrative
* Evidence pack with 3–6 items
* A clear "next step" action list (even positive events have actions, e.g., "consider lease extension opportunity")

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

# 13) Demo Script: Executive-First Flow

The demo has two acts: **Executive (telescope)** first, then **Asset Manager (microscope)**.

---

## Act 1: Executive Demo (first 2 minutes)

**Goal:** Judgment, synthesis, and restraint — in under 30 seconds to understanding.

### Step 1 — Open link on phone

Lands on **Portfolio Credit Brief** (not a dashboard, not a table).

Above the fold, exec sees:
* 3–4 narrative bullets (synthesized insights)
* Risk posture cards (3 critical / 9 watch / 18 stable)
* Week-over-week delta (4 deteriorated / 3 improved)

**Within 10 seconds**, exec already understands:
* Where risk sits
* Whether things are getting worse
* Whether action is needed

### Step 2 — Tap a narrative bullet

> "Retail exposure deteriorated this week due to two unrelated tenant liquidity events."

Expands to show:
* 2 tenants (Acme Retail, Northstar Apparel)
* 3 affected properties
* One-sentence explanation

### Step 3 — Tap one tenant → Action Memo

Full analyst-quality memo:
* What changed
* Why it matters (credit)
* Recommended actions
* What to watch next

Evidence available but optional — exec doesn't need to click.

### Step 4 — Back → Tap "Concentration risk"

> "Two properties contain 55% of portfolio credit risk signals."

Shows which properties, which tenants, why.

**At this point, you've demonstrated:**
* ✅ Judgment (not just data)
* ✅ Synthesis (portfolio-level patterns)
* ✅ Restraint (5 bullets, not 50)
* ✅ Auditability (drill-down available)

That's executive magic.

---

## Act 2: Asset Manager Demo (next 2–3 minutes)

**Goal:** Show it's operational, not just a briefing tool.

### Step 5 — Switch role → Asset Manager

Brief now filters to assigned properties only.

Sees:
* "You have 2 items requiring attention"
* Action-focused cards (not narrative)

### Step 6 — Tap top item → Memo → Evidence

Full drill-down:
* Memo with actions
* Evidence bottom sheet with citations
* External links to source documents

### Step 7 — Tap a positive (green) item

Shows improvement memo:
* What got better
* Opportunity actions (e.g., "consider lease extension")

### Step 8 — Properties → pick a property → Issues list

Shows property-level view with tenant roster.

### Step 9 — Search a tenant

Instant typeahead, resolved entity badge, status indicator.

---

## What the exec walks away thinking

* "This is how we should run portfolio oversight."
* "This is judgment, not just data."
* "This saves my team hours."
* "It catches both problems AND opportunities."
* "I can drill down when I want — but I don't have to."

---

## Why this completes the product

| Before | Now |
|--------|-----|
| ✅ Excellent analysis | ✅ Narrative layer |
| ✅ Great drill-down | ✅ Prioritization |
| ❌ No narrative layer | ✅ Aggregation |
| | ✅ Judgment |
| | ✅ Drill-down |
| | ✅ Audit trail |

This is the difference between:
> "Nice tool"

and
> "This is how we should run portfolio oversight."

---

If you want the fastest path to build: next I can output (1) **exact page-by-page component checklist** for the frontend, (2) a **database schema migration**, (3) the **seed dataset format** (CSV/JSON), and (4) the exact **LLM adjudication prompt + JSON Schema** you validate against.
