from src.schemas.base import CamelModel


class EventSummary(CamelModel):
    id: str
    event_type: str
    headline: str
    date: str


class TenantResponse(CamelModel):
    id: str
    name: str
    ticker: str | None
    cik: str | None
    industry: str | None
    entity_type: str
    status: str
    property_count: int
    latest_event: EventSummary | None


class PropertySummary(CamelModel):
    id: str
    name: str
    city: str
    state: str
    asset_class: str


class MemoDetail(CamelModel):
    fact: str
    citation: str


class EventMemo(CamelModel):
    what_was_disclosed: str | None
    key_details: list[MemoDetail]
    context: list[str]


class PropertyBadge(CamelModel):
    id: str
    name: str


class EventDetailResponse(CamelModel):
    id: str
    tenant_id: str
    tenant_name: str
    event_type: str
    event_date: str
    headline: str
    summary: str
    memo: EventMemo | None
    evidence_count: int
    properties: list[PropertyBadge]


class TenantDetailResponse(CamelModel):
    tenant: TenantResponse
    properties: list[PropertySummary]
    events: list[EventDetailResponse]
