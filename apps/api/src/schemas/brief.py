from pydantic import BaseModel


class StatusCountsResponse(BaseModel):
    critical: int
    watch: int
    stable: int
    improving: int


class StatusChangeItem(BaseModel):
    tenant_id: str
    tenant_name: str
    previous_status: str
    new_status: str
    event_id: str | None
    event_headline: str | None


class StatusChangesResponse(BaseModel):
    to_watch_or_critical: list[StatusChangeItem]
    to_improving: list[StatusChangeItem]
    unchanged: int


class PropertyBadge(BaseModel):
    id: str
    name: str


class EventResponse(BaseModel):
    id: str
    tenant_id: str
    tenant_name: str
    event_type: str
    event_date: str
    headline: str
    summary: str
    evidence_count: int
    properties: list[PropertyBadge]


class CoverageResponse(BaseModel):
    tenants_monitored: int
    tenants_with_disclosures: int
    sources: list[str]
    as_of_date: str


class BriefResponse(BaseModel):
    id: str
    as_of_date: str
    headline: str
    updated_at: str
    status_counts: StatusCountsResponse
    status_changes: StatusChangesResponse
    recent_events: list[EventResponse]
    coverage: CoverageResponse
