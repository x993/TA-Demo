# Credit Oversight Demo — Build Guide v1

> Project-specific scaffold for the credit monitoring demo.
> Next.js 14 + FastAPI + Postgres + Railway + Turborepo.
> Optimized for: instant, flawless, grounded.

---

## Table of Contents

1. [Architecture Principles](#1-architecture-principles)
2. [Project Structure](#2-project-structure)
3. [Domain Models](#3-domain-models)
4. [Quick Start Commands](#4-quick-start-commands)
5. [FastAPI Backend](#5-fastapi-backend)
6. [Next.js Frontend](#6-nextjs-frontend)
7. [Seed Data & Validation](#7-seed-data--validation)
8. [Railway Deployment](#8-railway-deployment)
9. [Environment Variables](#9-environment-variables)
10. [Demo Mode](#10-demo-mode)

---

## 1. Architecture Principles

### Core Constraints

| Principle | Implementation |
|-----------|----------------|
| **Nothing ungrounded reaches the UI** | Validator gate before any memo/brief is served |
| **Deterministic demo** | Fixtures are curated, versioned, validated |
| **Instant perceived performance** | Prefetch, cache briefs; fetch memos per-route |
| **No auth complexity for demo** | Simple `X-DEMO-ROLE` header, swap to real RBAC later |
| **UUIDs everywhere** | Enables clean seeding, merging, external references |

### What This Is NOT

- ❌ Real-time monitoring
- ❌ Live data ingestion
- ❌ Multi-tenant SaaS
- ❌ Production auth system

This is a **curated demo** with a **fixed storyline dataset**.

---

## 2. Project Structure

```
credit-oversight/
├── apps/
│   ├── web/                      # Next.js 14 (App Router)
│   │   ├── src/
│   │   │   ├── app/              # Pages & layouts
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx      # Executive Brief
│   │   │   │   ├── tenants/
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx  # Tenant Memo
│   │   │   │   └── evidence/
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx  # Evidence Drawer
│   │   │   ├── components/
│   │   │   │   ├── ui/           # Base components (Card, Badge, Button)
│   │   │   │   ├── brief/        # Executive Brief components
│   │   │   │   ├── memo/         # Tenant Memo components
│   │   │   │   └── evidence/     # Evidence components
│   │   │   ├── lib/
│   │   │   │   ├── api.ts        # API client
│   │   │   │   └── utils.ts      # Helpers
│   │   │   ├── stores/
│   │   │   │   └── ui-store.ts   # Minimal UI state only
│   │   │   └── types/
│   │   │       └── index.ts      # Shared TypeScript types
│   │   ├── tailwind.config.ts
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── railway.toml
│   │
│   └── api/                      # FastAPI
│       ├── src/
│       │   ├── main.py           # App entry
│       │   ├── config.py         # Settings
│       │   ├── database.py       # SQLAlchemy async
│       │   ├── demo_auth.py      # Demo header auth
│       │   ├── models/           # ORM models
│       │   │   ├── __init__.py
│       │   │   ├── tenant.py
│       │   │   ├── property.py
│       │   │   ├── event.py
│       │   │   ├── evidence.py
│       │   │   ├── score_snapshot.py
│       │   │   └── brief_snapshot.py
│       │   ├── schemas/          # Pydantic response models
│       │   ├── routers/          # API endpoints
│       │   │   ├── brief.py
│       │   │   ├── tenants.py
│       │   │   ├── memos.py
│       │   │   └── evidence.py
│       │   ├── validators/       # Grounding validation
│       │   │   ├── __init__.py
│       │   │   ├── memo_validator.py
│       │   │   └── brief_validator.py
│       │   └── seed/             # Fixture loading
│       │       ├── fixtures/
│       │       │   ├── tenants.json
│       │       │   ├── properties.json
│       │       │   ├── events.json
│       │       │   ├── evidence.json
│       │       │   ├── score_snapshots.json
│       │       │   └── brief_snapshots.json
│       │       ├── load.py       # Seed loader
│       │       └── validate.py   # Validation runner
│       ├── alembic/
│       ├── pyproject.toml
│       └── railway.toml
│
├── package.json                  # Turborepo root
├── turbo.json
└── .env.local
```

---

## 3. Domain Models

### Entity Relationship

```
Portfolio (1)
    │
    ├── Tenant (many)
    │       │
    │       ├── Property (many)
    │       │
    │       ├── Event (many)              # Material events
    │       │       │
    │       │       └── EvidenceSource (many)  # Supporting docs
    │       │
    │       └── TenantScoreSnapshot (many)  # Watch score over time
    │
    └── PortfolioBriefSnapshot (many)      # Executive summary by date
```

### ORM Models

```python
# src/models/tenant.py

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class Tenant(Base):
    """
    Static tenant identity. No memo here — memos live in snapshots/events.
    """
    __tablename__ = "tenants"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    portfolio_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("portfolios.id"), index=True
    )
    name: Mapped[str] = mapped_column(String(255))
    industry: Mapped[str | None] = mapped_column(String(100))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    properties: Mapped[list["Property"]] = relationship(back_populates="tenant")
    events: Mapped[list["Event"]] = relationship(back_populates="tenant")
    score_snapshots: Mapped[list["TenantScoreSnapshot"]] = relationship(
        back_populates="tenant"
    )
```

```python
# src/models/event.py

import uuid
from datetime import datetime, date
from sqlalchemy import String, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class Event(Base):
    """
    A material event for a tenant (filing, news, metric change).
    This is where memos/narratives attach.
    """
    __tablename__ = "events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id"), index=True
    )

    event_type: Mapped[str] = mapped_column(String(50))  # filing, news, metric_change
    event_date: Mapped[date] = mapped_column(Date, index=True)
    headline: Mapped[str] = mapped_column(String(500))
    memo: Mapped[str | None] = mapped_column(Text)  # AI-generated narrative
    memo_validated: Mapped[bool] = mapped_column(default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="events")
    evidence_sources: Mapped[list["EvidenceSource"]] = relationship(
        back_populates="event"
    )
```

```python
# src/models/evidence.py

import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class EvidenceSource(Base):
    """
    A source document supporting an event/memo.
    """
    __tablename__ = "evidence_sources"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("events.id"), index=True
    )

    source_type: Mapped[str] = mapped_column(String(50))  # 10k, 10q, news, credit_report
    title: Mapped[str] = mapped_column(String(500))
    url: Mapped[str | None] = mapped_column(String(2000))
    excerpt: Mapped[str | None] = mapped_column(Text)  # Relevant passage
    page_reference: Mapped[str | None] = mapped_column(String(50))  # "Page 47" or "Section 4.2"

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    event: Mapped["Event"] = relationship(back_populates="evidence_sources")
```

```python
# src/models/score_snapshot.py

import uuid
from datetime import datetime, date
from sqlalchemy import String, Integer, Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class TenantScoreSnapshot(Base):
    """
    Point-in-time watch score for a tenant.
    Enables trend analysis and historical comparison.
    """
    __tablename__ = "tenant_score_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id"), index=True
    )

    as_of_date: Mapped[date] = mapped_column(Date, index=True)
    status: Mapped[str] = mapped_column(String(20))  # critical, watch, stable, improving
    priority: Mapped[int] = mapped_column(Integer, default=3)  # 1, 2, 3
    score: Mapped[int | None] = mapped_column(Integer)  # 0-100 internal score

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="score_snapshots")

    __table_args__ = (
        # One snapshot per tenant per date
        {"sqlite_autoincrement": True},
    )
```

```python
# src/models/brief_snapshot.py

import uuid
from datetime import datetime, date
from sqlalchemy import String, Integer, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class PortfolioBriefSnapshot(Base):
    """
    Executive brief for a portfolio at a point in time.
    This is the top-level summary shown on the Executive Brief screen.
    """
    __tablename__ = "portfolio_brief_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    portfolio_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("portfolios.id"), index=True
    )

    as_of_date: Mapped[date] = mapped_column(Date, index=True)
    title: Mapped[str] = mapped_column(String(255))  # "Q1 2025 Credit Review"
    verdict: Mapped[str] = mapped_column(Text)  # Executive summary paragraph
    verdict_validated: Mapped[bool] = mapped_column(default=False)

    # Counts (denormalized for fast display)
    critical_count: Mapped[int] = mapped_column(Integer, default=0)
    watch_count: Mapped[int] = mapped_column(Integer, default=0)
    stable_count: Mapped[int] = mapped_column(Integer, default=0)
    improving_count: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )
```

---

## 4. Quick Start Commands

### Root `package.json`

```json
{
  "name": "credit-oversight",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "dev:web": "turbo dev --filter=@credit-oversight/web",
    "dev:api": "cd apps/api && poetry run uvicorn src.main:app --reload --port 8000",
    "build": "turbo build",
    "db:migrate": "cd apps/api && poetry run alembic upgrade head",
    "db:revision": "cd apps/api && poetry run alembic revision --autogenerate -m",
    "seed": "cd apps/api && poetry run python -m src.seed.load",
    "seed:validate": "cd apps/api && poetry run python -m src.seed.validate"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "packageManager": "npm@10.2.0",
  "engines": {
    "node": ">=18"
  }
}
```

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env.local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Workflow

```bash
# Initial setup
npm install
cd apps/api && poetry install
cd ../..

# Database setup
npm run db:migrate
npm run seed              # Load fixtures
npm run seed:validate     # Verify all memos pass grounding

# Development
npm run dev               # Both apps
npm run dev:web           # Frontend only (port 3000)
npm run dev:api           # Backend only (port 8000)

# Before deploy
npm run seed:validate     # Must pass
npm run build
```

---

## 5. FastAPI Backend

### `pyproject.toml`

```toml
[tool.poetry]
name = "credit-oversight-api"
version = "0.1.0"
python = ">=3.11,<3.13"

[tool.poetry.dependencies]
python = ">=3.11,<3.13"
fastapi = "^0.109.0"
uvicorn = { extras = ["standard"], version = "^0.27.0" }
sqlalchemy = "^2.0.25"
alembic = "^1.13.1"
asyncpg = "^0.29.0"
psycopg2-binary = "^2.9.9"
pydantic = "^2.5.3"
pydantic-settings = "^2.1.0"

[tool.poetry.group.dev.dependencies]
black = "^24.0.0"
ruff = "^0.1.0"
pytest = "^8.0.0"
pytest-asyncio = "^0.23.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

### Settings (`src/config.py`)

```python
from functools import lru_cache
from pydantic import computed_field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://localhost/credit_oversight"

    # API
    api_v1_prefix: str = "/api/v1"
    debug: bool = False

    # CORS — set to exact frontend URL in production
    cors_origins: str = "http://localhost:3000"

    @computed_field
    @property
    def database_url_async(self) -> str:
        """Convert to async driver."""
        url = self.database_url
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        if "postgresql://" in url and "+asyncpg" not in url:
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url

    @computed_field
    @property
    def database_url_sync(self) -> str:
        """Sync driver for Alembic."""
        url = self.database_url
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        if "+asyncpg" in url:
            url = url.replace("+asyncpg", "", 1)
        return url

    @computed_field
    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
```

### Demo Auth (`src/demo_auth.py`)

```python
"""
Demo-mode authentication via headers.
No JWT, no sessions — just role headers for the demo.

Usage:
  X-DEMO-ROLE: exec | am
  X-DEMO-USER: jane (optional, for display)
"""

from fastapi import Request, HTTPException


class DemoUser:
    def __init__(self, role: str, name: str | None = None):
        self.role = role
        self.name = name or "Demo User"
        self.is_exec = role == "exec"
        self.is_am = role == "am"


def get_demo_user(request: Request) -> DemoUser:
    """
    Extract demo user from headers.
    Defaults to 'exec' role if not specified.
    """
    role = request.headers.get("X-DEMO-ROLE", "exec").lower()
    name = request.headers.get("X-DEMO-USER")

    if role not in ("exec", "am"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid X-DEMO-ROLE: {role}. Must be 'exec' or 'am'."
        )

    return DemoUser(role=role, name=name)
```

### Main Application (`src/main.py`)

```python
import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from src.config import get_settings
from src.database import engine
from src.demo_auth import get_demo_user, DemoUser
from src.routers import brief, tenants, memos, evidence

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Credit Oversight API starting...")
    yield
    logger.info("Shutting down...")
    await engine.dispose()


app = FastAPI(
    title="Credit Oversight API",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = (time.time() - start) * 1000

    if request.url.path != "/health":
        logger.info(
            f"{request.method} {request.url.path} - {response.status_code} - {duration:.0f}ms"
        )

    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred"},
    )


@app.get("/health")
async def health():
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "database": "disconnected"}


@app.get("/")
async def root():
    return {
        "name": "Credit Oversight API",
        "version": "0.1.0",
        "docs": "/docs",
    }


# Routers
app.include_router(brief.router, prefix=settings.api_v1_prefix)
app.include_router(tenants.router, prefix=settings.api_v1_prefix)
app.include_router(memos.router, prefix=settings.api_v1_prefix)
app.include_router(evidence.router, prefix=settings.api_v1_prefix)
```

### Router Example (`src/routers/brief.py`)

```python
from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.demo_auth import get_demo_user, DemoUser
from src.models.brief_snapshot import PortfolioBriefSnapshot
from src.models.score_snapshot import TenantScoreSnapshot
from src.schemas.brief import BriefResponse, PriorityTenantResponse

router = APIRouter(tags=["brief"])


@router.get("/brief", response_model=BriefResponse)
async def get_executive_brief(
    as_of_date: date | None = Query(None, description="Snapshot date (defaults to latest)"),
    db: AsyncSession = Depends(get_db),
    user: DemoUser = Depends(get_demo_user),
):
    """
    Get the executive brief for the portfolio.

    Returns:
    - Portfolio verdict
    - Status counts (critical/watch/stable/improving)
    - Priority tenants list
    """
    # Get latest brief snapshot (or by date)
    query = select(PortfolioBriefSnapshot).order_by(
        PortfolioBriefSnapshot.as_of_date.desc()
    )

    if as_of_date:
        query = query.where(PortfolioBriefSnapshot.as_of_date == as_of_date)

    result = await db.execute(query.limit(1))
    brief = result.scalar_one_or_none()

    if not brief:
        raise HTTPException(status_code=404, detail="No brief found")

    # Only serve validated briefs
    if not brief.verdict_validated:
        raise HTTPException(
            status_code=503,
            detail="Brief not validated — cannot serve ungrounded content"
        )

    # Get priority tenants (critical + watch, sorted by priority)
    score_query = (
        select(TenantScoreSnapshot)
        .where(TenantScoreSnapshot.as_of_date == brief.as_of_date)
        .where(TenantScoreSnapshot.status.in_(["critical", "watch"]))
        .order_by(TenantScoreSnapshot.priority, TenantScoreSnapshot.status)
    )

    score_result = await db.execute(score_query)
    priority_scores = score_result.scalars().all()

    return BriefResponse(
        id=brief.id,
        as_of_date=brief.as_of_date,
        title=brief.title,
        verdict=brief.verdict,
        critical_count=brief.critical_count,
        watch_count=brief.watch_count,
        stable_count=brief.stable_count,
        improving_count=brief.improving_count,
        priority_tenants=[
            PriorityTenantResponse(
                tenant_id=s.tenant_id,
                status=s.status,
                priority=s.priority,
            )
            for s in priority_scores
        ],
    )
```

---

## 6. Next.js Frontend

### `package.json`

```json
{
  "name": "@credit-oversight/web",
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "zustand": "^4.5.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.363.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0"
  }
}
```

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.API_URL || 'http://localhost:8000'}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### API Client (`src/lib/api.ts`)

```typescript
/**
 * API client with demo role headers.
 */

type DemoRole = 'exec' | 'am';

class APIError extends Error {
  constructor(public status: number, public details: unknown) {
    super(`API Error: ${status}`);
  }
}

// Demo role stored in memory (could also use cookie)
let currentRole: DemoRole = 'exec';
let currentUser: string = 'Demo User';

export function setDemoRole(role: DemoRole, user?: string) {
  currentRole = role;
  if (user) currentUser = user;
}

export function getDemoRole(): DemoRole {
  return currentRole;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`/api/v1${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-DEMO-ROLE': currentRole,
      'X-DEMO-USER': currentUser,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new APIError(res.status, error);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
```

### UI Store — Minimal (`src/stores/ui-store.ts`)

```typescript
/**
 * UI-only state. Data fetching happens per-route.
 *
 * What lives here:
 * - Demo role toggle (exec vs am)
 * - Drawer/modal open state
 * - Selected tenant for detail view
 *
 * What does NOT live here:
 * - Brief data (fetched on / route)
 * - Memo data (fetched on /tenants/[id] route)
 * - Evidence data (fetched on demand)
 */

import { create } from 'zustand';

type DemoRole = 'exec' | 'am';

interface UIState {
  // Demo mode
  role: DemoRole;
  setRole: (role: DemoRole) => void;

  // Evidence drawer
  evidenceDrawerOpen: boolean;
  evidenceEventId: string | null;
  openEvidenceDrawer: (eventId: string) => void;
  closeEvidenceDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Demo mode
  role: 'exec',
  setRole: (role) => set({ role }),

  // Evidence drawer
  evidenceDrawerOpen: false,
  evidenceEventId: null,
  openEvidenceDrawer: (eventId) =>
    set({ evidenceDrawerOpen: true, evidenceEventId: eventId }),
  closeEvidenceDrawer: () =>
    set({ evidenceDrawerOpen: false, evidenceEventId: null }),
}));
```

### Page Pattern — Executive Brief (`src/app/page.tsx`)

```typescript
import { Suspense } from 'react';
import { api } from '@/lib/api';
import { BriefResponse } from '@/types';
import { SummaryCards } from '@/components/brief/SummaryCards';
import { Verdict } from '@/components/brief/Verdict';
import { PriorityList } from '@/components/brief/PriorityList';
import { Skeleton } from '@/components/ui/Skeleton';

async function getBrief(): Promise<BriefResponse> {
  // Server-side fetch (no client state needed)
  const res = await fetch(`${process.env.API_URL}/api/v1/brief`, {
    headers: { 'X-DEMO-ROLE': 'exec' },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!res.ok) {
    throw new Error('Failed to load brief');
  }

  return res.json();
}

export default async function ExecutiveBriefPage() {
  const brief = await getBrief();

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-8">
        {brief.title}
      </h1>

      {/* Summary counts */}
      <SummaryCards
        critical={brief.critical_count}
        watch={brief.watch_count}
        stable={brief.stable_count}
        improving={brief.improving_count}
      />

      {/* Verdict (glass card) */}
      <Verdict text={brief.verdict} />

      {/* Priority tenants */}
      <PriorityList tenants={brief.priority_tenants} />
    </main>
  );
}
```

### Page Pattern — Tenant Memo (`src/app/tenants/[id]/page.tsx`)

```typescript
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { TenantMemoResponse } from '@/types';
import { MemoCard } from '@/components/memo/MemoCard';
import { EventList } from '@/components/memo/EventList';
import { BackButton } from '@/components/ui/BackButton';

interface Props {
  params: { id: string };
}

async function getTenantMemo(id: string): Promise<TenantMemoResponse> {
  const res = await fetch(`${process.env.API_URL}/api/v1/tenants/${id}/memo`, {
    headers: { 'X-DEMO-ROLE': 'exec' },
    next: { revalidate: 60 },
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error('Failed to load memo');
  }

  return res.json();
}

export default async function TenantMemoPage({ params }: Props) {
  const memo = await getTenantMemo(params.id);

  return (
    <main className="container mx-auto px-4 py-12">
      <BackButton href="/" label="Back to Portfolio" />

      <div className="flex items-center gap-3 mt-6 mb-8">
        <h1 className="text-xl font-semibold">{memo.tenant_name}</h1>
        <StatusBadge status={memo.status} />
      </div>

      {/* AI-generated memo (glass card) */}
      <MemoCard memo={memo.memo} generatedAt={memo.memo_generated_at} />

      {/* Material events with evidence links */}
      <EventList events={memo.events} />
    </main>
  );
}
```

---

## 7. Seed Data & Validation

### Fixtures Structure

```
apps/api/src/seed/fixtures/
├── portfolios.json
├── tenants.json
├── properties.json
├── events.json
├── evidence.json
├── score_snapshots.json
└── brief_snapshots.json
```

### Example Fixture (`tenants.json`)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "portfolio_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation",
    "industry": "Retail"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "portfolio_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Beta Industries",
    "industry": "Manufacturing"
  }
]
```

### Seed Loader (`src/seed/load.py`)

```python
"""
Seed loader: wipes tables, loads fixtures, validates, reports.

Usage:
  poetry run python -m src.seed.load
"""

import json
import asyncio
from pathlib import Path
from datetime import datetime

from sqlalchemy import delete

from src.database import AsyncSessionLocal, engine
from src.models import (
    Portfolio,
    Tenant,
    Property,
    Event,
    EvidenceSource,
    TenantScoreSnapshot,
    PortfolioBriefSnapshot,
)
from src.seed.validate import validate_all

FIXTURES_DIR = Path(__file__).parent / "fixtures"

LOAD_ORDER = [
    ("portfolios.json", Portfolio),
    ("tenants.json", Tenant),
    ("properties.json", Property),
    ("events.json", Event),
    ("evidence.json", EvidenceSource),
    ("score_snapshots.json", TenantScoreSnapshot),
    ("brief_snapshots.json", PortfolioBriefSnapshot),
]


async def load_fixtures():
    print("=" * 60)
    print("SEED LOADER — Credit Oversight Demo")
    print("=" * 60)

    async with AsyncSessionLocal() as db:
        # 1. Wipe tables in reverse order
        print("\n[1/4] Wiping existing data...")
        for filename, model in reversed(LOAD_ORDER):
            await db.execute(delete(model))
            print(f"  ✓ Cleared {model.__tablename__}")
        await db.commit()

        # 2. Load fixtures
        print("\n[2/4] Loading fixtures...")
        counts = {}
        for filename, model in LOAD_ORDER:
            filepath = FIXTURES_DIR / filename
            if not filepath.exists():
                print(f"  ⚠ Skipping {filename} (not found)")
                continue

            with open(filepath) as f:
                records = json.load(f)

            for record in records:
                # Convert date strings
                for key, value in record.items():
                    if key.endswith("_date") and isinstance(value, str):
                        record[key] = datetime.fromisoformat(value).date()
                    elif key.endswith("_at") and isinstance(value, str):
                        record[key] = datetime.fromisoformat(value)

                db.add(model(**record))

            counts[model.__tablename__] = len(records)
            print(f"  ✓ Loaded {len(records)} {model.__tablename__}")

        await db.commit()

        # 3. Run validation
        print("\n[3/4] Validating memos and briefs...")
        validation_result = await validate_all(db)

        if not validation_result["passed"]:
            print("\n❌ VALIDATION FAILED")
            for error in validation_result["errors"]:
                print(f"  - {error}")
            print("\nFix validation errors before deploying.")
            return False

        print("  ✓ All memos grounded")
        print("  ✓ All briefs validated")

        # 4. Report
        print("\n[4/4] Demo Readiness Report")
        print("-" * 40)

        # Get counts by status
        from sqlalchemy import select, func
        status_counts = await db.execute(
            select(
                TenantScoreSnapshot.status,
                func.count(TenantScoreSnapshot.id)
            )
            .group_by(TenantScoreSnapshot.status)
        )

        for status, count in status_counts:
            print(f"  {status.capitalize():12} {count}")

        print("-" * 40)
        print(f"  Total tenants:    {counts.get('tenants', 0)}")
        print(f"  Total events:     {counts.get('events', 0)}")
        print(f"  Evidence sources: {counts.get('evidence_sources', 0)}")
        print("\n✅ Demo ready to run")

        return True


if __name__ == "__main__":
    asyncio.run(load_fixtures())
```

### Validator (`src/seed/validate.py`)

```python
"""
Validation runner: ensures all memos/briefs are grounded.

Usage:
  poetry run python -m src.seed.validate
"""

import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import AsyncSessionLocal
from src.models.event import Event
from src.models.brief_snapshot import PortfolioBriefSnapshot
from src.validators.memo_validator import validate_memo
from src.validators.brief_validator import validate_brief


async def validate_all(db: AsyncSession | None = None) -> dict:
    """
    Validate all memos and briefs in the database.

    Returns:
        {
            "passed": bool,
            "errors": list[str],
            "validated_count": int
        }
    """
    close_session = False
    if db is None:
        db = AsyncSessionLocal()
        close_session = True

    errors = []
    validated = 0

    try:
        # Validate event memos
        events_result = await db.execute(
            select(Event).where(Event.memo.isnot(None))
        )
        events = events_result.scalars().all()

        for event in events:
            result = validate_memo(event)
            if not result["valid"]:
                errors.append(f"Event {event.id}: {result['reason']}")
            else:
                # Mark as validated
                event.memo_validated = True
                validated += 1

        # Validate portfolio briefs
        briefs_result = await db.execute(select(PortfolioBriefSnapshot))
        briefs = briefs_result.scalars().all()

        for brief in briefs:
            result = validate_brief(brief)
            if not result["valid"]:
                errors.append(f"Brief {brief.id}: {result['reason']}")
            else:
                brief.verdict_validated = True
                validated += 1

        await db.commit()

    finally:
        if close_session:
            await db.close()

    return {
        "passed": len(errors) == 0,
        "errors": errors,
        "validated_count": validated,
    }


if __name__ == "__main__":
    async def main():
        result = await validate_all()

        if result["passed"]:
            print(f"✅ All {result['validated_count']} items validated")
        else:
            print(f"❌ Validation failed with {len(result['errors'])} errors:")
            for error in result["errors"]:
                print(f"  - {error}")
            exit(1)

    asyncio.run(main())
```

### Memo Validator (`src/validators/memo_validator.py`)

```python
"""
Memo grounding validator.

Rules:
1. Memo must reference at least one evidence source
2. Memo must not contain hallucination markers
3. Memo must be under length limit
"""

from src.models.event import Event


HALLUCINATION_MARKERS = [
    "I think",
    "probably",
    "might be",
    "it seems",
    "appears to",
    "reportedly",  # unless citing a source
    "sources say",  # vague
]

MAX_MEMO_LENGTH = 2000


def validate_memo(event: Event) -> dict:
    """
    Validate that an event memo is properly grounded.

    Returns:
        {"valid": bool, "reason": str | None}
    """
    if not event.memo:
        return {"valid": True, "reason": None}

    memo = event.memo.lower()

    # Check for hallucination markers
    for marker in HALLUCINATION_MARKERS:
        if marker.lower() in memo:
            return {
                "valid": False,
                "reason": f"Contains hallucination marker: '{marker}'"
            }

    # Check length
    if len(event.memo) > MAX_MEMO_LENGTH:
        return {
            "valid": False,
            "reason": f"Memo exceeds {MAX_MEMO_LENGTH} characters"
        }

    # Check evidence exists
    if not event.evidence_sources or len(event.evidence_sources) == 0:
        return {
            "valid": False,
            "reason": "No evidence sources attached"
        }

    return {"valid": True, "reason": None}
```

---

## 8. Railway Deployment

### `apps/web/railway.toml`

```toml
[build]
builder = "nixpacks"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm start"
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

### `apps/api/railway.toml`

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "poetry run alembic upgrade head && poetry run python -m src.seed.load && poetry run uvicorn src.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

Note: The API start command runs migrations and seeds on every deploy. For the demo, this ensures fresh, validated data.

### Railway Setup

1. Create project in Railway
2. Add PostgreSQL plugin (auto-sets `DATABASE_URL`)
3. Connect GitHub repo
4. Add two services:
   - **web**: Root directory = `apps/web`
   - **api**: Root directory = `apps/api`
5. Set environment variables (see below)
6. Deploy

---

## 9. Environment Variables

### Local (`.env.local` at root)

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/credit_oversight

# API (for Next.js rewrites)
API_URL=http://localhost:8000

# Debug
DEBUG=true
```

### Railway — Web Service

```
API_URL=https://<api-service>.up.railway.app
```

### Railway — API Service

```
DATABASE_URL          # Auto-set by PostgreSQL plugin
DEBUG=false
CORS_ORIGINS=https://<web-service>.up.railway.app
```

---

## 10. Demo Mode

### Role Toggle Component

```typescript
// src/components/ui/RoleToggle.tsx

'use client';

import { useUIStore } from '@/stores/ui-store';
import { setDemoRole } from '@/lib/api';

export function RoleToggle() {
  const { role, setRole } = useUIStore();

  const handleToggle = (newRole: 'exec' | 'am') => {
    setRole(newRole);
    setDemoRole(newRole);
  };

  return (
    <div className="flex h-10 items-center rounded-lg bg-muted/50 p-1 border border-white/5">
      <button
        onClick={() => handleToggle('exec')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          role === 'exec'
            ? 'bg-background text-foreground shadow-sm border border-primary/30'
            : 'text-muted-foreground hover:text-foreground/80'
        }`}
      >
        Executive
      </button>
      <button
        onClick={() => handleToggle('am')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          role === 'am'
            ? 'bg-background text-foreground shadow-sm border border-primary/30'
            : 'text-muted-foreground hover:text-foreground/80'
        }`}
      >
        Asset Manager
      </button>
    </div>
  );
}
```

### Demo Data Timestamps

Use `as_of_date` in fixtures to support "time travel":

```json
// brief_snapshots.json
[
  {
    "id": "...",
    "as_of_date": "2025-01-15",
    "title": "Q1 2025 Credit Review",
    "verdict": "..."
  },
  {
    "id": "...",
    "as_of_date": "2024-10-15",
    "title": "Q4 2024 Credit Review",
    "verdict": "..."
  }
]
```

Query with `?as_of_date=2024-10-15` to show historical state.

---

## Checklist: Demo Ship-Ready

```markdown
### Before First Deploy
- [ ] Models created (all 6 entity types)
- [ ] Migrations run locally
- [ ] Fixtures created for storyline
- [ ] `npm run seed` works
- [ ] `npm run seed:validate` passes

### Before Client Demo
- [ ] Railway services deployed
- [ ] Health checks passing
- [ ] Seed data loaded on production
- [ ] Validation passing on production
- [ ] Role toggle working (exec/am views)
- [ ] Evidence drawer opening correctly
- [ ] All memos display without errors

### Quality Bar
- [ ] No ungrounded content visible
- [ ] Glass cards only on Verdict/Memo
- [ ] Status badges color-coded correctly
- [ ] Loads in under 2 seconds
- [ ] Mobile-readable
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start both apps locally |
| `npm run db:migrate` | Apply database migrations |
| `npm run seed` | Wipe + load + validate fixtures |
| `npm run seed:validate` | Validate without reloading |
| `npm run build` | Production build |

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Railway health check |
| `GET /api/v1/brief` | Executive summary |
| `GET /api/v1/tenants` | List all tenants |
| `GET /api/v1/tenants/{id}/memo` | Tenant memo + events |
| `GET /api/v1/events/{id}/evidence` | Evidence for event |

| Header | Values | Purpose |
|--------|--------|---------|
| `X-DEMO-ROLE` | `exec`, `am` | Role-based filtering |
| `X-DEMO-USER` | any string | Display name |

---

This is the complete build guide. Copy the patterns, load your storyline fixtures, validate, deploy.
