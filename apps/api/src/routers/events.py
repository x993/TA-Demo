from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.database import get_db
from src.demo_auth import get_demo_user, DemoUser
from src.models import Event, EvidenceSource, Tenant, Lease, Property
from src.schemas.event import EventDetailResponse, EvidenceResponse

router = APIRouter(tags=["events"])


@router.get("/events/{event_id}", response_model=EventDetailResponse)
async def get_event(
    event_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: DemoUser = Depends(get_demo_user),
):
    """Get detailed information about a specific event."""
    # Get event with evidence
    event_query = (
        select(Event)
        .options(selectinload(Event.evidence_sources), selectinload(Event.tenant))
        .where(Event.id == event_id)
    )
    event_result = await db.execute(event_query)
    event = event_result.scalar_one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Get properties for this tenant
    properties_query = (
        select(Property)
        .join(Lease, Lease.property_id == Property.id)
        .where(Lease.tenant_id == event.tenant_id)
    )
    properties_result = await db.execute(properties_query)
    properties = properties_result.scalars().all()

    return EventDetailResponse(
        id=str(event.id),
        tenant_id=str(event.tenant_id),
        tenant_name=event.tenant.name,
        event_type=event.event_type,
        event_date=event.event_date.isoformat(),
        headline=event.headline,
        summary=event.memo_what_disclosed or event.headline,
        memo={
            "what_was_disclosed": event.memo_what_disclosed,
            "key_details": event.memo_key_details or [],
            "context": event.memo_context or [],
        } if event.memo_what_disclosed else None,
        evidence_count=len(event.evidence_sources),
        properties=[{"id": str(p.id), "name": p.name} for p in properties],
    )


@router.get("/events/{event_id}/evidence", response_model=list[EvidenceResponse])
async def get_event_evidence(
    event_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: DemoUser = Depends(get_demo_user),
):
    """Get evidence sources for a specific event."""
    # Verify event exists
    event_query = select(Event).where(Event.id == event_id)
    event_result = await db.execute(event_query)
    event = event_result.scalar_one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Get evidence sources, ordered by tier
    evidence_query = (
        select(EvidenceSource)
        .where(EvidenceSource.event_id == event_id)
        .order_by(EvidenceSource.tier, EvidenceSource.source_date.desc())
    )
    evidence_result = await db.execute(evidence_query)
    evidence_sources = evidence_result.scalars().all()

    return [
        EvidenceResponse(
            id=str(e.id),
            event_id=str(e.event_id),
            source_type=e.source_type,
            title=e.title,
            publisher=e.publisher,
            date=e.source_date.isoformat(),
            url=e.url,
            excerpt=e.excerpt,
            page_reference=e.page_reference,
        )
        for e in evidence_sources
    ]
