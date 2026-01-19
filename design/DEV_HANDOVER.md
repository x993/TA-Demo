# Developer Handover: Executive Tile Surface Upgrade

> **Branch:** `feature/exec-tile-surface`
> **Build Plan:** `design/BUILD_PLAN_UX_UPGRADE.md`
> **Estimated Effort:** 5 dev days

---

## Executive Summary

We're transforming the executive home page from a static brief into an **interactive tile surface** that feels alive and explorable. The upgrade introduces:

1. **Tappable tiles** that reveal slide-up panels with drill-down context
2. **Shared element animations** (tile → panel hero) for spatial continuity
3. **Coverage controls** so users understand what sources are being monitored
4. **System presence indicators** showing when the last review ran
5. **Desktop enhancements** including a command palette (⌘K) and hover previews

The goal: Make executives feel like they're exploring a living system, not reading a static report.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Executive Home                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ PriorityTile │  │ ClusterTile  │  │ PropertyTile │  ← Tiles  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └────────────────┴────────────────┘                    │
│                          │                                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    PanelSheet                             │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │  Mobile: BottomSheet (vaul) with snap points        │ │  │
│  │  │  Desktop: Sheet (radix) as right drawer             │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                          │                                │  │
│  │           ┌──────────────┴──────────────┐                │  │
│  │           ▼                              ▼                │  │
│  │    PropertyPanel                   TenantPanel           │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Global Overlays (rendered at app root):                        │
│  • CoverageDrawer      • TenantScopeSheet                      │
│  • RunDetailsModal     • CommandPalette                        │
│  • EvidenceDrawer (existing)                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Before You Start

### 1. Read These Files First

| File | Why |
|------|-----|
| `design/spec.md` | Understand the product vision and personas |
| `design/pages.md` | Current UX patterns and layout specs |
| `design/theme.md` | Color system, typography, spacing rules |
| `design/BUILD_PLAN_UX_UPGRADE.md` | Your detailed implementation guide |

### 2. Understand the Existing Codebase

| Area | Key Files |
|------|-----------|
| **State Management** | `apps/web/src/stores/ui-store.ts` - Zustand store |
| **API Layer** | `apps/web/src/lib/api.ts` - All API calls with demo headers |
| **Types** | `apps/web/src/types/index.ts` - TypeScript interfaces |
| **Brief Components** | `apps/web/src/components/brief/*` - Existing exec/AM components |
| **Backend Schemas** | `apps/api/src/schemas/brief.py` - Pydantic response models |

### 3. Install Dependencies First

```bash
cd apps/web
npm install framer-motion@^11.0.0 vaul@^0.9.0 cmdk@^0.2.0
```

---

## Pro Tips & Gotchas

### 🎯 Tip 1: Start with the Data Layer

Don't touch the frontend until the API returns the new tile data. This prevents wiring up components to mock data that doesn't match the real schema.

**Order:**
1. Add Pydantic schemas (`schemas/brief.py`)
2. Add DB columns + migration
3. Update router to return tile data
4. Verify with `curl` or API client
5. THEN build frontend components

### 🎯 Tip 2: The camelCase Trap

The backend uses snake_case internally but serializes to camelCase for the frontend. This is handled by `CamelModel` and `CamelRouter`.

**Backend (Python):**
```python
class PriorityTile(CamelModel):
    affected_tenant_count: int  # snake_case in code
```

**Frontend (TypeScript):**
```typescript
interface PriorityTile {
  affectedTenantCount: number;  // camelCase from API
}
```

If you add a new field and it's not showing up in the response, check:
1. Is the schema inheriting from `CamelModel`?
2. Is the router using `CamelRouter`?

### 🎯 Tip 3: Panel Sheet Responsiveness

The `PanelSheet` component switches between `BottomSheet` (mobile) and `Sheet` (desktop) based on viewport. Use the `useMediaQuery` hook consistently:

```typescript
const isDesktop = useMediaQuery('(min-width: 1024px)');
```

**Don't** use CSS media queries for this—we need JS to conditionally render different components, not just style them differently.

### 🎯 Tip 4: Shared Element Animations

Framer Motion's `layoutId` enables the "tile morphs into panel" effect. The key is using the **same layoutId** on both elements:

