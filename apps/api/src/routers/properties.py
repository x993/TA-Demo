from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.demo_auth import get_demo_user, DemoUser
from src.models import Property, Lease, Tenant, TenantScoreSnapshot, Event

router = APIRouter(tags=["properties"])


@router.get("/properties")
async def list_properties(
    db: AsyncSession = Depends(get_db),
    user: DemoUser = Depends(get_demo_user),
):
    """List all properties."""
    # Get all properties
    properties_query = select(Property).order_by(Property.name)
    properties_result = await db.execute(properties_query)
    properties = properties_result.scalars().all()

    responses = []
    for prop in properties:
        # Get tenant count
        tenant_count_query = (
            select(func.count(Lease.id))
            .where(Lease.property_id == prop.id)
        )
        tenant_count_result = await db.execute(tenant_count_query)
        tenant_count = tenant_count_result.scalar() or 0

        # Get count of tenants with events (simplified)
        events_count_query = (
            select(func.count(func.distinct(Event.tenant_id)))
            .join(Lease, Lease.tenant_id == Event.tenant_id)
            .where(Lease.property_id == prop.id)
        )
        events_count_result = await db.execute(events_count_query)
        events_count = events_count_result.scalar() or 0

        responses.append({
            "id": str(prop.id),
            "name": prop.name,
            "city": prop.city,
            "state": prop.state,
            "asset_class": prop.asset_class,
            "tenant_count": tenant_count,
            "events_count": events_count,
        })

    return responses


@router.get("/properties/{property_id}")
async def get_property(
    property_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: DemoUser = Depends(get_demo_user),
):
    """Get detailed information about a specific property."""
    # Get property
    property_query = select(Property).where(Property.id == property_id)
    property_result = await db.execute(property_query)
    prop = property_result.scalar_one_or_none()

    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    # Get tenants at this property with their status
    latest_date_query = (
        select(TenantScoreSnapshot.as_of_date)
        .order_by(TenantScoreSnapshot.as_of_date.desc())
        .limit(1)
    )
    latest_date_result = await db.execute(latest_date_query)
    latest_date = latest_date_result.scalar_one_or_none()

    tenants_query = (
        select(Tenant, Lease, TenantScoreSnapshot)
        .join(Lease, Lease.tenant_id == Tenant.id)
        .outerjoin(
            TenantScoreSnapshot,
            (TenantScoreSnapshot.tenant_id == Tenant.id) &
            (TenantScoreSnapshot.as_of_date == latest_date)
        )
        .where(Lease.property_id == property_id)
    )
    tenants_result = await db.execute(tenants_query)
    tenant_data = tenants_result.all()

    tenants = []
    for tenant, lease, snapshot in tenant_data:
        # Get latest event for this tenant
        event_query = (
            select(Event)
            .where(Event.tenant_id == tenant.id)
            .order_by(Event.event_date.desc())
            .limit(1)
        )
        event_result = await db.execute(event_query)
        latest_event = event_result.scalar_one_or_none()

        tenants.append({
            "id": str(tenant.id),
            "name": tenant.name,
            "status": snapshot.status if snapshot else "stable",
            "suite_label": lease.suite_label,
            "rent_share_estimate": lease.rent_share_estimate,
            "latest_event": {
                "id": str(latest_event.id),
                "headline": latest_event.headline,
                "date": latest_event.event_date.isoformat(),
            } if latest_event else None,
        })

    # Get recent events at this property
    events_query = (
        select(Event)
        .join(Lease, Lease.tenant_id == Event.tenant_id)
        .where(Lease.property_id == property_id)
        .order_by(Event.event_date.desc())
        .limit(10)
    )
    events_result = await db.execute(events_query)
    recent_events = events_result.scalars().all()

    return {
        "property": {
            "id": str(prop.id),
            "name": prop.name,
            "city": prop.city,
            "state": prop.state,
            "asset_class": prop.asset_class,
        },
        "tenants": tenants,
        "recent_events": [
            {
                "id": str(e.id),
                "tenant_id": str(e.tenant_id),
                "event_type": e.event_type,
                "headline": e.headline,
                "date": e.event_date.isoformat(),
            }
            for e in recent_events
        ],
    }
