# Demo — Complete Theme Specification

> Design system for institutional credit monitoring UI.
> Dark theme with glass morphism. Calm, authoritative, executive-grade.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Tailwind Configuration](#5-tailwind-configuration)
6. [Global CSS](#6-global-css)
7. [Component Specifications](#7-component-specifications)
8. [Screen-by-Screen Application](#8-screen-by-screen-application)
9. [Icon Reference](#9-icon-reference)
10. [Animation Guidelines](#10-animation-guidelines)

---

## 1. Design Principles

### Core Philosophy

| Principle | Meaning |
|-----------|---------|
| **Judgment-first UI** | Narrative before data. Decisions before documents. |
| **Calm authority** | No flashing, pulsing, or real-time anxiety. |
| **Visible restraint** | Show that many items were reviewed — few surfaced. |
| **Progressive disclosure** | Summary → memo → evidence, always optional. |
| **Executive readability** | Everything legible in under 30 seconds on mobile. |
| **Institutional credibility** | Feels like an IC memo, not a dashboard. |
| **Consistency over cleverness** | Familiar financial UI patterns over novelty. |

### What This Theme Communicates

- "This is serious."
- "This is institutional."
- "This is safe to trust."
- "This was designed for decision-makers."

### What to Avoid

- Real-time telemetry implications
- Pulsing/live indicators
- Operational dashboard patterns
- Chart-heavy layouts
- Urgency-inducing animations

---

## 2. Color System

### Base Colors

```
background:       #1a2332  /* App background */
foreground:       #e0e5eb  /* Primary text */
card:             #212d3d  /* Cards, memos */
muted:            #2a3a4f  /* Secondary surfaces */
muted-foreground: #8b95a5  /* Secondary text */
border:           #303d52  /* Dividers, borders */
input:            #2a3a4f  /* Form inputs */
```

### Accent Colors (Credit Semantics)

```
primary:   #2dd4d4  /* CTAs, links, focus rings */
positive:  #2db994  /* Improving credit, stable */
warning:   #ffa600  /* Watch status, attention */
negative:  #ff5555  /* Critical risk, deterioration */
```

### Opacity Variants

Used for layering and hover states:

```
white/5:   rgba(255, 255, 255, 0.05)  /* Subtle borders */
white/10:  rgba(255, 255, 255, 0.10)  /* Hover borders */
black/30:  rgba(0, 0, 0, 0.30)        /* Card shadows */
black/80:  rgba(0, 0, 0, 0.80)        /* Modal overlays */
```

### Status Color Mapping

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| Critical | negative | `#ff5555` | Immediate attention required |
| Watch | warning | `#ffa600` | Monitoring required |
| Stable | muted-foreground | `#8b95a5` | No action needed |
| Improving | positive | `#2db994` | Positive trajectory |
| Priority 1 | negative | `#ff5555` | Highest priority |
| Priority 2 | warning | `#ffa600` | Medium priority |
| Priority 3 | primary | `#2dd4d4` | Lower priority |

---

## 3. Typography

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Load from Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Size | Weight | Properties |
|---------|------|--------|------------|
| Portfolio heading | 2.25rem–3rem | 700 | `tracking-tight` |
| Page heading | 1.5rem–1.875rem | 700 | — |
| Section heading | 1.125rem | 600 | — |
| Card title | 1rem | 600 | `leading-none tracking-tight` |
| Metric value | 1.5rem–2.25rem | 700 | `tabular-nums tracking-tight` |
| Body | 0.875rem | 400 | — |
| Caption | 0.75rem | 400 | `text-muted-foreground` |
| Micro | 0.625rem | 500 | Uppercase, letter-spacing |

### Numeric Display

All numbers must use:
```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum";
```

This ensures column alignment in tables and lists.

---

## 4. Spacing & Layout

### Container

```
max-width:  1400px
padding-x:  2rem (desktop), 1rem (mobile)
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 0.25rem | Tight inline spacing |
| space-2 | 0.5rem | Icon gaps, tight padding |
| space-3 | 0.75rem | Standard gap |
| space-4 | 1rem | Card internal padding |
| space-5 | 1.25rem | Card padding |
| space-6 | 1.5rem | Section spacing |
| space-8 | 2rem | Major section breaks |
| space-12 | 3rem | Page section padding |

### Border Radius

```
radius-sm: 0.25rem  /* Pills, small elements */
radius-md: 0.375rem /* Inputs, buttons */
radius-lg: 0.5rem   /* Cards */
radius-xl: 0.75rem  /* Large cards, modals */
radius-full: 9999px /* Badges, avatars */
```

### Grid Patterns

**Summary cards:**
```css
grid-template-columns: repeat(2, 1fr);  /* mobile */
grid-template-columns: repeat(4, 1fr);  /* desktop (lg+) */
gap: 0.75rem;
```

**Property/tenant lists:**
```css
display: flex;
flex-direction: column;
gap: 0.5rem;
```

---

## 5. Tailwind Configuration

```typescript
// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Credit-specific semantic colors
        positive: {
          DEFAULT: "hsl(var(--positive))",
          foreground: "hsl(var(--positive-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        negative: {
          DEFAULT: "hsl(var(--negative))",
          foreground: "hsl(var(--negative-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "slide-up-fade": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "slide-up-fade": "slide-up-fade 0.4s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## 6. Global CSS

```css
/* globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.5rem;
  }

  /* Dark theme (primary and only theme) */
  .dark {
    /* Base */
    --background: 210 18% 11%;
    --foreground: 200 10% 88%;

    /* Cards & Surfaces */
    --card: 210 18% 14%;
    --card-foreground: 200 10% 88%;
    --popover: 210 18% 16%;
    --popover-foreground: 200 10% 88%;

    /* Primary (Cyan) */
    --primary: 174 72% 46%;
    --primary-foreground: 200 20% 6%;

    /* Secondary */
    --secondary: 210 15% 18%;
    --secondary-foreground: 200 10% 88%;

    /* Muted */
    --muted: 210 15% 18%;
    --muted-foreground: 200 10% 55%;

    /* Accent */
    --accent: 210 15% 20%;
    --accent-foreground: 200 10% 88%;

    /* Destructive */
    --destructive: 0 63% 45%;
    --destructive-foreground: 200 10% 95%;

    /* Borders & Inputs */
    --border: 210 15% 20%;
    --input: 210 15% 18%;
    --ring: 174 72% 46%;

    /* Credit Semantic Colors */
    --positive: 160 60% 45%;
    --positive-foreground: 160 60% 95%;
    --warning: 38 80% 55%;
    --warning-foreground: 38 80% 10%;
    --negative: 0 70% 55%;
    --negative-foreground: 0 70% 95%;

    /* Glass effect */
    --glass: 200 20% 8%;
    --glass-border: 200 15% 20%;
  }

  * {
    border-color: hsl(var(--border));
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-feature-settings: "rlig" 1, "calt" 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Scrollbar */
@layer utilities {
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: hsl(var(--background));
  }

  ::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.2);
    border-radius: 9999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.4);
  }

  /* Selection */
  ::selection {
    background: hsl(var(--primary) / 0.3);
    color: hsl(var(--foreground));
  }

  /* Tabular numbers for data */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }

  /* Glass card effect */
  .glass-card {
    background: hsl(var(--card) / 0.5);
    backdrop-filter: blur(24px);
    border: 1px solid hsl(0 0% 100% / 0.05);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .glass-card:hover {
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
    border-color: hsl(0 0% 100% / 0.1);
  }

  /* Hover utilities */
  .hover-lift {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .hover-lift:hover {
    transform: translateY(-1px);
  }

  .hover-glow:hover {
    box-shadow: 0 0 15px -5px hsl(var(--primary) / 0.2);
  }
}
```

---

## 7. Component Specifications

### 7.1 Standard Card

For most content containers.

```tsx
<div className="rounded-xl border border-border bg-card p-5 text-card-foreground">
  {/* content */}
</div>
```

**Tailwind classes:**
```
rounded-xl border border-border bg-card p-5 text-card-foreground
```

---

### 7.2 Glass Card (Premium)

For executive summaries, verdicts, narrative bullets.

```tsx
<div className="glass-card rounded-xl p-5 transition-all duration-300">
  {/* content */}
</div>
```

**Use sparingly for:**
- Portfolio Verdict
- Executive narrative bullets
- Memo summary cards

---

### 7.3 Summary Metric Card

Displays counts or key metrics.

```tsx
<div className="rounded-xl border border-white/5 bg-gradient-to-br from-muted/50 to-muted/20 p-4 hover-lift">
  <div className="flex items-center gap-2 mb-2">
    <div className="p-1.5 rounded-lg bg-negative/20">
      <AlertTriangle className="h-4 w-4 text-negative" />
    </div>
    <span className="text-sm text-muted-foreground">Critical</span>
  </div>
  <div className="text-2xl font-bold tracking-tight tabular-nums">3</div>
  <p className="text-xs text-muted-foreground mt-1">Require immediate review</p>
</div>
```

**Color variants by status:**

| Status | Icon bg | Icon color | Value color |
|--------|---------|------------|-------------|
| Critical | `bg-negative/20` | `text-negative` | `text-negative` |
| Watch | `bg-warning/20` | `text-warning` | `text-warning` |
| Stable | `bg-muted` | `text-muted-foreground` | `text-foreground` |
| Improving | `bg-positive/20` | `text-positive` | `text-positive` |

---

### 7.4 Status Badge

```tsx
// Critical
<span className="px-3 py-1 rounded-full text-xs font-medium bg-negative/10 text-negative border border-negative/20">
  Critical
</span>

// Watch
<span className="px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
  Watch
</span>

// Stable
<span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
  Stable
</span>

// Improving
<span className="px-3 py-1 rounded-full text-xs font-medium bg-positive/10 text-positive border border-positive/20">
  Improving
</span>
```

---

### 7.5 Buttons

**Primary (CTA):**
```tsx
<button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 transition-all">
  View Memo
</button>
```

**Outline:**
```tsx
<button className="h-10 px-4 rounded-lg border border-white/10 bg-background/50 backdrop-blur-sm text-foreground font-medium hover:bg-muted hover:border-white/20 transition-all">
  Filter
</button>
```

**Ghost:**
```tsx
<button className="h-10 px-4 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
  Cancel
</button>
```

**Button sizes:**
- Small: `h-9 px-3 text-sm rounded-md`
- Default: `h-10 px-4 rounded-lg`
- Large: `h-11 px-6 rounded-lg`

---

### 7.6 Tabs

```tsx
// Tab list container
<div className="flex h-10 items-center rounded-lg bg-muted/50 p-1 border border-white/5">

  // Inactive tab
  <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground/80 rounded-md transition-colors">
    Properties
  </button>

  // Active tab
  <button className="px-3 py-1.5 text-sm font-medium text-foreground bg-background rounded-md shadow-sm border border-primary/30">
    Tenants
  </button>

</div>
```

---

### 7.7 List Item (Property/Tenant Row)

```tsx
<div className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-muted/50 hover:border-white/5 transition-all cursor-pointer">
  <div className="flex items-center gap-3">
    <Building className="h-4 w-4 text-muted-foreground" />
    <div>
      <p className="text-sm font-medium">123 Main Street</p>
      <p className="text-xs text-muted-foreground">Chicago, IL</p>
    </div>
  </div>
  <div className="flex items-center gap-2">
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
      Watch
    </span>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </div>
</div>
```

---

### 7.8 Memo Card

For executive narratives and AI-generated analysis.

```tsx
<div className="glass-card rounded-xl p-6">
  <div className="flex items-start gap-3 mb-4">
    <div className="p-2 rounded-lg bg-primary/10">
      <FileText className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h3 className="text-base font-semibold">Portfolio Memo</h3>
      <p className="text-xs text-muted-foreground">Generated Jan 15, 2025</p>
    </div>
  </div>

  <div className="space-y-3 text-sm text-foreground/90 leading-relaxed">
    <p>Three tenants require immediate attention due to deteriorating credit metrics...</p>
    <p>The largest exposure is to Acme Corp, representing 12% of portfolio NOI...</p>
  </div>

  <div className="mt-4 pt-4 border-t border-border">
    <button className="text-sm text-primary hover:text-primary/80 font-medium">
      View supporting evidence →
    </button>
  </div>
</div>
```

---

### 7.9 Evidence Drawer/Modal

```tsx
// Overlay
<div className="fixed inset-0 bg-black/80 z-50" />

// Drawer content
<div className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border shadow-2xl z-50 overflow-y-auto">
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold">Evidence</h2>
      <button className="p-2 rounded-lg hover:bg-muted transition-colors">
        <X className="h-5 w-5" />
      </button>
    </div>

    {/* Evidence items */}
    <div className="space-y-4">
      {/* Filing card, document link, etc. */}
    </div>
  </div>
</div>
```

---

### 7.10 Header/Navigation

```tsx
<header className="sticky top-0 z-40 h-14 border-b border-border/50 bg-background/95 backdrop-blur-sm">
  <div className="container flex h-full items-center justify-between px-4">
    <div className="flex items-center gap-2">
      <Layers className="h-5 w-5 text-primary" />
      <span className="font-semibold">Credit Oversight</span>
    </div>

    <nav className="hidden md:flex items-center gap-6">
      <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">Portfolio</a>
      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Properties</a>
      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tenants</a>
    </nav>
  </div>
</header>
```

---

## 8. Screen-by-Screen Application

### 8.1 Executive Brief Screen

**Purpose:** One-glance portfolio health summary for executives.

**Layout:**
```
┌────────────────────────────────────────────────┐
│ Header                                          │
├────────────────────────────────────────────────┤
│                                                 │
│  Portfolio Heading                              │
│  "Q1 2025 Credit Review"                        │
│                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐│
│  │Critical │ │ Watch   │ │ Stable  │ │Improv. ││
│  │    3    │ │    9    │ │   42    │ │   6    ││
│  └─────────┘ └─────────┘ └─────────┘ └────────┘│
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ GLASS CARD: Portfolio Verdict            │  │
│  │                                          │  │
│  │ "Overall portfolio health is stable..."  │  │
│  │                                          │  │
│  │ [View Full Memo →]                       │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  Priority Items                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ 1. Acme Corp — Critical                  │  │
│  │ 2. Beta Industries — Watch               │  │
│  │ 3. Gamma LLC — Watch                     │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└────────────────────────────────────────────────┘
```

**Components used:**
- Summary Metric Cards (4-column grid)
- Glass Card (verdict)
- List Items (priority items)

**Glass card usage:** Only the Portfolio Verdict uses glass styling.

---

### 8.2 Memo Screen

**Purpose:** Detailed AI-generated analysis with supporting narrative.

**Layout:**
```
┌────────────────────────────────────────────────┐
│ ← Back to Portfolio                             │
├────────────────────────────────────────────────┤
│                                                 │
│  Tenant: Acme Corp                              │
│  [Critical badge]                               │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ GLASS CARD: Credit Memo                  │  │
│  │                                          │  │
│  │ Key Findings:                            │  │
│  │ • Revenue declined 23% YoY               │  │
│  │ • Debt service coverage fell to 1.1x    │  │
│  │ • Management turnover at CFO level       │  │
│  │                                          │  │
│  │ Recommendation:                          │  │
│  │ Increase monitoring frequency...         │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  Tabs: [Overview] [Financials] [Filings]        │
│                                                 │
│  Standard cards with data tables...             │
│                                                 │
│  [View Evidence →]                              │
│                                                 │
└────────────────────────────────────────────────┘
```

**Components used:**
- Glass Card (memo narrative only)
- Status Badge
- Tabs
- Standard Cards (data sections)
- Buttons

---

### 8.3 Evidence Screen/Drawer

**Purpose:** Supporting documents and source data.

**Layout:**
```
┌──────────────────────────────────────┐
│ Evidence                         [X] │
├──────────────────────────────────────┤
│                                      │
│  Source Documents                    │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 📄 10-K Filing (2024)          │  │
│  │    Filed: Dec 15, 2024         │  │
│  │    [View Document]             │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 📄 Credit Agreement            │  │
│  │    Amended: Oct 3, 2024        │  │
│  │    [View Document]             │  │
│  └────────────────────────────────┘  │
│                                      │
│  Extracted Data Points               │
│                                      │
│  Revenue (2024): $142M               │
│  Source: 10-K, Page 47               │
│                                      │
│  DSCR: 1.1x                          │
│  Source: Credit Agreement, Sec 4.2   │
│                                      │
└──────────────────────────────────────┘
```

**Components used:**
- Standard Cards (document cards)
- Ghost buttons
- Muted text for metadata

**No glass cards here.** Evidence should feel grounded and factual.

---

## 9. Icon Reference

Use **lucide-react** for all icons.

### Recommended Icons

| Icon | Usage |
|------|-------|
| `AlertTriangle` | Critical status |
| `AlertCircle` | Watch status |
| `CheckCircle` | Stable/resolved |
| `TrendingUp` | Improving trend |
| `TrendingDown` | Deteriorating trend |
| `Layers` | Portfolio (brand) |
| `Building` | Property |
| `Building2` | Property (alt) |
| `Users` | Tenants |
| `User` | Individual tenant |
| `FileText` | Memos, documents |
| `File` | Generic file |
| `ShieldAlert` | Risk indicator |
| `HelpCircle` | "Why this matters" |
| `ChevronRight` | Navigation arrow |
| `ChevronDown` | Dropdown indicator |
| `X` | Close button |
| `ArrowLeft` | Back navigation |
| `Search` | Search input |
| `Filter` | Filter controls |
| `Calendar` | Date/period |
| `Clock` | Time-based data |
| `DollarSign` | Financial metrics |
| `Percent` | Ratios/percentages |

### Icon Sizing

| Context | Size |
|---------|------|
| Inline with text | `h-4 w-4` |
| Card icon | `h-4 w-4` to `h-5 w-5` |
| Header/nav | `h-5 w-5` |
| Empty state | `h-12 w-12` |

### Icon Colors

- Default: `text-muted-foreground`
- Primary action: `text-primary`
- Status-matched: `text-negative`, `text-warning`, `text-positive`

---

## 10. Animation Guidelines

### Allowed Animations

**Entrance (page/section load):**
```css
.animate-slide-up-fade {
  animation: slide-up-fade 0.4s ease-out forwards;
}

/* Stagger children */
.child:nth-child(1) { animation-delay: 0.1s; }
.child:nth-child(2) { animation-delay: 0.2s; }
.child:nth-child(3) { animation-delay: 0.3s; }
```

**Hover effects:**
```css
.hover-lift:hover {
  transform: translateY(-1px);
}

.hover-glow:hover {
  box-shadow: 0 0 15px -5px hsl(var(--primary) / 0.2);
}
```

**Transitions (all interactive elements):**
```css
transition: all 0.2s ease;
/* or */
transition: colors 0.15s ease;
```

### Forbidden Animations

Do not use:
- ❌ Pulsing indicators
- ❌ Continuous/infinite animations
- ❌ Shimmer effects (except skeleton loaders)
- ❌ Glitch effects
- ❌ Rapid color changes
- ❌ Anything suggesting "live" or "real-time"

### Animation Principles

1. **Subtle over dramatic** — Movement should be barely noticed
2. **Functional over decorative** — Animation serves UX, not aesthetics
3. **Once, not continuous** — Entrance animations play once
4. **Fast** — Keep under 400ms total
5. **Calm** — Nothing should draw attention to itself

---

## Quick Reference: Class Cheatsheet

### Layout
```
container mx-auto px-4
grid grid-cols-2 lg:grid-cols-4 gap-3
flex items-center justify-between
space-y-4
```

### Cards
```
rounded-xl border border-border bg-card p-5
glass-card rounded-xl p-5
```

### Typography
```
text-2xl font-bold tracking-tight tabular-nums   /* metrics */
text-base font-semibold                          /* card titles */
text-sm text-muted-foreground                    /* secondary */
text-xs text-muted-foreground                    /* captions */
```

### Status Colors
```
text-negative bg-negative/10 border-negative/20  /* critical */
text-warning bg-warning/10 border-warning/20     /* watch */
text-positive bg-positive/10 border-positive/20  /* improving */
text-muted-foreground bg-muted border-border     /* stable */
```

### Interactive
```
hover:bg-muted transition-colors
hover-lift hover-glow
cursor-pointer
```

---

## Final Notes

This spec produces a UI that feels:
- Institutional
- Trustworthy
- Designed for senior decision-makers
- Calm and authoritative

The dark theme with selective glass morphism creates visual hierarchy without overwhelming. Cyan accents provide just enough energy to feel modern without feeling operational.

Hand this to your developer and they can build pixel-accurate screens.
