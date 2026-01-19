from datetime import date
from uuid import UUID

from fastapi import Depends, HTTPException, Query
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
from src.responses import CamelRouter
from src.schemas.brief import (
    BriefResponse,
    StatusChangesResponse,
    EventResponse,
    PortfolioVerdict,
    NarrativeBullet,
    ConcentrationInsight,
    PropertyAttentionItem,
)
from src.validators.memo_validator import is_event_valid_for_display

router = CamelRouter(tags=["brief"])


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
        .limit(15)  # Fetch more to allow for AM filtering
    )
    events_result = await db.execute(events_query)
    recent_events = events_result.scalars().all()

    # Build event responses with property info (filter invalid events)
    event_responses = []
    for event in recent_events:
        # Skip events that fail validation
        if not is_event_valid_for_display(event):
            continue

        # Get properties for this tenant
        lease_query = (
            select(Property)
            .join(Lease, Lease.property_id == Property.id)
            .where(Lease.tenant_id == event.tenant_id)
        )
        lease_result = await db.execute(lease_query)
        properties = lease_result.scalars().all()

        # AM filtering: only show events for tenants at assigned properties
        if user.is_am:
            tenant_property_ids = [str(p.id) for p in properties]
            if not any(pid in user.assigned_property_ids for pid in tenant_property_ids):
                continue

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

        # Limit to 7 events for display
        if len(event_responses) >= 7:
            break

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

    # Build properties attention list
    properties_query = select(Property).order_by(Property.name)
    properties_result = await db.execute(properties_query)
    all_properties = properties_result.scalars().all()

    properties_attention = []
    for prop in all_properties:
        # Get worst status among tenants at this property
        tenant_status_query = (
            select(TenantScoreSnapshot.status)
            .join(Lease, Lease.tenant_id == TenantScoreSnapshot.tenant_id)
            .where(
                Lease.property_id == prop.id,
                TenantScoreSnapshot.as_of_date == brief.as_of_date
            )
        )
        status_result = await db.execute(tenant_status_query)
        statuses = [s for (s,) in status_result.all()]

        # Determine property status based on worst tenant status
        if "critical" in statuses:
            prop_status = "critical"
        elif "watch" in statuses:
            prop_status = "watch"
        elif "improving" in statuses:
            prop_status = "improving"
        else:
            prop_status = "stable"

        # Count issues (critical + watch tenants)
        issues_count = sum(1 for s in statuses if s in ("critical", "watch"))

        properties_attention.append(PropertyAttentionItem(
            id=str(prop.id),
            name=prop.name,
            city=prop.city,
            state=prop.state,
            image_url=prop.image_url,
            status=prop_status,
            issues_count=issues_count,
        ))

    # Sort by issues (most issues first)
    properties_attention.sort(key=lambda p: -p.issues_count)

    # Build base response
    response = BriefResponse(
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
        properties_attention=properties_attention,
    )

    # Add executive layer fields for exec role only
    if user.is_exec:
        if brief.portfolio_verdict:
            response.portfolio_verdict = PortfolioVerdict(**brief.portfolio_verdict)
        if brief.narrative_bullets:
            response.narrative_bullets = [
                NarrativeBullet(**b) for b in brief.narrative_bullets
            ]
        if brief.concentration_insights:
            response.concentration_insights = [
                ConcentrationInsight(**c) for c in brief.concentration_insights
            ]
        if brief.exec_questions:
            response.exec_questions = brief.exec_questions

    return response
