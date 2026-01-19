"""
Seed data loader for Credit Oversight demo.

Usage:
    cd apps/api
    poetry run python -m src.seed.load
"""

import asyncio
import json
from datetime import datetime
from pathlib import Path
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import AsyncSessionLocal, engine
from src.models import (
    Portfolio,
    Tenant,
    Property,
    Lease,
    Event,
    EvidenceSource,
    TenantScoreSnapshot,
    PortfolioBriefSnapshot,
)


FIXTURES_DIR = Path(__file__).parent / "fixtures"


def load_fixture(name: str) -> list[dict]:
    """Load a JSON fixture file."""
    path = FIXTURES_DIR / f"{name}.json"
    if not path.exists():
        print(f"Warning: {path} not found, skipping")
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def parse_uuid(value: str | None) -> UUID | None:
    """Parse a UUID string, returning None if input is None."""
    if value is None:
        return None
    return UUID(value)


def parse_date(value: str | None):
    """Parse a date string (YYYY-MM-DD)."""
    if value is None:
        return None
    from datetime import date
    return date.fromisoformat(value)


async def clear_tables(session: AsyncSession):
    """Clear all tables in reverse dependency order."""
    tables = [
        "evidence_sources",
        "events",
        "tenant_score_snapshots",
        "leases",
        "portfolio_brief_snapshots",
        "tenants",
        "properties",
        "portfolios",
    ]
    for table in tables:
        await session.execute(text(f"TRUNCATE TABLE {table} CASCADE"))
    await session.commit()
    print("Cleared all tables")


async def seed_portfolios(session: AsyncSession):
    """Seed portfolios."""
    data = load_fixture("portfolios")
    for item in data:
        portfolio = Portfolio(
            id=parse_uuid(item["id"]),
            name=item["name"],
        )
        session.add(portfolio)
    await session.commit()
    print(f"Seeded {len(data)} portfolios")


async def seed_properties(session: AsyncSession):
    """Seed properties."""
    data = load_fixture("properties")
    for item in data:
        prop = Property(
            id=parse_uuid(item["id"]),
            portfolio_id=parse_uuid(item["portfolio_id"]),
            name=item["name"],
            city=item["city"],
            state=item["state"],
            asset_class=item["asset_class"],
        )
        session.add(prop)
    await session.commit()
    print(f"Seeded {len(data)} properties")


async def seed_tenants(session: AsyncSession):
    """Seed tenants."""
    data = load_fixture("tenants")
    for item in data:
        tenant = Tenant(
            id=parse_uuid(item["id"]),
            portfolio_id=parse_uuid(item["portfolio_id"]),
            name=item["name"],
            ticker=item.get("ticker"),
            cik=item.get("cik"),
            industry=item.get("industry"),
            entity_type=item.get("entity_type", "private"),
            website=item.get("website"),
        )
        session.add(tenant)
    await session.commit()
    print(f"Seeded {len(data)} tenants")


async def seed_leases(session: AsyncSession):
    """Seed leases (tenant-property links)."""
    data = load_fixture("leases")
    for item in data:
        lease = Lease(
            id=parse_uuid(item["id"]),
            tenant_id=parse_uuid(item["tenant_id"]),
            property_id=parse_uuid(item["property_id"]),
            suite_label=item.get("suite_label"),
            rent_share_estimate=item.get("rent_share_estimate"),
        )
        session.add(lease)
    await session.commit()
    print(f"Seeded {len(data)} leases")


async def seed_events(session: AsyncSession):
    """Seed events with memos."""
    data = load_fixture("events")
    for item in data:
        event = Event(
            id=parse_uuid(item["id"]),
            tenant_id=parse_uuid(item["tenant_id"]),
            event_type=item["event_type"],
            event_date=parse_date(item["event_date"]),
            headline=item["headline"],
            memo_what_disclosed=item.get("memo_what_disclosed"),
            memo_key_details=item.get("memo_key_details"),
            memo_context=item.get("memo_context"),
            memo_why_it_matters=item.get("memo_why_it_matters"),
            memo_recommended_actions=item.get("memo_recommended_actions"),
            memo_what_to_watch=item.get("memo_what_to_watch"),
            memo_validated=item.get("memo_validated", False),
            validation_errors=item.get("validation_errors"),
        )
        session.add(event)
    await session.commit()
    print(f"Seeded {len(data)} events")


async def seed_evidence(session: AsyncSession):
    """Seed evidence sources."""
    data = load_fixture("evidence")
    for item in data:
        evidence = EvidenceSource(
            id=parse_uuid(item["id"]),
            event_id=parse_uuid(item["event_id"]),
            source_type=item["source_type"],
            title=item["title"],
            publisher=item["publisher"],
            source_date=parse_date(item["source_date"]),
            url=item.get("url"),
            excerpt=item.get("excerpt"),
            raw_text=item.get("raw_text"),
            page_reference=item.get("page_reference"),
            tier=item.get("tier", 2),
        )
        session.add(evidence)
    await session.commit()
    print(f"Seeded {len(data)} evidence sources")


async def seed_score_snapshots(session: AsyncSession):
    """Seed tenant score snapshots."""
    data = load_fixture("score_snapshots")
    for item in data:
        snapshot = TenantScoreSnapshot(
            id=parse_uuid(item["id"]),
            tenant_id=parse_uuid(item["tenant_id"]),
            as_of_date=parse_date(item["as_of_date"]),
            status=item["status"],
            score=item.get("score"),
        )
        session.add(snapshot)
    await session.commit()
    print(f"Seeded {len(data)} score snapshots")


async def seed_brief_snapshots(session: AsyncSession):
    """Seed portfolio brief snapshots."""
    data = load_fixture("brief_snapshots")
    for item in data:
        brief = PortfolioBriefSnapshot(
            id=parse_uuid(item["id"]),
            portfolio_id=parse_uuid(item["portfolio_id"]),
            as_of_date=parse_date(item["as_of_date"]),
            headline=item["headline"],
            headline_validated=item.get("headline_validated", False),
            critical_count=item.get("critical_count", 0),
            watch_count=item.get("watch_count", 0),
            stable_count=item.get("stable_count", 0),
            improving_count=item.get("improving_count", 0),
            portfolio_verdict=item.get("portfolio_verdict"),
            narrative_bullets=item.get("narrative_bullets"),
            concentration_insights=item.get("concentration_insights"),
            exec_questions=item.get("exec_questions"),
        )
        session.add(brief)
    await session.commit()
    print(f"Seeded {len(data)} brief snapshots")


async def run_seed():
    """Run the full seed process."""
    print("Starting seed process...")
    print(f"Fixtures directory: {FIXTURES_DIR}")

    async with AsyncSessionLocal() as session:
        # Clear existing data
        await clear_tables(session)

        # Seed in dependency order
        await seed_portfolios(session)
        await seed_properties(session)
        await seed_tenants(session)
        await seed_leases(session)
        await seed_events(session)
        await seed_evidence(session)
        await seed_score_snapshots(session)
        await seed_brief_snapshots(session)

    print("Seed complete!")


def main():
    """Entry point."""
    asyncio.run(run_seed())


if __name__ == "__main__":
    main()