```tsx
// In PriorityTile
<TileBase layoutId={`priority-tile-${tile.id}`}>

// In TenantPanel's header
<PanelHeader layoutId={`priority-tile-${tileId}`}>
```

**Common mistake:** Using different IDs, which breaks the animation.

**Wrap the app** in `<LayoutGroup>` in `layout.tsx` to enable cross-component animations.

### 🎯 Tip 5: Vaul Bottom Sheet Snap Points

Vaul's snap points are percentages of viewport height:

```typescript
snapPoints={['35%', '70%', '92%']}
```

- `35%` = Quick peek (just header visible)
- `70%` = Comfortable reading
- `92%` = Full expansion (leaves room for status bar)

Users can drag between these. Don't use `100%`—it feels trapped.

### 🎯 Tip 6: Store State for Panels

The panel system uses a single `openPanel(type, entityId, tileData)` function:

```typescript
// Opening a property panel
openPanel('property', 'P1');

// Opening from a priority tile (passes tile context)
openPanel('priority', 'T1', tile);
```

The `tileData` parameter lets the panel show "Why this surfaced" context without an extra API call.

### 🎯 Tip 7: Evidence Drawer Integration

The existing `EvidenceDrawer` is triggered by `openEvidenceDrawer(eventId)`. From within panels, call this to show evidence:

```typescript
const { openEvidenceDrawer } = useUIStore();

<Button onClick={() => openEvidenceDrawer(latestEvent.id)}>
  View source documents
</Button>
```

The drawer renders at the app root—it will layer on top of the panel.

### 🎯 Tip 8: Stagger Animation Timing

The `StaggerContainer` and `StaggerItem` components create the "wave" entrance effect:

```tsx
<StaggerContainer className="space-y-8">
  <StaggerItem>Section 1</StaggerItem>
  <StaggerItem>Section 2</StaggerItem>
  <StaggerItem>Section 3</StaggerItem>
</StaggerContainer>
```

Timing is set in the component:
- `staggerChildren: 0.08` (80ms between items)
- `delayChildren: 0.1` (100ms before first item)

Don't make these too slow—it should feel snappy, not cinematic.

### 🎯 Tip 9: Command Palette Search

The command palette uses `cmdk` which has its own filtering. We disable it (`shouldFilter={false}`) and handle search ourselves via the API:

```typescript
<Command shouldFilter={false}>
```

This lets us search the actual backend data, not just filter a static list.

### 🎯 Tip 10: Coverage State is Demo-Only

The coverage toggles don't persist to the backend—they're local state for the demo. In production, these would be user preferences stored in a database.

```typescript
// Local state, not API calls
const [toggles, setToggles] = useState(defaultToggles);
```

---

## Code Patterns to Follow

### Pattern 1: Component File Structure

```typescript
'use client';  // Required for all interactive components

import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

// Types
import type { SomeType } from '@/types';

interface ComponentProps {
  // Props here
}

export function ComponentName({ props }: ComponentProps) {
  // Hooks first
  const { storeMethod } = useUIStore();
  const [state, setState] = useState();

  // Effects
  useEffect(() => {}, []);

  // Render
  return (
    <div className={cn('base-classes', conditionalClass && 'conditional')}>
      {/* Content */}
    </div>
  );
}
```

### Pattern 2: API Data Fetching in Components

```typescript
const [data, setData] = useState<DataType | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    setLoading(true);
    try {
      const result = await api.getSomething(id);
      setData(result);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [id]);

if (loading) return <Skeleton />;
if (!data) return null;
```

### Pattern 3: Conditional Styling with cn()

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  // Base styles (always applied)
  'rounded-xl p-4 border',
  // Conditional styles
  isActive && 'border-primary',
  variant === 'glass' && 'glass-card',
  // Responsive styles
  'md:p-6 lg:p-8'
)}>
```

### Pattern 4: Status-Based Styling

```typescript
const statusStyles = {
  critical: 'bg-negative/10 text-negative border-negative/20',
  watch: 'bg-warning/10 text-warning border-warning/20',
  stable: 'bg-muted text-muted-foreground border-border',
  improving: 'bg-positive/10 text-positive border-positive/20',
};

<span className={cn('px-2 py-1 rounded-full text-xs', statusStyles[status])}>
  {status}
