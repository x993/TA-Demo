from src.schemas.base import CamelModel


class SearchTenantResponse(CamelModel):
    id: str
    name: str
    ticker: str | None
    entity_type: str
    status: str


class SearchPropertyResponse(CamelModel):
    id: str
    name: str
    city: str
    state: str


class SearchResponse(CamelModel):
    tenants: list[SearchTenantResponse]
    properties: list[SearchPropertyResponse]
