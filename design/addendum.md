Got it — you don’t need “one mega doc,” you need a **gap-filler doc** that *complements* the three things you already have:

1. Product spec
2. Theme spec
3. Tech stack / deploy guide

So the right output is a **“Demo Build Addendum”**: only the missing decisions and artifacts that unblock coding and prevent rework.

Here’s exactly what’s missing, grouped into a doc-friendly structure you can paste into Notion/Docs.

---

# Demo Build Addendum (Gaps to Close Before Coding)

## 1) Demo dataset blueprint (the #1 missing piece)

You have size/composition, but you don’t yet have the **actual fixture contract**.

**Add:**

* A list of **named demo properties** (10–12) with city/state
* A list of **named demo tenants** (30–120 depending on scope) with:

  * display name
  * entity type (public/private/unknown)
  * identifiers (ticker/CIK/website) where applicable
* A **lease map** (tenant ↔ property links) with optional exposure proxy
* Two snapshots: `as_of_date = this_week` and `last_week`

**Most important:** a **storyline sheet**:

* 2–3 Critical (red)
* 5–6 Watch (amber)
* 3–4 Improving (green)
* rest Stable

For each storyline, define:

* event_type
* severity/confidence/time_horizon
* memo text (what_changed / why / actions / watch_next)
* 3–6 evidence sources (URLs + excerpts)

Without this, engineering will build UI with placeholder content and the demo won’t “wow.”

---

## 2) Evidence pack policy + source standards

You have anti-hallucination principles, but you need the *operational rules* for what goes into an Evidence Pack.

**Add:**

* Evidence pack cap: **max 10 items**
* Source tier policy:

  * Tier 1: SEC EDGAR + company IR releases
  * Tier 2: reputable business news (define allowed publishers for demo)
  * Tier 3: disallowed for demo (or “never triggers Critical”)
* Deduplication rule:

  * identical story rewrites count as one
* Evidence freshness rule (demo):

  * must be dated within X days of snapshot period, unless it’s a “background” item explicitly labeled

---

## 3) Validator spec (fail-closed rules)

You have “no hallucinations,” but the build needs a concrete validator checklist.

**Add:**

* What is considered a *valid citation*?

  * Must reference `evidence_id`
  * Must include `quote_text` that is a substring of stored `excerpt` or `raw_text`
* Claim coverage:

  * every sentence in `what_changed` must cite ≥1 evidence_id
  * every bullet in `why_it_matters` and `recommended_actions` must cite ≥1 evidence_id OR be explicitly marked as “inference” with a citation
* Event-source consistency:

  * event_type `sec_material_disclosure` requires ≥1 `sec_filing`
  * “bankruptcy” requires court filing or Tier 1/2 corroboration
* Rejection behavior:

  * if validator fails → event is dropped from Brief and logged as `needs_review` (but not shown)

This prevents bad data from ever appearing.

---

## 4) Scoring + gating thresholds (numbers, not just principles)

You describe “non-twitchy,” but dev needs actual thresholds.

**Add:**

* Severity thresholds:

  * Critical: severity ≥ 80 AND confidence ≥ 0.75
  * Watch: severity ≥ 55 AND confidence ≥ 0.60
  * Improving: severity ≥ 55 AND confidence ≥ 0.60 with sentiment positive
* “Corroboration override”:

  * if ≥2 independent Tier 2 sources within 72 hours → allow Watch even if confidence slightly lower
* Sticky score rule:

  * watch_score = smoothed over time; only moves materially on new validated events
* Caps for UI:

  * Exec bullets max 5
  * Brief cards max 7
  * Evidence items max 10

These don’t have to be “perfect,” just consistent and believable for demo.

---

## 5) Screen interaction contracts (wireflow details)

Theme + spec define screens, but not the precise navigation mechanics.

**Add per screen:**

* Is it a route change or a bottom sheet?
* What is preloaded on touchstart?
* What’s the back behavior?

Minimum decisions:

* Memo = route (`/tenant/:id/event/:id`)
* Evidence = bottom sheet inside memo
* Expand “Priority 1” bullet = inline expansion (not a new page)
* “Exposure” = mini modal card

These decisions prevent UI thrash mid-build.

---

## 6) Component inventory + theme mapping

Theme tokens exist, but dev needs a component list.

**Add:**

* `VerdictCard` (glass)
* `PriorityInsightCard` (glass, expandable)
* `PostureCountCard` (standard)
* `DeltaRow` (standard)
* `ConcentrationInsightCard` (standard)
* `ExecQuestionCard` (muted)
* `TenantBriefCard` (standard)
* `MemoCard` (glass)
* `EvidenceSheet` (muted)
* `StatusBadge` + `PriorityBadge`

Also define where glass is allowed:

* Verdict, executive bullets, memo only.

---

## 7) Demo persona switch (how it appears)

You decided explicit switch; the doc should specify **exact placement**.

**Add:**

* Demo-only role switch located in profile menu (top-right)
* Copy: “Viewing as: Head of Assets / Asset Manager (Demo)”
* Production note: removed; RBAC decides default landing + access

---

## 8) Data model deltas vs your tech guide

Your tech guide currently suggests storing memo on tenant (bad fit).

**Add:**

* Authoritative entity schema list:

  * Tenant, Property, LeaseLink, EvidenceSource, Event, TenantScoreSnapshot, PropertyScoreSnapshot, PortfolioBriefSnapshot, User
* Primary key standard (UUID recommended)
* Seed format (JSON fixtures) and required seed script steps:

  1. load fixtures
  2. run validator
  3. emit “demo readiness report”

---

## 9) Demo readiness checklist (fast QA)

A short checklist that says “we can present now.”

**Add:**

* iPhone Safari: loads Brief < 1s
* tap → memo opens instantly
* evidence opens bottom sheet
* every memo claim has a verified quote citation
* no view exceeds caps (5/7/10)
* role switch works
* exec verdict appears on first screen
* “tenants reviewed vs surfaced” appears

---

## 10) Optional but high leverage: “demo script map”

You already have a script in the spec, but you should add a **mapping**:

* which tenant/storyline you click at each step
* what you expect them to see
* backup click paths if they ask “what about X?”

This makes the demo unflappable.

---

### Bottom line

If you add the 10 sections above as an addendum, you’ll have a complete “coding-ready set” with:

* **no missing decisions**
* **no ambiguous contracts**
* **no safety gaps**
* **a deterministic demo dataset**

If you want, I can turn the above into a clean, formatted addendum doc (ready to paste) in the same tone as your current spec.
