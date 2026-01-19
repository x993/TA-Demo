Below is the **full, implementation-grade site map and page-by-page UX guide** for the demo application — written as if you were handing it directly to designers and engineers.

This is intentionally **extremely detailed**, because at this stage ambiguity is your enemy.
Nothing here is theoretical — every element exists to support executive cognition, trust, and flow.

---

# Credit Oversight Demo

## Complete Page-Level UX & Layout Guide

---

# GLOBAL PRINCIPLES (apply everywhere)

### 1. Mobile-first always

* Primary viewport: iPhone 13 / 14 Pro
* Desktop is a *progressive enhancement*, not a redesign
* All critical interactions must be thumb-accessible

### 2. No dead ends

Every screen must answer:

> “What would I naturally want to do next?”

There is always a next click — but never forced.

### 3. Progressive disclosure

Nothing dense appears without intent:

* Summary first
* Explanation second
* Evidence last

### 4. No raw data by default

Executives never see tables or feeds unless they explicitly ask.

---

# GLOBAL APP SHELL

## Top Header (persistent)

**Left**

* App name (small, understated)
* Optional logo

**Right**

* Profile icon
* Role label:

  > Viewing as: Head of Assets (Demo)
* Role switch (dropdown)

This is the *only* place persona changes occur.

---

## Bottom Navigation (mobile)

Persistent, icon + label:

1. **Brief**
2. **Properties**
3. **Alerts**
4. **Search**

Default landing depends on role:

* Exec → Brief (Portfolio)
* AM → Brief (My Properties)

---

# PAGE 1 — EXECUTIVE BRIEF (Head of Assets)

This is the most important page in the entire product.

If this page fails, nothing else matters.

---

## Layout Structure

Vertical stack. No grids. No dashboards.

```
[ Portfolio Verdict ]
[ Priority Items ]
[ Risk Posture ]
[ Week-over-Week Change ]
[ Concentration Insights ]
[ Questions to Raise ]
[ Coverage Statement ]
```

Each section visually distinct but calm.

---

## SECTION 1 — Portfolio Verdict

**Glass card. Prominent.**

### Content:

* Label: “Portfolio Status”
* One synthesized sentence:

> “Risk increased modestly this week, driven by two isolated tenant liquidity disclosures. No systemic deterioration detected.”

### Visual treatment:

* Large type
* Cyan accent underline
* No icons
* No numbers

This is the emotional anchor.

Executives decide whether to trust the product right here.

---

## SECTION 2 — Priority Items

**Max 5. Hard cap.**

Each item is a **judgment statement**, not a tenant.

### Card layout:

* Priority badge:

  * 🔴 Priority 1 — Requires discussion
  * 🟡 Priority 2 — Monitor
  * ⚪ Priority 3 — FYI

* One-sentence insight:

  > “Retail exposure deteriorated due to two unrelated liquidity disclosures.”

* Subtext:

  > “Affects 3 properties · 2 tenants”

### Interaction:

Tap → expands inline to show:

* impacted tenants
* impacted properties
* “View memo” CTA

No navigation yet — still top-level thinking.

---

## SECTION 3 — Portfolio Risk Posture

Three large count cards:

* Critical
* Watch
* Stable

Each shows:

* Count
* Small directional arrow (↑ ↓ →)

No charts.
No percentages.

Tap → navigates to filtered tenant list.

---

## SECTION 4 — Week-over-Week Change

Three rows:

* ↑ 4 deteriorated
* → 62 unchanged
* ↓ 3 improved

Each tappable.

Purpose:

> “Is this getting better or worse?”

---

## SECTION 5 — Concentration Insights

Narrative insights only.

Examples:

* “Two properties account for over half of watch-list exposure.”
* “Retail tenants represent 67% of all flagged items.”
* “One tenant appears across four properties.”

Each insight:

* one sentence
* expandable
* leads to filtered view

This is where executives feel the system “thinking”.

---

## SECTION 6 — Questions to Raise This Week

This is pure executive gold.

Each question is phrased conversationally.

Examples:

* “What is our contingency plan if Acme Retail seeks rent relief?”
* “Are we comfortable with exposure concentration at Riverside Tower?”

