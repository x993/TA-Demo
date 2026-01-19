from pydantic import BaseModel


class MemoDetail(BaseModel):
    fact: str
    citation: str


class EventMemo(BaseModel):
    what_was_disclosed: str | None
    key_details: list[MemoDetail]
    context: list[str]


class PropertyBadge(BaseModel):
    id: str
    name: str


class EventDetailResponse(BaseModel):
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


class EvidenceResponse(BaseModel):
    id: str
    event_id: str
    source_type: str
    title: str
    publisher: str
    date: str
    url: str | None
    excerpt: str | None
    page_reference: str | None
