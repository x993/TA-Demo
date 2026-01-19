# UI/UX Upgrade Build Plan

> Comprehensive implementation guide for the Executive Home Interactive Tile Surface upgrade.
> Branch: `feature/exec-tile-surface`

---

## Table of Contents

1. [Branch Setup & Prerequisites](#1-branch-setup--prerequisites)
2. [Phase 1: Data Layer & API Changes](#2-phase-1-data-layer--api-changes)
3. [Phase 2: Core Tile Component System](#3-phase-2-core-tile-component-system)
4. [Phase 3: Slide-Up Exploration Panel](#4-phase-3-slide-up-exploration-panel)
5. [Phase 4: Coverage Controls Drawer](#5-phase-4-coverage-controls-drawer)
6. [Phase 5: Imagery System](#6-phase-5-imagery-system)
7. [Phase 6: System Presence Indicators](#7-phase-6-system-presence-indicators)
8. [Phase 7: Premium Motion & Polish](#8-phase-7-premium-motion--polish)
9. [Phase 8: Desktop Enhancements](#9-phase-8-desktop-enhancements)
10. [Phase 9: Executive Home Page Assembly](#10-phase-9-executive-home-page-assembly)
11. [Testing & QA Checklist](#11-testing--qa-checklist)

---

## 1. Branch Setup & Prerequisites

### 1.1 Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/exec-tile-surface
```

### 1.2 Dependencies to Add

**Frontend (`apps/web/package.json`):**

```bash
cd apps/web
npm install framer-motion@^11.0.0      # For spring animations & shared element transitions
npm install @radix-ui/react-dialog     # For command palette modal
npm install cmdk@^0.2.0                # Command palette search
npm install vaul@^0.9.0                # Bottom sheet with snap points (mobile)
```

### 1.3 File Structure Preview

```
apps/web/src/
├── components/
│   ├── tiles/                    # NEW: Tile component system
│   │   ├── tile-base.tsx
│   │   ├── priority-tile.tsx
│   │   ├── cluster-tile.tsx
│   │   ├── property-tile.tsx
│   │   ├── tenant-tile.tsx
│   │   ├── posture-tile.tsx
│   │   └── index.ts
│   ├── panels/                   # NEW: Slide-up exploration panels
│   │   ├── panel-sheet.tsx
│   │   ├── property-panel.tsx
│   │   ├── tenant-panel.tsx
│   │   ├── panel-header.tsx
│   │   └── index.ts
│   ├── coverage/                 # NEW: Coverage controls
│   │   ├── coverage-drawer.tsx
│   │   ├── coverage-toggle.tsx
│   │   ├── tenant-scope-sheet.tsx
│   │   └── index.ts
│   ├── system/                   # NEW: System presence indicators
│   │   ├── review-status.tsx
│   │   ├── run-details-modal.tsx
│   │   └── index.ts
│   ├── desktop/                  # NEW: Desktop enhancements
│   │   ├── command-palette.tsx
│   │   ├── hover-preview.tsx
│   │   └── index.ts
│   ├── ui/
│   │   ├── bottom-sheet.tsx      # NEW: Vaul wrapper
│   │   └── ... (existing)
│   └── brief/
│       └── ... (existing, some modified)
├── hooks/                        # NEW: Custom hooks
│   ├── use-media-query.ts
│   ├── use-command-palette.ts
│   └── index.ts
├── types/
│   └── index.ts                  # MODIFY: Add new types
└── stores/
    └── ui-store.ts               # MODIFY: Add panel/coverage state
```

---

## 2. Phase 1: Data Layer & API Changes

### 2.1 Backend Schema Updates

#### File: `apps/api/src/schemas/brief.py`

**ADD** new response schemas for tile data:

```python
# After existing imports, add:

class PropertyAttentionItem(CamelModel):
    """Property needing attention for exec home grid."""
    id: str
    name: str
    city: str
    state: str
    image_url: Optional[str] = None
    status: str  # critical | watch | stable
    issues_count: int


class PriorityTile(CamelModel):
    """Priority tile for exec home."""
    id: str
    priority: int  # 1, 2, or 3
    statement: str  # Max 160 chars
    affected_tenant_count: int
    affected_property_count: int
    primary_tenant_ids: List[str]
    primary_property_ids: List[str]
    is_new: bool = False  # First appeared since last review


class ClusterTile(CamelModel):
    """Concentration/cluster tile."""
    id: str
    statement: str
    affected_tenant_ids: List[str]
    affected_property_ids: List[str]
    segment: Optional[str] = None  # e.g., "retail", "office"


class PostureTile(CamelModel):
    """Risk posture tile with delta."""
    status: str  # critical | watch | stable
    count: int
    delta: int  # positive = increased, negative = decreased
    delta_direction: str  # "up" | "down" | "unchanged"


class ReviewStats(CamelModel):
    """System review statistics."""
    tenants_reviewed: int
    tenants_surfaced: int
    last_review_time: str  # ISO datetime
    new_since_last_review: int


class QuestionItem(CamelModel):
    """Question to raise."""
    id: str
    text: str
    related_tenant_ids: List[str]
    related_property_ids: List[str]


# MODIFY BriefResponse to include new fields:
class BriefResponse(CamelModel):
    # ... existing fields ...

    # NEW FIELDS:
    review_stats: Optional[ReviewStats] = None
    priority_tiles: Optional[List[PriorityTile]] = None
    posture_tiles: Optional[List[PostureTile]] = None
    cluster_tiles: Optional[List[ClusterTile]] = None
    properties_attention: Optional[List[PropertyAttentionItem]] = None
    questions: Optional[List[QuestionItem]] = None
```

**Location:** Lines ~1-150 in `apps/api/src/schemas/brief.py`

---

#### File: `apps/api/src/models/brief_snapshot.py`

**ADD** new JSONB columns:

```python
# Add to PortfolioBriefSnapshot class:

    # Tile data (JSONB)
    priority_tiles = Column(JSONB, nullable=True)
    cluster_tiles = Column(JSONB, nullable=True)

    # Review stats
    tenants_reviewed = Column(Integer, default=0)
    tenants_surfaced = Column(Integer, default=0)
    last_review_time = Column(DateTime, nullable=True)
```

**Location:** `apps/api/src/models/brief_snapshot.py` lines ~15-30

---

#### File: `apps/api/src/models/property.py`

**ADD** image_url column:

```python
# Add to Property class:
    image_url = Column(String, nullable=True)
```

**Location:** `apps/api/src/models/property.py` line ~12

---

### 2.2 Backend Router Updates

#### File: `apps/api/src/routers/brief.py`

**MODIFY** the GET /brief endpoint to include new tile data:

```python
# In the get_brief function, after existing logic, ADD:

# Build priority tiles from narrative_bullets
priority_tiles = []
if brief_snapshot.narrative_bullets:
    for i, bullet in enumerate(brief_snapshot.narrative_bullets[:5]):
        # Get affected tenants/properties
        tenant_ids = bullet.get("supporting_tenant_ids", [])
        property_ids = bullet.get("supporting_property_ids", [])

        priority_tiles.append(PriorityTile(
            id=f"priority-{i}",
            priority=bullet.get("priority", 3),
            statement=bullet.get("statement", "")[:160],
            affected_tenant_count=len(tenant_ids),
            affected_property_count=len(property_ids),
            primary_tenant_ids=tenant_ids[:3],
            primary_property_ids=property_ids[:3],
            is_new=False  # TODO: Compare with previous snapshot
        ))

# Build posture tiles
posture_tiles = [
    PostureTile(
        status="critical",
        count=status_counts.critical,
        delta=status_changes_data["to_watch_or_critical_count"],
        delta_direction="up" if status_changes_data["to_watch_or_critical_count"] > 0 else "unchanged"
    ),
    PostureTile(
        status="watch",
        count=status_counts.watch,
        delta=0,  # Calculate from previous snapshot
        delta_direction="unchanged"
    ),
    PostureTile(
        status="stable",
        count=status_counts.stable,
        delta=-status_changes_data["to_watch_or_critical_count"],
        delta_direction="down" if status_changes_data["to_watch_or_critical_count"] > 0 else "unchanged"
    ),
]

# Build cluster tiles from concentration_insights
cluster_tiles = []
if brief_snapshot.concentration_insights:
    for i, insight in enumerate(brief_snapshot.concentration_insights[:4]):
        cluster_tiles.append(ClusterTile(
            id=f"cluster-{i}",
            statement=insight.get("statement", ""),
            affected_tenant_ids=insight.get("tenant_ids", []),
            affected_property_ids=insight.get("property_ids", []),
            segment=insight.get("segment")
        ))

# Build properties needing attention
properties_attention = []
# Query properties with critical/watch tenants
critical_watch_props = await db.execute(
    select(Property)
    .join(Lease)
    .join(Tenant)
    .join(TenantScoreSnapshot)
    .where(
        TenantScoreSnapshot.as_of_date == as_of_date,
        TenantScoreSnapshot.status.in_(["critical", "watch"])
    )
    .distinct()
    .limit(6)
)
for prop in critical_watch_props.scalars():
    # Count issues at this property
    issues = await db.execute(
        select(func.count(Event.id))
        .join(Tenant)
        .join(Lease)
        .where(Lease.property_id == prop.id)
    )
    properties_attention.append(PropertyAttentionItem(
        id=str(prop.id),
        name=prop.name,
        city=prop.city,
        state=prop.state,
        image_url=prop.image_url,
        status="critical",  # Derive from worst tenant status
        issues_count=issues.scalar() or 0
    ))

# Build questions
questions = []
if brief_snapshot.exec_questions:
    for i, q in enumerate(brief_snapshot.exec_questions[:5]):
        questions.append(QuestionItem(
            id=f"question-{i}",
            text=q if isinstance(q, str) else q.get("text", ""),
            related_tenant_ids=[],  # TODO: Extract from question context
            related_property_ids=[]
        ))

# Review stats
review_stats = ReviewStats(
    tenants_reviewed=brief_snapshot.tenants_reviewed or coverage.tenants_monitored,
    tenants_surfaced=brief_snapshot.tenants_surfaced or coverage.tenants_with_disclosures,
    last_review_time=brief_snapshot.last_review_time.isoformat() if brief_snapshot.last_review_time else brief_snapshot.created_at.isoformat(),
    new_since_last_review=0  # TODO: Calculate
)

# Add to response
return BriefResponse(
    # ... existing fields ...
    review_stats=review_stats if demo_user.is_exec else None,
    priority_tiles=priority_tiles if demo_user.is_exec else None,
    posture_tiles=posture_tiles,
    cluster_tiles=cluster_tiles if demo_user.is_exec else None,
    properties_attention=properties_attention if demo_user.is_exec else None,
    questions=questions if demo_user.is_exec else None,
)
```

**Location:** `apps/api/src/routers/brief.py` - extend the `get_brief` function

---

### 2.3 Frontend Type Updates

#### File: `apps/web/src/types/index.ts`

**ADD** new types at the end of the file:

```typescript
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

// === EXTEND BriefResponse ===
// Update the existing BriefResponse interface to include:

export interface BriefResponse {
  // ... existing fields ...
  reviewStats?: ReviewStats;
  priorityTiles?: PriorityTile[];
  postureTiles?: PostureTile[];
  clusterTiles?: ClusterTile[];
  propertiesAttention?: PropertyAttentionItem[];
  questions?: QuestionItem[];
}
```

**Location:** `apps/web/src/types/index.ts` - add at end of file (~line 150+)

---

### 2.4 Frontend Store Updates

#### File: `apps/web/src/stores/ui-store.ts`

**MODIFY** to add panel and coverage state:

```typescript
import { create } from 'zustand';
import type { DemoRole, PanelType, CoverageSettings } from '@/types';

interface UIState {
  // Existing
  role: DemoRole;
  setRole: (role: DemoRole) => void;

  evidenceDrawerOpen: boolean;
  evidenceEventId: string | null;
  openEvidenceDrawer: (eventId: string) => void;
  closeEvidenceDrawer: () => void;

  expandedEventId: string | null;
  toggleEventExpanded: (eventId: string) => void;

  // NEW: Panel state
  panelOpen: boolean;
  panelType: PanelType | null;
  panelEntityId: string | null;
  panelTileData: any | null;
  openPanel: (type: PanelType, entityId: string, tileData?: any) => void;
  closePanel: () => void;

  // NEW: Coverage drawer
  coverageDrawerOpen: boolean;
  openCoverageDrawer: () => void;
  closeCoverageDrawer: () => void;

  // NEW: Tenant scope sheet (per-tenant coverage)
  tenantScopeSheetOpen: boolean;
  tenantScopeId: string | null;
  openTenantScopeSheet: (tenantId: string) => void;
  closeTenantScopeSheet: () => void;

  // NEW: Command palette (desktop)
  commandPaletteOpen: boolean;
  toggleCommandPalette: () => void;

  // NEW: Run details modal
  runDetailsModalOpen: boolean;
  openRunDetailsModal: () => void;
  closeRunDetailsModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Existing implementation...
  role: 'exec',
  setRole: (role) => set({ role }),

  evidenceDrawerOpen: false,
  evidenceEventId: null,
  openEvidenceDrawer: (eventId) => set({ evidenceDrawerOpen: true, evidenceEventId: eventId }),
  closeEvidenceDrawer: () => set({ evidenceDrawerOpen: false, evidenceEventId: null }),

  expandedEventId: null,
  toggleEventExpanded: (eventId) => set((state) => ({
    expandedEventId: state.expandedEventId === eventId ? null : eventId
  })),

  // NEW: Panel state
  panelOpen: false,
  panelType: null,
  panelEntityId: null,
  panelTileData: null,
  openPanel: (type, entityId, tileData = null) => set({
    panelOpen: true,
    panelType: type,
    panelEntityId: entityId,
    panelTileData: tileData,
  }),
  closePanel: () => set({
    panelOpen: false,
    panelType: null,
    panelEntityId: null,
    panelTileData: null,
  }),

  // NEW: Coverage drawer
  coverageDrawerOpen: false,
  openCoverageDrawer: () => set({ coverageDrawerOpen: true }),
  closeCoverageDrawer: () => set({ coverageDrawerOpen: false }),

  // NEW: Tenant scope sheet
  tenantScopeSheetOpen: false,
  tenantScopeId: null,
  openTenantScopeSheet: (tenantId) => set({
    tenantScopeSheetOpen: true,
    tenantScopeId: tenantId
  }),
  closeTenantScopeSheet: () => set({
    tenantScopeSheetOpen: false,
    tenantScopeId: null
  }),

  // NEW: Command palette
  commandPaletteOpen: false,
  toggleCommandPalette: () => set((state) => ({
    commandPaletteOpen: !state.commandPaletteOpen
  })),

  // NEW: Run details modal
  runDetailsModalOpen: false,
  openRunDetailsModal: () => set({ runDetailsModalOpen: true }),
  closeRunDetailsModal: () => set({ runDetailsModalOpen: false }),
}));
```

**Location:** Replace entire `apps/web/src/stores/ui-store.ts`

---

### 2.5 Alembic Migration

Create a new migration for the database changes:

```bash
cd apps/api
poetry run alembic revision --autogenerate -m "add_tile_data_and_property_images"
```

Then edit the generated migration to include:

```python
def upgrade():
    # Add columns to portfolio_brief_snapshots
    op.add_column('portfolio_brief_snapshots',
        sa.Column('priority_tiles', sa.JSON(), nullable=True))
    op.add_column('portfolio_brief_snapshots',
        sa.Column('cluster_tiles', sa.JSON(), nullable=True))
    op.add_column('portfolio_brief_snapshots',
        sa.Column('tenants_reviewed', sa.Integer(), default=0))
    op.add_column('portfolio_brief_snapshots',
        sa.Column('tenants_surfaced', sa.Integer(), default=0))
    op.add_column('portfolio_brief_snapshots',
        sa.Column('last_review_time', sa.DateTime(), nullable=True))

    # Add image_url to properties
    op.add_column('properties',
        sa.Column('image_url', sa.String(), nullable=True))

def downgrade():
    op.drop_column('portfolio_brief_snapshots', 'priority_tiles')
    op.drop_column('portfolio_brief_snapshots', 'cluster_tiles')
    op.drop_column('portfolio_brief_snapshots', 'tenants_reviewed')
    op.drop_column('portfolio_brief_snapshots', 'tenants_surfaced')
    op.drop_column('portfolio_brief_snapshots', 'last_review_time')
    op.drop_column('properties', 'image_url')
```

---

## 3. Phase 2: Core Tile Component System

### 3.1 Create Tile Base Component

#### File: `apps/web/src/components/tiles/tile-base.tsx` (NEW)

```typescript
'use client';

import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TileBaseProps {
  children: React.ReactNode;
  variant?: 'standard' | 'glass';
  onClick?: () => void;
  className?: string;
  isNew?: boolean;
  layoutId?: string; // For shared element transitions
}

export function TileBase({
  children,
  variant = 'standard',
  onClick,
  className,
  isNew,
  layoutId,
}: TileBaseProps) {
  const Component = layoutId ? motion.div : 'div';

  return (
    <Component
      layoutId={layoutId}
      onClick={onClick}
      className={cn(
        // Base styles
        'relative rounded-xl p-4 cursor-pointer transition-all duration-200',
        // Border
        'border border-border',
        // Variant styles
        variant === 'glass' && 'glass-card',
        variant === 'standard' && 'bg-card',
        // Hover states (desktop)
        'hover:border-white/10',
        'md:hover:translate-y-[-1px] md:hover:shadow-lg md:hover:shadow-primary/5',
        // Active state
        'active:scale-[0.99]',
        className
      )}
    >
      {/* New tag */}
      {isNew && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-medium
                     bg-primary text-primary-foreground rounded-full"
        >
          New
        </motion.span>
      )}

      {children}

      {/* Chevron indicator */}
      {onClick && (
        <ChevronRight
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4
                     text-muted-foreground opacity-0 group-hover:opacity-100
                     transition-opacity md:block hidden"
        />
      )}
    </Component>
  );
}
```

---

### 3.2 Create Priority Tile Component

#### File: `apps/web/src/components/tiles/priority-tile.tsx` (NEW)

```typescript
'use client';

import { TileBase } from './tile-base';
import { cn } from '@/lib/utils';
import type { PriorityTile as PriorityTileType } from '@/types';

interface PriorityTileProps {
  tile: PriorityTileType;
  onClick: () => void;
}

const priorityConfig = {
  1: {
    label: 'Priority 1',
    badgeClass: 'bg-negative/10 text-negative border-negative/20',
    glowClass: 'shadow-negative/10',
  },
  2: {
    label: 'Priority 2',
    badgeClass: 'bg-warning/10 text-warning border-warning/20',
    glowClass: '',
  },
  3: {
    label: 'Priority 3',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    glowClass: '',
  },
};

export function PriorityTile({ tile, onClick }: PriorityTileProps) {
  const config = priorityConfig[tile.priority];
  const isHighPriority = tile.priority === 1;

  return (
    <TileBase
      variant={isHighPriority ? 'glass' : 'standard'}
      onClick={onClick}
      isNew={tile.isNew}
      layoutId={`priority-tile-${tile.id}`}
      className={cn(isHighPriority && config.glowClass)}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium border',
          config.badgeClass
        )}>
          {config.label}
        </span>

        {/* Scope chips */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {tile.affectedTenantCount > 0 && (
            <span>{tile.affectedTenantCount} tenant{tile.affectedTenantCount !== 1 ? 's' : ''}</span>
          )}
          {tile.affectedTenantCount > 0 && tile.affectedPropertyCount > 0 && (
            <span>·</span>
          )}
          {tile.affectedPropertyCount > 0 && (
            <span>{tile.affectedPropertyCount} prop{tile.affectedPropertyCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Main statement */}
      <p className="text-sm font-medium leading-snug line-clamp-2">
        {tile.statement}
      </p>
    </TileBase>
  );
}
```

---

### 3.3 Create Cluster Tile Component

#### File: `apps/web/src/components/tiles/cluster-tile.tsx` (NEW)

```typescript
'use client';

import { TileBase } from './tile-base';
import { Layers } from 'lucide-react';
import type { ClusterTile as ClusterTileType } from '@/types';

interface ClusterTileProps {
  tile: ClusterTileType;
  onClick: () => void;
}

export function ClusterTile({ tile, onClick }: ClusterTileProps) {
  const totalAffected = tile.affectedTenantIds.length + tile.affectedPropertyIds.length;

  return (
    <TileBase
      variant="standard"
      onClick={onClick}
      layoutId={`cluster-tile-${tile.id}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-muted">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        {tile.segment && (
          <span className="text-xs text-muted-foreground capitalize">
            {tile.segment}
          </span>
        )}
      </div>

      {/* Statement */}
      <p className="text-sm leading-snug line-clamp-2 mb-2">
        {tile.statement}
      </p>

      {/* Affected count */}
      <p className="text-xs text-muted-foreground">
        Affects {totalAffected} entit{totalAffected !== 1 ? 'ies' : 'y'}
      </p>
    </TileBase>
  );
}
```

---

### 3.4 Create Property Tile Component (with Image)

#### File: `apps/web/src/components/tiles/property-tile.tsx` (NEW)

```typescript
'use client';

import { TileBase } from './tile-base';
import { StatusBadge } from '@/components/ui/status-badge';
import { AlertCircle } from 'lucide-react';
import type { PropertyAttentionItem } from '@/types';

interface PropertyTileProps {
  property: PropertyAttentionItem;
  onClick: () => void;
}

export function PropertyTile({ property, onClick }: PropertyTileProps) {
  const fallbackBg = `hsl(${property.name.charCodeAt(0) * 10 % 360}, 30%, 20%)`;

  return (
    <TileBase
      variant="standard"
      onClick={onClick}
      layoutId={`property-tile-${property.id}`}
      className="p-0 overflow-hidden"
    >
      {/* Image hero */}
      <div
        className="relative h-24 bg-cover bg-center"
        style={{
          backgroundImage: property.imageUrl
            ? `url(${property.imageUrl})`
            : `linear-gradient(135deg, ${fallbackBg}, hsl(var(--muted)))`,
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <StatusBadge status={property.status} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 -mt-6 relative">
        <h3 className="font-semibold text-sm truncate">{property.name}</h3>
        <p className="text-xs text-muted-foreground">
          {property.city}, {property.state}
        </p>

        {/* Issues count */}
        {property.issuesCount > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-warning">
            <AlertCircle className="h-3 w-3" />
            <span>{property.issuesCount} issue{property.issuesCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </TileBase>
  );
}
```

---

### 3.5 Create Posture Tile Component

#### File: `apps/web/src/components/tiles/posture-tile.tsx` (NEW)

```typescript
'use client';

import { TileBase } from './tile-base';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PostureTile as PostureTileType } from '@/types';

interface PostureTileProps {
  tile: PostureTileType;
  onClick: () => void;
}

const statusConfig = {
  critical: {
    label: 'Critical',
    countClass: 'text-negative',
    bgClass: 'bg-negative/5',
  },
  watch: {
    label: 'Watch',
    countClass: 'text-warning',
    bgClass: 'bg-warning/5',
  },
  stable: {
    label: 'Stable',
    countClass: 'text-foreground',
    bgClass: 'bg-muted/50',
  },
};

const deltaIcons = {
  up: TrendingUp,
  down: TrendingDown,
  unchanged: Minus,
};

export function PostureTile({ tile, onClick }: PostureTileProps) {
  const config = statusConfig[tile.status];
  const DeltaIcon = deltaIcons[tile.deltaDirection];

  return (
    <TileBase
      variant="standard"
      onClick={onClick}
      className={cn('text-center', config.bgClass)}
    >
      {/* Label */}
      <p className="text-xs text-muted-foreground mb-1">{config.label}</p>

      {/* Count */}
      <p className={cn('text-3xl font-bold tabular-nums', config.countClass)}>
        {tile.count}
      </p>

      {/* Delta */}
      {tile.delta !== 0 && (
        <div className={cn(
          'flex items-center justify-center gap-1 mt-2 text-xs',
          tile.deltaDirection === 'up' ? 'text-negative' : 'text-positive'
        )}>
          <DeltaIcon className="h-3 w-3" />
          <span>{tile.deltaDirection === 'up' ? '+' : ''}{tile.delta}</span>
        </div>
      )}
    </TileBase>
  );
}
```

---

### 3.6 Create Tenant Tile Component

#### File: `apps/web/src/components/tiles/tenant-tile.tsx` (NEW)

```typescript
'use client';

import { TileBase } from './tile-base';
import { StatusBadge } from '@/components/ui/status-badge';
import { Building2, Globe, Lock } from 'lucide-react';
import type { Tenant } from '@/types';

interface TenantTileProps {
  tenant: Tenant;
  onClick: () => void;
  showLatestEvent?: boolean;
}

export function TenantTile({ tenant, onClick, showLatestEvent = true }: TenantTileProps) {
  // Generate monogram
  const monogram = tenant.name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

  const EntityIcon = tenant.entityType === 'public' ? Globe : Lock;

  return (
    <TileBase
      variant="standard"
      onClick={onClick}
      layoutId={`tenant-tile-${tenant.id}`}
    >
      <div className="flex items-start gap-3">
        {/* Logo/Monogram */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <span className="text-sm font-semibold text-muted-foreground">
            {monogram}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">{tenant.name}</h3>
            <StatusBadge status={tenant.status} size="sm" />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <EntityIcon className="h-3 w-3" />
            <span className="capitalize">{tenant.entityType}</span>
            {tenant.ticker && (
              <>
                <span>·</span>
                <span>{tenant.ticker}</span>
              </>
            )}
            {tenant.industry && (
              <>
                <span>·</span>
                <span>{tenant.industry}</span>
              </>
            )}
          </div>

          {/* Latest event */}
          {showLatestEvent && tenant.latestEvent && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
              Latest: {tenant.latestEvent.headline}
            </p>
          )}
        </div>
      </div>
    </TileBase>
  );
}
```

---

### 3.7 Create Tile Index Export

#### File: `apps/web/src/components/tiles/index.ts` (NEW)

```typescript
export { TileBase } from './tile-base';
export type { TileBaseProps } from './tile-base';

export { PriorityTile } from './priority-tile';
export { ClusterTile } from './cluster-tile';
export { PropertyTile } from './property-tile';
export { PostureTile } from './posture-tile';
export { TenantTile } from './tenant-tile';
```

---

## 4. Phase 3: Slide-Up Exploration Panel

### 4.1 Install and Configure Vaul (Bottom Sheet)

#### File: `apps/web/src/components/ui/bottom-sheet.tsx` (NEW)

```typescript
'use client';

import { Drawer } from 'vaul';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
}

export function BottomSheet({
  open,
  onOpenChange,
  children,
  snapPoints = ['35%', '70%', '92%'],
}: BottomSheetProps) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={snapPoints}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50',
            'bg-background rounded-t-2xl',
            'outline-none',
            'max-h-[92vh]'
          )}
        >
          {/* Handle */}
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mt-4 mb-2" />

          <div className="overflow-y-auto max-h-[calc(92vh-2rem)]">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

---

### 4.2 Create Panel Sheet (Responsive Container)

#### File: `apps/web/src/components/panels/panel-sheet.tsx` (NEW)

```typescript
'use client';

import { useUIStore } from '@/stores/ui-store';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { PropertyPanel } from './property-panel';
import { TenantPanel } from './tenant-panel';

export function PanelSheet() {
  const {
    panelOpen,
    panelType,
    panelEntityId,
    panelTileData,
    closePanel
  } = useUIStore();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const panelContent = () => {
    if (!panelType || !panelEntityId) return null;

    switch (panelType) {
      case 'property':
        return <PropertyPanel propertyId={panelEntityId} />;
      case 'tenant':
        return <TenantPanel tenantId={panelEntityId} />;
      case 'priority':
        return <TenantPanel tenantId={panelEntityId} tileData={panelTileData} />;
      case 'cluster':
        return <PropertyPanel propertyId={panelEntityId} tileData={panelTileData} />;
      default:
        return null;
    }
  };

  // Desktop: Right drawer
  if (isDesktop) {
    return (
      <Sheet open={panelOpen} onOpenChange={(open) => !open && closePanel()}>
        <SheetContent
          side="right"
          className="w-[500px] p-0 overflow-y-auto"
        >
          {panelContent()}
        </SheetContent>
      </Sheet>
    );
  }

  // Mobile: Bottom sheet with snap points
  return (
    <BottomSheet
      open={panelOpen}
      onOpenChange={(open) => !open && closePanel()}
      snapPoints={['35%', '70%', '92%']}
    >
      {panelContent()}
    </BottomSheet>
  );
}
```

---

### 4.3 Create Media Query Hook

#### File: `apps/web/src/hooks/use-media-query.ts` (NEW)

```typescript
'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Listen for changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
```

---

### 4.4 Create Panel Header Component

#### File: `apps/web/src/components/panels/panel-header.tsx` (NEW)

```typescript
'use client';

import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/ui/status-badge';
import { X, Building2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PanelHeaderProps {
  type: 'property' | 'tenant';
  title: string;
  subtitle?: string;
  status: string;
  imageUrl?: string;
  issuesCount?: number;
  onClose: () => void;
  layoutId?: string;
}

export function PanelHeader({
  type,
  title,
  subtitle,
  status,
  imageUrl,
  issuesCount,
  onClose,
  layoutId,
}: PanelHeaderProps) {
  const fallbackBg = `hsl(${title.charCodeAt(0) * 10 % 360}, 30%, 20%)`;

  return (
    <motion.div
      layoutId={layoutId}
      className="relative"
    >
      {/* Hero image */}
      <div
        className={cn(
          'h-32 md:h-40 bg-cover bg-center relative',
          !imageUrl && 'bg-gradient-to-br from-muted to-background'
        )}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : { background: fallbackBg }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/50
                     backdrop-blur-sm hover:bg-background/70 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content overlay */}
      <div className="px-4 -mt-12 relative">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <StatusBadge status={status as any} />
        </div>

        {/* Issues count */}
        {issuesCount !== undefined && issuesCount > 0 && (
          <div className="flex items-center gap-1 mt-2 text-sm text-warning">
            <AlertCircle className="h-4 w-4" />
            <span>{issuesCount} issue{issuesCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

---

### 4.5 Create Property Panel

#### File: `apps/web/src/components/panels/property-panel.tsx` (NEW)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/lib/api';
import { PanelHeader } from './panel-header';
import { TenantTile } from '@/components/tiles/tenant-tile';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Settings2, Calendar, Shield } from 'lucide-react';
import type { Property, Tenant, ClusterTile } from '@/types';

interface PropertyPanelProps {
  propertyId: string;
  tileData?: ClusterTile | null;
}

export function PropertyPanel({ propertyId, tileData }: PropertyPanelProps) {
  const { closePanel, openTenantScopeSheet } = useUIStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await api.getProperty(propertyId);
        setProperty(data.property);
        setTenants(data.tenants || []);
      } catch (error) {
        console.error('Failed to fetch property:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!property) return null;

  // Filter tenants with issues
  const tenantsWithIssues = tenants.filter(t =>
    t.status === 'critical' || t.status === 'watch'
  );

  return (
    <div className="pb-6">
      {/* Header */}
      <PanelHeader
        type="property"
        title={property.name}
        subtitle={`${property.city}, ${property.state}`}
        status={tenantsWithIssues.length > 0 ? 'watch' : 'stable'}
        imageUrl={property.imageUrl}
        issuesCount={tenantsWithIssues.length}
        onClose={closePanel}
        layoutId={`property-tile-${propertyId}`}
      />

      {/* Snapshot block */}
      <section className="px-4 mt-6">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Snapshot
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">Last change</span>
            </div>
            <p className="text-sm font-medium">Jan 16, 2026</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Shield className="h-3.5 w-3.5" />
              <span className="text-xs">Confidence</span>
            </div>
            <p className="text-sm font-medium">High</p>
          </div>
        </div>
      </section>

      {/* Why this surfaced (if from cluster tile) */}
      {tileData && (
        <section className="px-4 mt-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Why this surfaced
          </h3>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm">{tileData.statement}</p>
          </div>
        </section>
      )}

      {/* Tenants at this property */}
      <section className="px-4 mt-6">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Tenants ({tenants.length})
        </h3>
        <div className="space-y-2">
          {tenants.map(tenant => (
            <TenantTile
              key={tenant.id}
              tenant={tenant}
              onClick={() => {
                // Open tenant panel instead
                useUIStore.getState().openPanel('tenant', tenant.id);
              }}
              showLatestEvent={false}
            />
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="px-4 mt-6 space-y-2">
        <Button variant="outline" className="w-full" asChild>
          <a href={`/properties/${propertyId}`}>
            <FileText className="h-4 w-4 mr-2" />
            View full details
          </a>
        </Button>
      </section>
    </div>
  );
}
```

---

### 4.6 Create Tenant Panel

#### File: `apps/web/src/components/panels/tenant-panel.tsx` (NEW)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/lib/api';
import { PanelHeader } from './panel-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText, Settings2, Calendar, Shield, Globe,
  Building2, ExternalLink, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tenant, Event, Property, PriorityTile } from '@/types';

interface TenantPanelProps {
  tenantId: string;
  tileData?: PriorityTile | null;
}

export function TenantPanel({ tenantId, tileData }: TenantPanelProps) {
  const { closePanel, openTenantScopeSheet, openEvidenceDrawer } = useUIStore();
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await api.getTenant(tenantId);
        setTenant(data);
      } catch (error) {
        console.error('Failed to fetch tenant:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tenantId]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!tenant) return null;

  const latestEvent = tenant.events?.[0];

  return (
    <div className="pb-6">
      {/* Header */}
      <PanelHeader
        type="tenant"
        title={tenant.tenant.name}
        subtitle={tenant.tenant.industry}
        status={tenant.tenant.status}
        onClose={closePanel}
        layoutId={`tenant-tile-${tenantId}`}
      />

      {/* Entity info badges */}
      <div className="px-4 mt-4 flex items-center gap-2">
        <span className="px-2 py-1 rounded-full text-xs bg-muted flex items-center gap-1">
          <Globe className="h-3 w-3" />
          {tenant.tenant.entityType}
        </span>
        {tenant.tenant.ticker && (
          <span className="px-2 py-1 rounded-full text-xs bg-muted">
            {tenant.tenant.ticker}
          </span>
        )}
      </div>

      {/* Snapshot block */}
      <section className="px-4 mt-6">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Snapshot
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">Last material change</span>
            </div>
            <p className="text-sm font-medium">
              {latestEvent ? new Date(latestEvent.date).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric'
              }) : 'None'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Shield className="h-3.5 w-3.5" />
              <span className="text-xs">Confidence</span>
            </div>
            <p className="text-sm font-medium">High</p>
          </div>
        </div>
      </section>

      {/* Why this surfaced */}
      {(tileData || latestEvent) && (
        <section className="px-4 mt-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Why this surfaced
          </h3>
          <div className="space-y-2">
            {tileData && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm">{tileData.statement}</p>
              </div>
            )}
            {latestEvent && latestEvent.memo && (
              <ul className="space-y-2">
                {latestEvent.memo.keyDetails?.slice(0, 3).map((detail: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{detail.fact}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Credit relevance (collapsible) */}
      {latestEvent?.memo?.whyItMatters && (
        <section className="px-4 mt-6">
          <button
            onClick={() => setExpandedSection(
              expandedSection === 'credit' ? null : 'credit'
            )}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Credit relevance
            </h3>
            <ChevronDown className={cn(
              'h-4 w-4 text-muted-foreground transition-transform',
              expandedSection === 'credit' && 'rotate-180'
            )} />
          </button>

          {expandedSection === 'credit' && (
            <div className="mt-3 p-3 rounded-lg bg-muted/50">
              <p className="text-sm">{latestEvent.memo.whyItMatters}</p>
            </div>
          )}
        </section>
      )}

      {/* Affected properties */}
      {tenant.properties && tenant.properties.length > 0 && (
        <section className="px-4 mt-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Properties affected ({tenant.properties.length})
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tenant.properties.map((prop: Property) => (
              <button
                key={prop.id}
                onClick={() => useUIStore.getState().openPanel('property', prop.id)}
                className="flex-shrink-0 px-3 py-2 rounded-lg bg-muted/50
                           hover:bg-muted transition-colors text-left"
              >
                <p className="text-sm font-medium">{prop.name}</p>
                <p className="text-xs text-muted-foreground">
                  {prop.city}, {prop.state}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Evidence preview */}
      {latestEvent && (
        <section className="px-4 mt-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Evidence
          </h3>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => openEvidenceDrawer(latestEvent.id)}
          >
            <FileText className="h-4 w-4 mr-2" />
            View source documents ({latestEvent.evidenceCount || 0})
          </Button>
        </section>
      )}

      {/* CTAs */}
      <section className="px-4 mt-6 space-y-2">
        <Button variant="outline" className="w-full" asChild>
          <a href={`/tenants/${tenantId}`}>
            <FileText className="h-4 w-4 mr-2" />
            Open full memo
          </a>
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => openTenantScopeSheet(tenantId)}
        >
          <Settings2 className="h-4 w-4 mr-2" />
          Monitoring scope
        </Button>
      </section>
    </div>
  );
}
```

---

### 4.7 Create Panel Index Export

#### File: `apps/web/src/components/panels/index.ts` (NEW)

```typescript
export { PanelSheet } from './panel-sheet';
export { PropertyPanel } from './property-panel';
export { TenantPanel } from './tenant-panel';
export { PanelHeader } from './panel-header';
```

---

## 5. Phase 4: Coverage Controls Drawer

### 5.1 Create Coverage Drawer

#### File: `apps/web/src/components/coverage/coverage-drawer.tsx` (NEW)

```typescript
'use client';

import { useState } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CoverageToggle } from './coverage-toggle';
import { Info } from 'lucide-react';

const defaultToggles = [
  {
    id: 'sec_filings',
    label: 'SEC Filings',
    description: '10-K, 10-Q, 8-K, and other regulatory filings',
    enabled: true,
    lastRefreshed: 'Jan 17, 6:02 AM',
  },
  {
    id: 'bankruptcy',
    label: 'Bankruptcy & Restructuring',
    description: 'Court filings, creditor notices, restructuring advisors',
    enabled: true,
    lastRefreshed: 'Jan 17, 6:02 AM',
  },
  {
    id: 'litigation',
    label: 'Litigation & Regulatory',
    description: 'Lawsuits, SEC investigations, regulatory actions',
    enabled: true,
    lastRefreshed: 'Jan 17, 6:02 AM',
  },
  {
    id: 'news',
    label: 'News & Press Releases',
    description: 'Major news outlets and company announcements',
    enabled: true,
    lastRefreshed: 'Jan 17, 6:02 AM',
  },
  {
    id: 'corporate_actions',
    label: 'Corporate Actions',
    description: 'M&A, divestitures, management changes',
    enabled: true,
    lastRefreshed: 'Jan 17, 6:02 AM',
  },
];

export function CoverageDrawer() {
  const { coverageDrawerOpen, closeCoverageDrawer } = useUIStore();
  const [toggles, setToggles] = useState(defaultToggles);

  const handleToggle = (id: string, enabled: boolean) => {
    setToggles(prev =>
      prev.map(t => t.id === id ? { ...t, enabled } : t)
    );
  };

  const disabledCount = toggles.filter(t => !t.enabled).length;

  return (
    <Sheet open={coverageDrawerOpen} onOpenChange={(open) => !open && closeCoverageDrawer()}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Coverage</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Controls what sources are reviewed. Evaluation methodology is consistent.
          </p>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {toggles.map(toggle => (
            <CoverageToggle
              key={toggle.id}
              toggle={toggle}
              onToggle={(enabled) => handleToggle(toggle.id, enabled)}
            />
          ))}
        </div>

        {/* Coverage reduced warning */}
        {disabledCount > 0 && (
          <div className="mt-6 p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-2">
            <Info className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-sm text-warning">
              Coverage reduced. {disabledCount} source type{disabledCount !== 1 ? 's' : ''} disabled.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
```

---

### 5.2 Create Coverage Toggle Component

#### File: `apps/web/src/components/coverage/coverage-toggle.tsx` (NEW)

```typescript
'use client';

import { cn } from '@/lib/utils';
import type { CoverageToggle as CoverageToggleType } from '@/types';

interface CoverageToggleProps {
  toggle: CoverageToggleType;
  onToggle: (enabled: boolean) => void;
}

export function CoverageToggle({ toggle, onToggle }: CoverageToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{toggle.label}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {toggle.description}
        </p>
        {toggle.lastRefreshed && (
          <p className="text-xs text-muted-foreground mt-1">
            Last refreshed: {toggle.lastRefreshed}
          </p>
        )}
      </div>

      {/* Toggle switch */}
      <button
        role="switch"
        aria-checked={toggle.enabled}
        onClick={() => onToggle(!toggle.enabled)}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer',
          'rounded-full border-2 border-transparent transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          toggle.enabled ? 'bg-primary' : 'bg-muted'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full',
            'bg-white shadow transform ring-0 transition',
            toggle.enabled ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}
```

---

### 5.3 Create Tenant Scope Sheet

#### File: `apps/web/src/components/coverage/tenant-scope-sheet.tsx` (NEW)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CoverageToggle } from './coverage-toggle';
import { useMediaQuery } from '@/hooks/use-media-query';
import { api } from '@/lib/api';

const defaultTenantToggles = [
  { id: 'use_global', label: 'Use global settings', description: 'Inherit from portfolio-wide coverage', enabled: true },
  { id: 'sec_filings', label: 'SEC Filings', description: '', enabled: true },
  { id: 'bankruptcy', label: 'Bankruptcy & Restructuring', description: '', enabled: true },
  { id: 'litigation', label: 'Litigation & Regulatory', description: '', enabled: true },
  { id: 'news', label: 'News & Press Releases', description: '', enabled: true },
];

export function TenantScopeSheet() {
  const {
    tenantScopeSheetOpen,
    tenantScopeId,
    closeTenantScopeSheet
  } = useUIStore();

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [tenantName, setTenantName] = useState<string>('');
  const [toggles, setToggles] = useState(defaultTenantToggles);
  const [useGlobal, setUseGlobal] = useState(true);

  useEffect(() => {
    if (tenantScopeId) {
      // Fetch tenant name
      api.getTenant(tenantScopeId).then(data => {
        setTenantName(data.tenant.name);
      });
    }
  }, [tenantScopeId]);

  const handleToggle = (id: string, enabled: boolean) => {
    if (id === 'use_global') {
      setUseGlobal(enabled);
    } else {
      setToggles(prev =>
        prev.map(t => t.id === id ? { ...t, enabled } : t)
      );
    }
  };

  const content = (
    <>
      <SheetHeader>
        <SheetTitle>Monitoring Scope</SheetTitle>
        <p className="text-sm text-muted-foreground">
          {tenantName}
        </p>
      </SheetHeader>

      <div className="mt-6 space-y-4">
        {/* Use global toggle */}
        <CoverageToggle
          toggle={{
            id: 'use_global',
            label: 'Use global settings',
            description: 'Inherit from portfolio-wide coverage',
            enabled: useGlobal,
          }}
          onToggle={(enabled) => handleToggle('use_global', enabled)}
        />

        {/* Custom toggles (only if not using global) */}
        {!useGlobal && (
          <div className="pt-4 border-t border-border space-y-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Custom Coverage
            </p>
            {toggles.filter(t => t.id !== 'use_global').map(toggle => (
              <CoverageToggle
                key={toggle.id}
                toggle={toggle}
                onToggle={(enabled) => handleToggle(toggle.id, enabled)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Sheet
        open={tenantScopeSheetOpen}
        onOpenChange={(open) => !open && closeTenantScopeSheet()}
      >
        <SheetContent side="right" className="w-full max-w-md">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <BottomSheet
      open={tenantScopeSheetOpen}
      onOpenChange={(open) => !open && closeTenantScopeSheet()}
      snapPoints={['50%', '80%']}
    >
      <div className="px-4 pb-6">
        {content}
      </div>
    </BottomSheet>
  );
}
```

---

### 5.4 Create Coverage Index Export

#### File: `apps/web/src/components/coverage/index.ts` (NEW)

```typescript
export { CoverageDrawer } from './coverage-drawer';
export { CoverageToggle } from './coverage-toggle';
export { TenantScopeSheet } from './tenant-scope-sheet';
```

---

## 6. Phase 5: Imagery System

### 6.1 Add Property Images to Demo Data

#### File: `apps/api/src/seed/fixtures/properties.json` (MODIFY)

Add `image_url` field to each property fixture:

```json
{
  "id": "P1",
  "name": "Riverside Tower",
  "city": "Chicago",
  "state": "IL",
  "asset_class": "Office",
  "image_url": "/images/properties/riverside-tower.jpg"
}
```

---

### 6.2 Create Public Images Directory

Create directory structure:

```
apps/web/public/
├── images/
│   ├── properties/
│   │   ├── riverside-tower.jpg
│   │   ├── park-plaza.jpg
│   │   ├── lakewood-business-park.jpg
│   │   ├── gateway-industrial.jpg
│   │   ├── metropolitan-center.jpg
│   │   ├── southfield-retail.jpg
│   │   ├── harbor-point.jpg
│   │   ├── crossroads-hub.jpg
│   │   ├── willowbrook-plaza.jpg
│   │   └── summit-tech-park.jpg
│   └── placeholders/
│       ├── property-fallback.jpg
│       └── tenant-fallback.png
```

**Note:** Source appropriate royalty-free commercial building images or use AI-generated placeholders.

---

### 6.3 Update Property Response Schema

#### File: `apps/api/src/schemas/property.py`

**MODIFY** `PropertyResponse` to include image_url:

```python
class PropertyResponse(CamelModel):
    id: str
    name: str
    city: str
    state: str
    asset_class: Optional[str] = None
    image_url: Optional[str] = None  # ADD THIS
    tenant_count: int
    events_count: int
```

---

### 6.4 Create Image Fallback Utility

#### File: `apps/web/src/lib/images.ts` (NEW)

```typescript
/**
 * Generate a consistent fallback background for entities without images
 */
export function getEntityFallbackStyle(name: string): React.CSSProperties {
  // Generate hue from name for consistency
  const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

  return {
    background: `linear-gradient(135deg, hsl(${hue}, 30%, 20%), hsl(${hue + 30}, 25%, 15%))`,
  };
}

/**
 * Get property image URL with fallback
 */
export function getPropertyImageUrl(imageUrl?: string | null): string {
  return imageUrl || '/images/placeholders/property-fallback.jpg';
}

/**
 * Generate tenant monogram
 */
export function getTenantMonogram(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}
```

---

## 7. Phase 6: System Presence Indicators

### 7.1 Create Review Status Component

#### File: `apps/web/src/components/system/review-status.tsx` (NEW)

```typescript
'use client';

import { useUIStore } from '@/stores/ui-store';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { ReviewStats } from '@/types';

interface ReviewStatusProps {
  stats: ReviewStats;
}

export function ReviewStatus({ stats }: ReviewStatusProps) {
  const { openRunDetailsModal } = useUIStore();

  return (
    <button
      onClick={openRunDetailsModal}
      className="flex items-center gap-4 text-xs text-muted-foreground
                 hover:text-foreground transition-colors"
    >
      {/* Last review time */}
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        <span>Last review: {formatDateTime(stats.lastReviewTime)}</span>
      </div>

      {/* Review counts */}
      <div className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5" />
        <span>
          Reviewed: {stats.tenantsReviewed} · Surfaced: {stats.tenantsSurfaced}
        </span>
      </div>

      {/* New indicator */}
      {stats.newSinceLastReview > 0 && (
        <div className="flex items-center gap-1.5 text-primary">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{stats.newSinceLastReview} new</span>
        </div>
      )}
    </button>
  );
}
```

---

### 7.2 Create Run Details Modal

#### File: `apps/web/src/components/system/run-details-modal.tsx` (NEW)

```typescript
'use client';

import { useUIStore } from '@/stores/ui-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, Clock } from 'lucide-react';

const runStages = [
  { id: 'sources', label: 'Source collection', status: 'complete', count: 847 },
  { id: 'extraction', label: 'Fact extraction', status: 'complete', count: 312 },
  { id: 'adjudication', label: 'Adjudication', status: 'complete', count: 30 },
  { id: 'validation', label: 'Validation', status: 'complete', count: 28 },
  { id: 'synthesis', label: 'Portfolio synthesis', status: 'complete', count: 1 },
];

export function RunDetailsModal() {
  const { runDetailsModalOpen, closeRunDetailsModal } = useUIStore();

  return (
    <Dialog open={runDetailsModalOpen} onOpenChange={(open) => !open && closeRunDetailsModal()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Completed time */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Completed Jan 17, 2026 at 6:02 AM CT</span>
          </div>

          {/* Stages */}
          <div className="space-y-3">
            {runStages.map(stage => (
              <div
                key={stage.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-positive" />
                  <span className="text-sm">{stage.label}</span>
                </div>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {stage.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground text-center">
            Reviews run automatically on a configurable schedule.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 7.3 Create System Index Export

#### File: `apps/web/src/components/system/index.ts` (NEW)

```typescript
export { ReviewStatus } from './review-status';
export { RunDetailsModal } from './run-details-modal';
```

---

## 8. Phase 7: Premium Motion & Polish

### 8.1 Update Tailwind Config for Animations

#### File: `apps/web/tailwind.config.ts` (MODIFY)

Add new keyframes and animations:

```typescript
// In extend.keyframes, ADD:
keyframes: {
  // ... existing keyframes ...

  'tile-entrance': {
    '0%': { opacity: '0', transform: 'translateY(8px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'glow-pulse': {
    '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 85, 85, 0)' },
    '50%': { boxShadow: '0 0 20px 2px rgba(255, 85, 85, 0.1)' },
  },
  'slide-up-spring': {
    '0%': { transform: 'translateY(100%)' },
    '100%': { transform: 'translateY(0)' },
  },
},

// In extend.animation, ADD:
animation: {
  // ... existing animations ...

  'tile-entrance': 'tile-entrance 0.4s ease-out forwards',
  'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
  'slide-up-spring': 'slide-up-spring 0.5s cubic-bezier(0.32, 0.72, 0, 1) forwards',
},
```

---

### 8.2 Create Staggered Animation Wrapper

#### File: `apps/web/src/components/ui/stagger-children.tsx` (NEW)

```typescript
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

export function StaggerContainer({ children, className }: StaggerChildrenProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
```

---

### 8.3 Update Globals.css for Polish

#### File: `apps/web/src/app/globals.css` (MODIFY)

Add new utility classes:

```css
@layer utilities {
  /* ... existing utilities ... */

  /* Critical glow effect */
  .critical-glow {
    box-shadow: 0 0 20px -5px rgba(255, 85, 85, 0.15);
  }

  /* Scroll shadow for panels */
  .scroll-shadow-top {
    box-shadow: inset 0 8px 8px -8px rgba(0, 0, 0, 0.3);
  }

  .scroll-shadow-bottom {
    box-shadow: inset 0 -8px 8px -8px rgba(0, 0, 0, 0.3);
  }

  /* Subtle border glow on hover */
  .hover-border-glow:hover {
    border-color: hsl(var(--primary) / 0.3);
    box-shadow: 0 0 0 1px hsl(var(--primary) / 0.1);
  }

  /* New tag animation */
  .new-tag-enter {
    animation: fade-in 0.3s ease-out forwards,
               scale-in 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards;
  }

  @keyframes scale-in {
    from { transform: scale(0.8); }
    to { transform: scale(1); }
  }
}
```

---

## 9. Phase 8: Desktop Enhancements

### 9.1 Install CMDK for Command Palette

Already added in Phase 1 prerequisites.

---

### 9.2 Create Command Palette Component

#### File: `apps/web/src/components/desktop/command-palette.tsx` (NEW)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/lib/api';
import {
  Search, Building2, Users, Bell, Settings2,
  FileText, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tenant, Property } from '@/types';

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, toggleCommandPalette, openCoverageDrawer } = useUIStore();
  const [search, setSearch] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  // Search on input
  useEffect(() => {
    if (search.length >= 2) {
      api.search(search).then(results => {
        setTenants(results.tenants || []);
        setProperties(results.properties || []);
      });
    } else {
      setTenants([]);
      setProperties([]);
    }
  }, [search]);

  const handleSelect = (value: string) => {
    toggleCommandPalette();

    if (value.startsWith('tenant:')) {
      router.push(`/tenants/${value.replace('tenant:', '')}`);
    } else if (value.startsWith('property:')) {
      router.push(`/properties/${value.replace('property:', '')}`);
    } else if (value === 'coverage') {
      openCoverageDrawer();
    } else if (value === 'alerts') {
      router.push('/alerts');
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={toggleCommandPalette}
      />

      {/* Command palette */}
      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-full max-w-lg">
        <Command
          className="rounded-xl border border-border bg-background shadow-2xl overflow-hidden"
          shouldFilter={false}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search tenants, properties, or jump to..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="px-1.5 py-0.5 text-xs text-muted-foreground bg-muted rounded">
              esc
            </kbd>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {/* Quick actions */}
            {search.length < 2 && (
              <Command.Group heading="Quick actions">
                <Command.Item
                  value="coverage"
                  onSelect={handleSelect}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                             hover:bg-muted aria-selected:bg-muted"
                >
                  <Settings2 className="h-4 w-4" />
                  <span>Coverage settings</span>
                </Command.Item>
                <Command.Item
                  value="alerts"
                  onSelect={handleSelect}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                             hover:bg-muted aria-selected:bg-muted"
                >
                  <Bell className="h-4 w-4" />
                  <span>Alerts</span>
                </Command.Item>
              </Command.Group>
            )}

            {/* Tenants */}
            {tenants.length > 0 && (
              <Command.Group heading="Tenants">
                {tenants.map(tenant => (
                  <Command.Item
                    key={tenant.id}
                    value={`tenant:${tenant.id}`}
                    onSelect={handleSelect}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                               hover:bg-muted aria-selected:bg-muted"
                  >
                    <Users className="h-4 w-4" />
                    <span className="flex-1">{tenant.name}</span>
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded',
                      tenant.status === 'critical' && 'bg-negative/10 text-negative',
                      tenant.status === 'watch' && 'bg-warning/10 text-warning',
                      tenant.status === 'stable' && 'bg-muted text-muted-foreground',
                    )}>
                      {tenant.status}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Properties */}
            {properties.length > 0 && (
              <Command.Group heading="Properties">
                {properties.map(property => (
                  <Command.Item
                    key={property.id}
                    value={`property:${property.id}`}
                    onSelect={handleSelect}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                               hover:bg-muted aria-selected:bg-muted"
                  >
                    <Building2 className="h-4 w-4" />
                    <span className="flex-1">{property.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {property.city}, {property.state}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
```

---

### 9.3 Create Hover Preview Component

#### File: `apps/web/src/components/desktop/hover-preview.tsx` (NEW)

```typescript
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Tenant, Property } from '@/types';

interface HoverPreviewProps {
  children: React.ReactNode;
  tenant?: Tenant;
  property?: Property;
}

export function HoverPreview({ children, tenant, property }: HoverPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.right + 8,
      y: rect.top,
    });
    setIsHovered(true);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {children}

      <AnimatePresence>
        {isHovered && (tenant || property) && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 100,
            }}
            className="w-64 p-4 rounded-xl border border-border bg-card shadow-xl"
          >
            {tenant && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{tenant.name}</h4>
                  <StatusBadge status={tenant.status} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {tenant.industry} · {tenant.entityType}
                </p>
                {tenant.latestEvent && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">Latest:</p>
                    <p className="text-xs line-clamp-2">{tenant.latestEvent.headline}</p>
                  </div>
                )}
              </>
            )}

            {property && (
              <>
                <h4 className="font-semibold text-sm mb-1">{property.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {property.city}, {property.state}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {property.tenantCount} tenants · {property.eventsCount} events
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### 9.4 Create Desktop Index Export

#### File: `apps/web/src/components/desktop/index.ts` (NEW)

```typescript
export { CommandPalette } from './command-palette';
export { HoverPreview } from './hover-preview';
```

---

### 9.5 Create Hooks Index Export

#### File: `apps/web/src/hooks/index.ts` (NEW)

```typescript
export { useMediaQuery } from './use-media-query';
```

---

## 10. Phase 9: Executive Home Page Assembly

### 10.1 Create New Executive Home Page

#### File: `apps/web/src/app/page.tsx` (REPLACE)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/lib/api';

// Tiles
import {
  PriorityTile,
  ClusterTile,
  PropertyTile,
  PostureTile
} from '@/components/tiles';

// Brief components (existing)
import { WeeklyHeadline } from '@/components/brief/weekly-headline';
import { PortfolioVerdict } from '@/components/brief/portfolio-verdict';

// System components
import { ReviewStatus } from '@/components/system/review-status';

// Panels & Drawers
import { PanelSheet } from '@/components/panels';
import { CoverageDrawer, TenantScopeSheet } from '@/components/coverage';
import { RunDetailsModal } from '@/components/system';

// Desktop
import { CommandPalette } from '@/components/desktop';

// UI
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StaggerContainer, StaggerItem } from '@/components/ui/stagger-children';
import { Settings2, ChevronRight } from 'lucide-react';

import type { BriefResponse } from '@/types';

export default function HomePage() {
  const { role, openCoverageDrawer, openPanel } = useUIStore();
  const [brief, setBrief] = useState<BriefResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrief() {
      setLoading(true);
      try {
        const data = await api.getBrief();
        setBrief(data);
      } catch (error) {
        console.error('Failed to fetch brief:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBrief();
  }, [role]);

  const isExec = role === 'exec';

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!brief) {
    return <div className="p-4">Failed to load brief</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header section */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {isExec ? 'Portfolio' : 'Your Properties'}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={openCoverageDrawer}
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Coverage
            </Button>
          </div>

          {/* Review status */}
          {brief.reviewStats && (
            <ReviewStatus stats={brief.reviewStats} />
          )}
        </header>

        {/* Executive view */}
        {isExec && (
          <StaggerContainer className="space-y-8">
            {/* Section A: Portfolio Verdict */}
            {brief.portfolioVerdict && (
              <StaggerItem>
                <section>
                  <PortfolioVerdict verdict={brief.portfolioVerdict} />
                </section>
              </StaggerItem>
            )}

            {/* Section B: Priority Tiles */}
            {brief.priorityTiles && brief.priorityTiles.length > 0 && (
              <StaggerItem>
                <section>
                  <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Priorities
                  </h2>
                  <div className="space-y-3">
                    {brief.priorityTiles.map(tile => (
                      <PriorityTile
                        key={tile.id}
                        tile={tile}
                        onClick={() => {
                          // Open panel for first affected tenant
                          const tenantId = tile.primaryTenantIds[0];
                          if (tenantId) {
                            openPanel('priority', tenantId, tile);
                          }
                        }}
                      />
                    ))}
                  </div>
                </section>
              </StaggerItem>
            )}

            {/* Section C: Risk Posture Tiles */}
            {brief.postureTiles && (
              <StaggerItem>
                <section>
                  <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Risk Posture
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {brief.postureTiles.map(tile => (
                      <PostureTile
                        key={tile.status}
                        tile={tile}
                        onClick={() => {
                          // Navigate to filtered tenant list
                          window.location.href = `/tenants?status=${tile.status}`;
                        }}
                      />
                    ))}
                  </div>
                </section>
              </StaggerItem>
            )}

            {/* Section D: Concentration / Clusters */}
            {brief.clusterTiles && brief.clusterTiles.length > 0 && (
              <StaggerItem>
                <section>
                  <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Where risk is clustering
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {brief.clusterTiles.map(tile => (
                      <ClusterTile
                        key={tile.id}
                        tile={tile}
                        onClick={() => {
                          // Open panel for first affected property
                          const propertyId = tile.affectedPropertyIds[0];
                          if (propertyId) {
                            openPanel('cluster', propertyId, tile);
                          }
                        }}
                      />
                    ))}
                  </div>
                </section>
              </StaggerItem>
            )}

            {/* Section E: Properties Needing Attention */}
            {brief.propertiesAttention && brief.propertiesAttention.length > 0 && (
              <StaggerItem>
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Properties to review
                    </h2>
                    <a
                      href="/properties"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      View all
                      <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {brief.propertiesAttention.map(property => (
                      <PropertyTile
                        key={property.id}
                        property={property}
                        onClick={() => openPanel('property', property.id)}
                      />
                    ))}
                  </div>
                </section>
              </StaggerItem>
            )}

            {/* Section F: Questions to Raise */}
            {brief.questions && brief.questions.length > 0 && (
              <StaggerItem>
                <section>
                  <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Questions to raise
                  </h2>
                  <div className="space-y-2">
                    {brief.questions.map(question => (
                      <button
                        key={question.id}
                        onClick={() => {
                          // Open panel for related tenant
                          const tenantId = question.relatedTenantIds[0];
                          if (tenantId) {
                            openPanel('tenant', tenantId);
                          }
                        }}
                        className="w-full text-left p-3 rounded-lg bg-muted/30
                                   hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-sm">{question.text}</p>
                      </button>
                    ))}
                  </div>
                </section>
              </StaggerItem>
            )}

            {/* Coverage statement */}
            <StaggerItem>
              <footer className="pt-6 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  {brief.coverage.tenantsMonitored} tenants monitored · {brief.coverage.tenantsWithDisclosures} had material disclosures
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sources: {brief.coverage.sources.join(', ')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  As of {brief.coverage.asOfDate}
                </p>
              </footer>
            </StaggerItem>
          </StaggerContainer>
        )}

        {/* Asset Manager view (simplified) */}
        {!isExec && (
          <div className="space-y-6">
            <WeeklyHeadline
              headline={brief.headline}
              updatedAt={brief.updatedAt}
            />

            {/* Status counts grid */}
            {brief.postureTiles && (
              <section>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {brief.postureTiles.map(tile => (
                    <PostureTile
                      key={tile.status}
                      tile={tile}
                      onClick={() => {
                        window.location.href = `/tenants?status=${tile.status}`;
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Recent events would go here - reuse existing EventCard */}
          </div>
        )}
      </div>

      {/* Global overlays */}
      <PanelSheet />
      <CoverageDrawer />
      <TenantScopeSheet />
      <RunDetailsModal />
      <CommandPalette />
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
```

---

### 10.2 Update App Layout for Global Providers

#### File: `apps/web/src/app/layout.tsx` (MODIFY)

Ensure framer-motion LayoutGroup wraps the app:

```typescript
// Add at the top of the file:
import { LayoutGroup } from 'framer-motion';

// Wrap the children in the body:
<body className={inter.className}>
  <LayoutGroup>
    <AppShell>
      {children}
    </AppShell>
  </LayoutGroup>
</body>
```

---

### 10.3 Update Evidence Drawer Import

#### File: `apps/web/src/components/ui/app-shell.tsx` (MODIFY)

Import and render the global overlays from the app shell:

```typescript
// Add imports:
import { EvidenceDrawer } from '@/components/ui/evidence-drawer';

// In the return, after main content:
<EvidenceDrawer />
```

---

## 11. Testing & QA Checklist

### 11.1 Functional Testing

- [ ] **Tile interactions**
  - [ ] Priority tiles open tenant panel with correct data
  - [ ] Cluster tiles open property panel with correct data
  - [ ] Property tiles open property panel
  - [ ] Posture tiles navigate to filtered tenant list

- [ ] **Panel behavior**
  - [ ] Mobile: Bottom sheet with snap points (35%, 70%, 92%)
  - [ ] Desktop: Right drawer (500px wide)
  - [ ] Shared element animation from tile to panel header
  - [ ] Evidence drawer opens from within panel

- [ ] **Coverage controls**
  - [ ] Global coverage drawer opens from header
  - [ ] Toggles persist state (demo only)
  - [ ] Tenant scope sheet opens from panel
  - [ ] "Use global" toggle controls custom overrides

- [ ] **System presence**
  - [ ] Review stats display correctly
  - [ ] Run details modal opens on tap
  - [ ] "New" badge appears on new items

- [ ] **Desktop enhancements**
  - [ ] Command palette opens with Cmd/Ctrl+K
  - [ ] Search returns tenants and properties
  - [ ] Hover previews show on desktop (not mobile)

### 11.2 Visual Testing

- [ ] **Tile styling**
  - [ ] Glass variant on verdict + priority 1 tiles
  - [ ] Standard variant on other tiles
  - [ ] Hover lift effect on desktop
  - [ ] Critical glow on priority 1

- [ ] **Animations**
  - [ ] Staggered entrance (0.08s delay between items)
  - [ ] Spring animation on panel open
  - [ ] Fade in on "New" tags
  - [ ] No jank or flicker

- [ ] **Responsive**
  - [ ] Mobile (390px): Single column, bottom sheet
  - [ ] Tablet (768px): 2-column grids
  - [ ] Desktop (1024px+): Side drawer, command palette

### 11.3 API Testing

- [ ] GET /brief returns new fields when role=exec
- [ ] reviewStats populated
- [ ] priorityTiles array (max 5)
- [ ] postureTiles array (3 items)
- [ ] clusterTiles array (max 4)
- [ ] propertiesAttention array (max 6)
- [ ] questions array (max 5)

### 11.4 Performance Testing

- [ ] Initial load < 1 second
- [ ] Panel opens instantly (data preloaded)
- [ ] No layout shift on tile entrance
- [ ] Smooth 60fps animations

---

## Summary: Files to Create/Modify

### New Files (33 files)

**Components:**
- `apps/web/src/components/tiles/tile-base.tsx`
- `apps/web/src/components/tiles/priority-tile.tsx`
- `apps/web/src/components/tiles/cluster-tile.tsx`
- `apps/web/src/components/tiles/property-tile.tsx`
- `apps/web/src/components/tiles/posture-tile.tsx`
- `apps/web/src/components/tiles/tenant-tile.tsx`
- `apps/web/src/components/tiles/index.ts`
- `apps/web/src/components/panels/panel-sheet.tsx`
- `apps/web/src/components/panels/property-panel.tsx`
- `apps/web/src/components/panels/tenant-panel.tsx`
- `apps/web/src/components/panels/panel-header.tsx`
- `apps/web/src/components/panels/index.ts`
- `apps/web/src/components/coverage/coverage-drawer.tsx`
- `apps/web/src/components/coverage/coverage-toggle.tsx`
- `apps/web/src/components/coverage/tenant-scope-sheet.tsx`
- `apps/web/src/components/coverage/index.ts`
- `apps/web/src/components/system/review-status.tsx`
- `apps/web/src/components/system/run-details-modal.tsx`
- `apps/web/src/components/system/index.ts`
- `apps/web/src/components/desktop/command-palette.tsx`
- `apps/web/src/components/desktop/hover-preview.tsx`
- `apps/web/src/components/desktop/index.ts`
- `apps/web/src/components/ui/bottom-sheet.tsx`
- `apps/web/src/components/ui/stagger-children.tsx`
- `apps/web/src/hooks/use-media-query.ts`
- `apps/web/src/hooks/index.ts`
- `apps/web/src/lib/images.ts`

**Backend:**
- Alembic migration file (auto-generated)

### Modified Files (10 files)

**Frontend:**
- `apps/web/src/types/index.ts` - Add new types
- `apps/web/src/stores/ui-store.ts` - Add panel/coverage state
- `apps/web/src/app/page.tsx` - Replace with new exec home
- `apps/web/src/app/layout.tsx` - Add LayoutGroup
- `apps/web/src/app/globals.css` - Add utility classes
- `apps/web/tailwind.config.ts` - Add animations
- `apps/web/package.json` - Add dependencies

**Backend:**
- `apps/api/src/schemas/brief.py` - Add tile schemas
- `apps/api/src/models/brief_snapshot.py` - Add columns
- `apps/api/src/models/property.py` - Add image_url
- `apps/api/src/routers/brief.py` - Build tile data

---

## Estimated Implementation Order

1. **Day 1:** Phase 1 (Data layer) + Phase 2 (Tile components)
2. **Day 2:** Phase 3 (Panels) + Phase 4 (Coverage)
3. **Day 3:** Phase 5 (Imagery) + Phase 6 (System presence)
4. **Day 4:** Phase 7 (Motion) + Phase 8 (Desktop)
5. **Day 5:** Phase 9 (Assembly) + Phase 10 (Testing)

---

**End of Build Plan**
