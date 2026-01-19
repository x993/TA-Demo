from src.schemas.base import CamelModel


class StatusCountsResponse(CamelModel):
    critical: int
    watch: int
    stable: int
    improving: int


class StatusChangeItem(CamelModel):
    tenant_id: str
    tenant_name: str
    previous_status: str
    new_status: str
    event_id: str | None
    event_headline: str | None


class StatusChangesResponse(CamelModel):
    to_watch_or_critical: list[StatusChangeItem]
    to_improving: list[StatusChangeItem]
    unchanged: int


class PropertyBadge(CamelModel):
    id: str
    name: str


class EventResponse(CamelModel):
    id: str
    tenant_id: str
    tenant_name: str
    event_type: str
    event_date: str
    headline: str
    summary: str
    evidence_count: int
    properties: list[PropertyBadge]


class CoverageResponse(CamelModel):
    tenants_monitored: int
    tenants_with_disclosures: int
    sources: list[str]
    as_of_date: str


# Executive layer schemas
class PortfolioVerdict(CamelModel):
    direction: str  # "increased" | "decreased" | "stable"
    magnitude: str  # "modestly" | "significantly" | etc.
    statement: str  # Full verdict statement
    confidence: float


class NarrativeBullet(CamelModel):
    priority: int  # 1 = requires discussion, 2 = monitor, 3 = FYI
    text: str
    supporting_tenant_ids: list[str]


class ConcentrationInsight(CamelModel):
    text: str
    affected_property_ids: list[str]
    affected_tenant_ids: list[str]


class PropertyAttentionItem(CamelModel):
    """Property requiring attention, shown in dashboard tiles."""
    id: str
    name: str
    city: str
    state: str
    image_url: str | None = None
    status: str  # 'critical' | 'watch' | 'stable' | 'improving'
    issues_count: int


class BriefResponse(CamelModel):
    id: str
    as_of_date: str
    headline: str
    updated_at: str
    status_counts: StatusCountsResponse
    status_changes: StatusChangesResponse
    recent_events: list[EventResponse]
    coverage: CoverageResponse
    # Properties requiring attention
    properties_attention: list[PropertyAttentionItem] | None = None
    # Executive layer (optional - present for exec role)
    portfolio_verdict: PortfolioVerdict | None = None
    narrative_bullets: list[NarrativeBullet] | None = None
    concentration_insights: list[ConcentrationInsight] | None = None
    exec_questions: list[str] | None = None
