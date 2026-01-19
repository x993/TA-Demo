from src.schemas.base import CamelModel


class PropertyResponse(CamelModel):
    id: str
    name: str
    city: str
    state: str
    asset_class: str
    image_url: str | None = None
    tenant_count: int
    events_count: int


class PropertyTenantResponse(CamelModel):
    id: str
    name: str
    status: str
    suite_label: str | None
    rent_share_estimate: float | None
    latest_event: "PropertyTenantEventResponse | None"


class PropertyTenantEventResponse(CamelModel):
    id: str
    headline: str
    date: str


class PropertyEventResponse(CamelModel):
    id: str
    tenant_id: str
    event_type: str
    headline: str
    date: str


class PropertyBasicResponse(CamelModel):
    id: str
    name: str
    city: str
    state: str
    asset_class: str
    image_url: str | None = None


class PropertyDetailResponse(CamelModel):
    property: PropertyBasicResponse
    tenants: list[PropertyTenantResponse]
    recent_events: list[PropertyEventResponse]
