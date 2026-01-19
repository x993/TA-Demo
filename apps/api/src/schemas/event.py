from src.schemas.base import CamelModel


class MemoDetail(CamelModel):
    fact: str
    citation: str


class EventMemo(CamelModel):
    what_was_disclosed: str | None
    key_details: list[MemoDetail]
    context: list[str]
    # Action sections
    why_it_matters: str | None = None
    recommended_actions: list[str] | None = None
    what_to_watch: list[str] | None = None


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


class EvidenceResponse(CamelModel):
    id: str
    event_id: str
    source_type: str
    title: str
    publisher: str
    date: str
    url: str | None
    excerpt: str | None
    page_reference: str | None