</span>
```

---

## Testing Guidance

### Manual Testing Checklist

Run through these scenarios after each phase:

**Phase 2 (Tiles):**
- [ ] Tiles render with correct content
- [ ] Hover lift works on desktop
- [ ] "New" badge appears when `isNew: true`
- [ ] Priority 1 tiles have glass styling + subtle glow

**Phase 3 (Panels):**
- [ ] Tapping tile opens panel
- [ ] Mobile: bottom sheet with snap points
- [ ] Desktop: right drawer
- [ ] Shared element animation plays (tile → header)
- [ ] Panel content loads without flash

**Phase 4 (Coverage):**
- [ ] "Coverage" button opens drawer
- [ ] Toggles switch on/off
- [ ] "Coverage reduced" warning appears when toggles off
- [ ] Tenant scope sheet opens from panel

**Phase 8 (Desktop):**
- [ ] ⌘K / Ctrl+K opens command palette
- [ ] Search returns results
- [ ] Selecting result navigates correctly
- [ ] Hover preview shows on tile hover (desktop only)

### API Testing

Use curl or your API client to verify endpoints:

```bash
# Get brief with exec role
curl -H "X-DEMO-ROLE: exec" http://localhost:8000/api/v1/brief

# Verify these fields exist in response:
# - reviewStats
# - priorityTiles (array, max 5)
# - postureTiles (array, 3 items)
# - clusterTiles (array, max 4)
# - propertiesAttention (array, max 6)
# - questions (array, max 5)
```

---

## Common Mistakes to Avoid

### ❌ Don't: Nest LayoutGroup

```tsx
// BAD - nested LayoutGroup breaks animations
<LayoutGroup>
  <LayoutGroup>
    <Component />
  </LayoutGroup>
</LayoutGroup>

// GOOD - single LayoutGroup at app root
<LayoutGroup>
  <App />
</LayoutGroup>
```

### ❌ Don't: Forget 'use client'

```tsx
// BAD - will error on useState/useEffect
import { useState } from 'react';

// GOOD
'use client';
import { useState } from 'react';
```

### ❌ Don't: Use CSS-only Responsive for Component Switching

```tsx
// BAD - both components render, just hidden
<div className="md:hidden"><BottomSheet /></div>
<div className="hidden md:block"><Drawer /></div>

// GOOD - only one component renders
const isDesktop = useMediaQuery('(min-width: 1024px)');
return isDesktop ? <Drawer /> : <BottomSheet />;
```

### ❌ Don't: Hardcode Colors

```tsx
// BAD
<div style={{ color: '#ff5555' }}>

// GOOD - use theme tokens
<div className="text-negative">
```

### ❌ Don't: Forget Null Checks on Optional Data

```tsx
// BAD - will crash if priorityTiles is undefined
{brief.priorityTiles.map(tile => ...)}

// GOOD
{brief.priorityTiles && brief.priorityTiles.length > 0 && (
  brief.priorityTiles.map(tile => ...)
)}

