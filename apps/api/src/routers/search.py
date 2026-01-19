from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.demo_auth import get_demo_user, DemoUser
from src.models import Tenant, Property, TenantScoreSnapshot

router = APIRouter(tags=["search"])


@router.get("/search")
async def search(
    q: str = Query(..., min_length=2, description="Search query"),
    db: AsyncSession = Depends(get_db),
    user: DemoUser = Depends(get_demo_user),
):
    """Search for tenants and properties."""
    search_term = f"%{q.lower()}%"

    # Get latest snapshot date for tenant status
    latest_date_query = (
        select(TenantScoreSnapshot.as_of_date)
        .order_by(TenantScoreSnapshot.as_of_date.desc())
        .limit(1)
    )
    latest_date_result = await db.execute(latest_date_query)
    latest_date = latest_date_result.scalar_one_or_none()

    # Search tenants
    tenants_query = (
        select(Tenant, TenantScoreSnapshot)
        .outerjoin(
            TenantScoreSnapshot,
            (TenantScoreSnapshot.tenant_id == Tenant.id) &
            (TenantScoreSnapshot.as_of_date == latest_date)
        )
        .where(
            or_(
                Tenant.name.ilike(search_term),
                Tenant.ticker.ilike(search_term),
            )
        )
        .limit(10)
    )
    tenants_result = await db.execute(tenants_query)
    tenant_matches = tenants_result.all()

    # Search properties
    properties_query = (
        select(Property)
        .where(
            or_(
                Property.name.ilike(search_term),
                Property.city.ilike(search_term),
            )
        )
        .limit(10)
    )
    properties_result = await db.execute(properties_query)
    property_matches = properties_result.scalars().all()

    return {
        "tenants": [
            {
                "id": str(tenant.id),
                "name": tenant.name,
                "ticker": tenant.ticker,
                "entity_type": tenant.entity_type,
                "status": snapshot.status if snapshot else "stable",
            }
            for tenant, snapshot in tenant_matches
        ],
        "properties": [
            {
                "id": str(prop.id),
                "name": prop.name,
                "city": prop.city,
                "state": prop.state,
            }
            for prop in property_matches
        ],
    }
