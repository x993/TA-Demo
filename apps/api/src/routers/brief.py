from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.database import get_db
from src.demo_auth import get_demo_user, DemoUser
from src.models import (
    PortfolioBriefSnapshot,
    TenantScoreSnapshot,
    Tenant,
    Event,
    Lease,
    Property,
)
from src.schemas.brief import BriefResponse, StatusChangesResponse, EventResponse

router = APIRouter(tags=["brief"])


@router.get("/brief", response_model=BriefResponse)
async def get_executive_brief(
    as_of_date: date | None = Query(None, description="Snapshot date (defaults to latest)"),
    db: AsyncSession = Depends(get_db),
    user: DemoUser = Depends(get_demo_user),
):
    """
    Get the weekly summary brief for the portfolio.

    Returns:
    - Headline (factual summary)
    - Status counts (critical/watch/stable/improving)
    - Status changes since last period
    - Recent events
    - Coverage statement
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

    # Get current score snapshots for status counts
    current_snapshots_query = (
        select(TenantScoreSnapshot)
        .where(TenantScoreSnapshot.as_of_date == brief.as_of_date)
    )
    current_result = await db.execute(current_snapshots_query)
    current_snapshots = current_result.scalars().all()

    # Get previous period snapshots for status changes
    # (assuming weekly, go back 7 days)
    from datetime import timedelta
    previous_date = brief.as_of_date - timedelta(days=7)
    previous_snapshots_query = (
        select(TenantScoreSnapshot)
        .where(TenantScoreSnapshot.as_of_date == previous_date)
    )
    previous_result = await db.execute(previous_snapshots_query)
    previous_snapshots = {s.tenant_id: s for s in previous_result.scalars().all()}

    # Calculate status changes
    to_watch_or_critical = []
    to_improving = []
    unchanged_count = 0

    for current in current_snapshots:
        previous = previous_snapshots.get(current.tenant_id)
        if previous:
            if current.status in ("critical", "watch") and previous.status not in ("critical", "watch"):
                # Get tenant name and latest event
                tenant_query = select(Tenant).where(Tenant.id == current.tenant_id)
                tenant_result = await db.execute(tenant_query)
                tenant = tenant_result.scalar_one_or_none()

                event_query = (
                    select(Event)
                    .where(Event.tenant_id == current.tenant_id)
                    .order_by(Event.event_date.desc())
                    .limit(1)
                )
                event_result = await db.execute(event_query)
                latest_event = event_result.scalar_one_or_none()

                if tenant:
                    to_watch_or_critical.append({
                        "tenant_id": str(current.tenant_id),
                        "tenant_name": tenant.name,
                        "previous_status": previous.status,
                        "new_status": current.status,
                        "event_id": str(latest_event.id) if latest_event else None,
                        "event_headline": latest_event.headline if latest_event else None,
                    })
            elif current.status == "improving" and previous.status != "improving":
                tenant_query = select(Tenant).where(Tenant.id == current.tenant_id)
                tenant_result = await db.execute(tenant_query)
                tenant = tenant_result.scalar_one_or_none()

                event_query = (
                    select(Event)
                    .where(Event.tenant_id == current.tenant_id)
                    .order_by(Event.event_date.desc())
                    .limit(1)
                )
                event_result = await db.execute(event_query)
                latest_event = event_result.scalar_one_or_none()

                if tenant:
                    to_improving.append({
                        "tenant_id": str(current.tenant_id),
                        "tenant_name": tenant.name,
                        "previous_status": previous.status,
                        "new_status": current.status,
                        "event_id": str(latest_event.id) if latest_event else None,
                        "event_headline": latest_event.headline if latest_event else None,
                    })
            else:
                unchanged_count += 1
        else:
            unchanged_count += 1

    # Get recent events with tenant and property info
    events_query = (
        select(Event)
        .options(selectinload(Event.tenant), selectinload(Event.evidence_sources))
        .where(Event.event_date >= brief.as_of_date - timedelta(days=7))
        .order_by(Event.event_date.desc())
        .limit(7)
    )
    events_result = await db.execute(events_query)
    recent_events = events_result.scalars().all()

    # Build event responses with property info
    event_responses = []
    for event in recent_events:
        # Get properties for this tenant
        lease_query = (
            select(Property)
            .join(Lease, Lease.property_id == Property.id)
            .where(Lease.tenant_id == event.tenant_id)
        )
        lease_result = await db.execute(lease_query)
        properties = lease_result.scalars().all()

        event_responses.append(EventResponse(
            id=str(event.id),
            tenant_id=str(event.tenant_id),
            tenant_name=event.tenant.name,
            event_type=event.event_type,
            event_date=event.event_date.isoformat(),
            headline=event.headline,
            summary=event.memo_what_disclosed or event.headline,
            evidence_count=len(event.evidence_sources),
            properties=[{"id": str(p.id), "name": p.name} for p in properties],
        ))

    # Count tenants monitored
    tenant_count_query = select(func.count(Tenant.id))
    tenant_count_result = await db.execute(tenant_count_query)
    tenants_monitored = tenant_count_result.scalar() or 0

    # Count tenants with disclosures
    tenants_with_events_query = (
        select(func.count(func.distinct(Event.tenant_id)))
        .where(Event.event_date >= brief.as_of_date - timedelta(days=7))
    )
    tenants_with_events_result = await db.execute(tenants_with_events_query)
    tenants_with_disclosures = tenants_with_events_result.scalar() or 0

    return BriefResponse(
        id=str(brief.id),
        as_of_date=brief.as_of_date.isoformat(),
        headline=brief.headline,
        updated_at=brief.created_at.isoformat(),
        status_counts={
            "critical": brief.critical_count,
            "watch": brief.watch_count,
            "stable": brief.stable_count,
            "improving": brief.improving_count,
        },
        status_changes=StatusChangesResponse(
            to_watch_or_critical=to_watch_or_critical,
            to_improving=to_improving,
            unchanged=unchanged_count,
        ),
        recent_events=event_responses,
        coverage={
            "tenants_monitored": tenants_monitored,
            "tenants_with_disclosures": tenants_with_disclosures,
            "sources": ["SEC EDGAR", "Reuters", "Court Records"],
            "as_of_date": brief.as_of_date.isoformat(),
        },
    )