// BETTER - use optional chaining
{brief.priorityTiles?.map(tile => ...)}
```

### ❌ Don't: Block on Animations

Animations should enhance, not delay. If data is ready, show it immediately with animation. Don't wait for animations to complete before showing content.

---

## File Checklist

Use this to track progress. Check off as you complete each file:

### Phase 1: Data Layer
- [ ] `apps/api/src/schemas/brief.py` - Add 8 new schemas
- [ ] `apps/api/src/models/brief_snapshot.py` - Add columns
- [ ] `apps/api/src/models/property.py` - Add image_url
- [ ] `apps/api/src/routers/brief.py` - Build tile data
- [ ] Run `alembic revision --autogenerate`
- [ ] Run `alembic upgrade head`
- [ ] `apps/web/src/types/index.ts` - Add 15+ interfaces
- [ ] `apps/web/src/stores/ui-store.ts` - Add panel/coverage state

### Phase 2: Tiles
- [ ] `apps/web/src/components/tiles/tile-base.tsx`
- [ ] `apps/web/src/components/tiles/priority-tile.tsx`
- [ ] `apps/web/src/components/tiles/cluster-tile.tsx`
- [ ] `apps/web/src/components/tiles/property-tile.tsx`
- [ ] `apps/web/src/components/tiles/posture-tile.tsx`
- [ ] `apps/web/src/components/tiles/tenant-tile.tsx`
- [ ] `apps/web/src/components/tiles/index.ts`

### Phase 3: Panels
- [ ] `apps/web/src/hooks/use-media-query.ts`
- [ ] `apps/web/src/hooks/index.ts`
- [ ] `apps/web/src/components/ui/bottom-sheet.tsx`
- [ ] `apps/web/src/components/panels/panel-header.tsx`
- [ ] `apps/web/src/components/panels/property-panel.tsx`
- [ ] `apps/web/src/components/panels/tenant-panel.tsx`
- [ ] `apps/web/src/components/panels/panel-sheet.tsx`
- [ ] `apps/web/src/components/panels/index.ts`

### Phase 4: Coverage
- [ ] `apps/web/src/components/coverage/coverage-toggle.tsx`
- [ ] `apps/web/src/components/coverage/coverage-drawer.tsx`
- [ ] `apps/web/src/components/coverage/tenant-scope-sheet.tsx`
- [ ] `apps/web/src/components/coverage/index.ts`

### Phase 5: Imagery
- [ ] `apps/web/src/lib/images.ts`
- [ ] `apps/web/public/images/properties/*` (10 images)
- [ ] Update property fixtures with image_url

### Phase 6: System Presence
- [ ] `apps/web/src/components/system/review-status.tsx`
- [ ] `apps/web/src/components/system/run-details-modal.tsx`
- [ ] `apps/web/src/components/system/index.ts`

### Phase 7: Motion & Polish
- [ ] `apps/web/tailwind.config.ts` - Add keyframes
- [ ] `apps/web/src/app/globals.css` - Add utilities
- [ ] `apps/web/src/components/ui/stagger-children.tsx`

### Phase 8: Desktop
- [ ] `apps/web/src/components/desktop/command-palette.tsx`
- [ ] `apps/web/src/components/desktop/hover-preview.tsx`
- [ ] `apps/web/src/components/desktop/index.ts`

### Phase 9: Assembly
- [ ] `apps/web/src/app/layout.tsx` - Add LayoutGroup
- [ ] `apps/web/src/app/page.tsx` - New exec home

---

## Definition of Done

The feature is complete when:

1. **All tiles render correctly** with proper styling variants
2. **Panels open/close smoothly** on both mobile and desktop
3. **Shared element animations** work (tile → panel header)
4. **Coverage controls** function (even if state is demo-only)
5. **Command palette** opens with ⌘K and searches work
6. **No console errors** in browser dev tools
7. **Lighthouse performance score** > 90
8. **Works on iPhone Safari** (primary demo device)
9. **All items in testing checklist** pass

---

## Questions?

If you hit blockers:

1. **Check the build plan** (`design/BUILD_PLAN_UX_UPGRADE.md`) for implementation details
2. **Check the spec** (`design/spec.md`) for product intent
3. **Check existing components** for patterns to follow
4. **Ask** rather than guess—wrong assumptions compound

---

## Quick Reference: Key Imports

```typescript
// State
import { useUIStore } from '@/stores/ui-store';

// API
import { api } from '@/lib/api';

// Utils
import { cn } from '@/lib/utils';
import { formatDate, formatDateTime } from '@/lib/utils';

// Types
import type {
  PriorityTile,
  ClusterTile,
  PostureTile,
  PropertyAttentionItem,
  ReviewStats,
  BriefResponse
} from '@/types';

// Tiles
import {
  PriorityTile,
  ClusterTile,
  PropertyTile,
  PostureTile,
  TenantTile
} from '@/components/tiles';

// Panels
import { PanelSheet } from '@/components/panels';

// Coverage
import { CoverageDrawer, TenantScopeSheet } from '@/components/coverage';

// System
import { ReviewStatus, RunDetailsModal } from '@/components/system';

// Desktop
import { CommandPalette, HoverPreview } from '@/components/desktop';

// UI
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { StaggerContainer, StaggerItem } from '@/components/ui/stagger-children';

// Motion
import { motion, AnimatePresence } from 'framer-motion';

// Icons (Lucide)
import {
  ChevronRight,
  Settings2,
  FileText,
  AlertCircle,
  Clock,
  Users,
  Building2,
  Search,
  X
} from 'lucide-react';
```

---

**Good luck! Build something beautiful.** 🚀
