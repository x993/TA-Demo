from uuid import UUID

from fastapi import Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.database import get_db
from src.demo_auth import get_demo_user, DemoUser
from src.models import Tenant, TenantScoreSnapshot, Event, Lease, Property
from src.responses import CamelRouter
from src.schemas.tenant import TenantResponse, TenantDetailResponse
from src.validators.memo_validator import is_event_valid_for_display

router = CamelRouter(tags=["tenants"])


@router.get("/tenants", response_model=list[TenantResponse])
async def list_tenants(
    status: str | None = Query(None, description="Filter by status"),
    db: AsyncSession = Depends(get_db),
    user: DemoUser = Depends(get_demo_user),
):
    """List all tenants, optionally filtered by status."""
    # Get latest snapshot date
    latest_date_query = (
        select(TenantScoreSnapshot.as_of_date)
        .order_by(TenantScoreSnapshot.as_of_date.desc())
        .limit(1)
    )
    latest_date_result = await db.execute(latest_date_query)
    latest_date = latest_date_result.scalar_one_or_none()

    if not latest_date:
        return []

    # Get tenants with their current status
    query = (
        select(Tenant, TenantScoreSnapshot)
        .join(TenantScoreSnapshot, TenantScoreSnapshot.tenant_id == Tenant.id)
        .where(TenantScoreSnapshot.as_of_date == latest_date)
    )

    if status:
        query = query.where(TenantScoreSnapshot.status == status)

    query = query.order_by(TenantScoreSnapshot.status, Tenant.name)

    result = await db.execute(query)
    tenant_snapshots = result.all()

    responses = []
    for tenant, snapshot in tenant_snapshots:
        # Get property count
        lease_count_query = (
            select(Lease)
            .where(Lease.tenant_id == tenant.id)
        )
        lease_result = await db.execute(lease_count_query)
        property_count = len(lease_result.scalars().all())

        # Get latest event
        event_query = (
            select(Event)
            .where(Event.tenant_id == tenant.id)
            .order_by(Event.event_date.desc())
            .limit(1)
        )
        event_result = await db.execute(event_query)
        latest_event = event_result.scalar_one_or_none()

        responses.append(TenantResponse(
            id=str(tenant.id),
            name=tenant.name,
            ticker=tenant.ticker,
            cik=tenant.cik,
            industry=tenant.industry,
            entity_type=tenant.entity_type,
            status=snapshot.status,
            property_count=property_count,
            latest_event={
                "id": str(latest_event.id),
                "event_type": latest_event.event_type,
                "headline": latest_event.headline,
                "date": latest_event.event_date.isoformat(),
            } if latest_event else None,
        ))

    return responses


@router.get("/tenants/{tenant_id}", response_model=TenantDetailResponse)
async def get_tenant(
    tenant_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: DemoUser = Depends(get_demo_user),
):
    """Get detailed information about a specific tenant."""
    # Get tenant
    tenant_query = select(Tenant).where(Tenant.id == tenant_id)
    tenant_result = await db.execute(tenant_query)
    tenant = tenant_result.scalar_one_or_none()

    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    # Get current status
    status_query = (
        select(TenantScoreSnapshot)
        .where(TenantScoreSnapshot.tenant_id == tenant_id)
        .order_by(TenantScoreSnapshot.as_of_date.desc())
        .limit(1)
    )
    status_result = await db.execute(status_query)
    current_status = status_result.scalar_one_or_none()

    # Get properties
    properties_query = (
        select(Property)
        .join(Lease, Lease.property_id == Property.id)
        .where(Lease.tenant_id == tenant_id)
    )
    properties_result = await db.execute(properties_query)
    properties = properties_result.scalars().all()

    # Get events with evidence
    events_query = (
        select(Event)
        .options(selectinload(Event.evidence_sources))
        .where(Event.tenant_id == tenant_id)
        .order_by(Event.event_date.desc())
    )
    events_result = await db.execute(events_query)
    events = events_result.scalars().all()

    # Get latest event for this tenant
    latest_event = events[0] if events else None

    return TenantDetailResponse(
        tenant={
            "id": str(tenant.id),
            "name": tenant.name,
            "ticker": tenant.ticker,
            "cik": tenant.cik,
            "industry": tenant.industry,
            "entity_type": tenant.entity_type,
            "status": current_status.status if current_status else "stable",
            "property_count": len(properties),
            "latest_event": {
                "id": str(latest_event.id),
                "event_type": latest_event.event_type,
                "headline": latest_event.headline,
                "date": latest_event.event_date.isoformat(),
            } if latest_event else None,
        },
        properties=[
            {
                "id": str(p.id),
                "name": p.name,
                "city": p.city,
                "state": p.state,
                "asset_class": p.asset_class,
            }
            for p in properties
        ],
        events=[
            {
                "id": str(e.id),
                "tenant_id": str(e.tenant_id),
                "tenant_name": tenant.name,
                "event_type": e.event_type,
                "event_date": e.event_date.isoformat(),
                "headline": e.headline,
                "summary": e.memo_what_disclosed or e.headline,
                "memo": {
                    "what_was_disclosed": e.memo_what_disclosed,
                    "key_details": e.memo_key_details or [],
                    "context": e.memo_context or [],
                } if e.memo_what_disclosed else None,
                "evidence_count": len(e.evidence_sources),
                "properties": [{"id": str(p.id), "name": p.name} for p in properties],
            }
            for e in events
            if is_event_valid_for_display(e)  # Filter invalid events
        ],
    )