Tap → links to the relevant memo or property.

These are *conversation starters*, not tasks.

---

## SECTION 7 — Coverage Statement

Small, muted text at bottom:

> “82 tenants reviewed. 6 required attention.”
> “Prepared as of Jan 17, 2026 using filings and verified sources.”

This builds deep trust.

---

# PAGE 2 — ASSET MANAGER BRIEF

Same layout style — different content.

### Header:

> “Your Credit Brief”

### Content:

* Only assigned properties
* No portfolio synthesis
* No concentration insights
* No executive questions

Sections:

* Items requiring attention
* Watch-list tenants
* Recently improved (optional)

Tone is operational, not strategic.

---

# PAGE 3 — TENANT MEMO (CORE DRILL-DOWN)

This is where the microscope starts.

---

## Layout

Single glass card centered vertically.

### Header:

* Tenant name
* Status badge (Critical / Watch / Improving)
* Watch score trend arrow

No raw score shown by default.

---

## Section 1 — What Changed

2–3 sentences max.

Plain language.

No jargon.

Example:

> “The company disclosed amendments to its credit agreement, including covenant relief and higher borrowing costs.”

---

## Section 2 — Why This Matters (Credit)

Bulleted. Max 3.

Each bullet is a mechanism, not a restatement.

Example:

* “Covenant relief suggests pressure on near-term liquidity.”
* “Higher pricing increases fixed charges during a period of declining margins.”

Each bullet has subtle citation marker.

---

## Section 3 — Recommended Actions

Concrete, human steps.

Examples:

* “Confirm exposure across all properties.”
* “Engage leasing team regarding contingency planning.”

These are *suggestions*, not workflow automation.

---

## Section 4 — What to Watch Next

Forward-looking, bounded.

Examples:

* “Upcoming 10-Q liquidity disclosure.”
* “Potential refinancing announcement.”

This is anticipation — not prediction.

---

## CTA — View Evidence

Button opens bottom sheet.

---

# EVIDENCE DRAWER (BOTTOM SHEET)

This is proof — not a feed.

### Layout:

* Source list only
* 3–10 items max

Each item shows:

* Title
* Publisher
* Date
* Highlighted excerpt
* External link icon

No scrolling fatigue.
No duplicates.
Most relevant sources first.

---

# PAGE 4 — PROPERTY VIEW

Used by both personas.

---

## Property Header:

* Property name
* City / State
* Status badge

---

## Section 1 — Issues at This Property

Cards for:

* tenants with active events
* severity badge
* one-line summary

Tap → tenant memo.

---

## Section 2 — Tenant Roster

Collapsed by default.

Shows:

* Stable tenants hidden
* Toggle: “Show stable tenants”

This reinforces restraint.

---

# PAGE 5 — ALERTS

Inbox-style.

Grouped by:

* Critical
* Watch

Each item:

* tenant
* one-line summary
* time
* “Mark reviewed”

No push urgency.
No red blinking.

This is calm triage.

---

# PAGE 6 — SEARCH

Simple, fast, forgiving.

Searches:

* tenants
* properties

Each result shows:

* resolved entity badge (Public / Private)
* current status

Tap → memo or property.

---

# ROLE SWITCH BEHAVIOR

Located in profile dropdown.

Label clearly:

> “Viewing as: Head of Assets (Demo)”

Switching roles:

* re-renders Brief page
* preserves navigation history
* feels instant

No reload.

---

# DESKTOP BEHAVIOR

Desktop shows:

* wider cards
* two-column layouts where appropriate
* same hierarchy
* same content

Never introduce new information just because there’s space.

---

# WHAT THIS SITE FEELS LIKE

Not:

* SaaS
* dashboard
* monitoring tool
* analytics platform

But:

> “A continuously updated credit committee memo.”

That is the north star.

---

# FINAL CHECK: EXECUTIVE SMELL TEST

If an exec can:

* open the site
* understand portfolio posture in <30 seconds
* click exactly once to get detail
* see proof without digging
* walk into a meeting with better questions

Then the site has succeeded.

And based on this structure — it will.

---
