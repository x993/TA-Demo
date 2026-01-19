"""Custom router for proper camelCase serialization."""

from typing import Any, Callable

from fastapi import APIRouter
from fastapi.types import DecoratedCallable


class CamelRouter(APIRouter):
    """APIRouter that uses response_model_by_alias=True by default.

    This ensures Pydantic models with alias_generator=to_camel
    serialize to camelCase in API responses while preserving
    OpenAPI schema documentation.
    """

    def api_route(
        self,
        path: str,
        *,
        response_model_by_alias: bool = True,
        **kwargs: Any,
    ) -> Callable[[DecoratedCallable], DecoratedCallable]:
        """Override to set response_model_by_alias=True by default."""
        return super().api_route(
            path,
            response_model_by_alias=response_model_by_alias,
            **kwargs,
        )

    def add_api_route(
        self,
        path: str,
        endpoint: Callable[..., Any],
        *,
        response_model_by_alias: bool = True,
        **kwargs: Any,
    ) -> None:
        """Override to set response_model_by_alias=True by default."""
        super().add_api_route(
            path,
            endpoint,
            response_model_by_alias=response_model_by_alias,
            **kwargs,
        )
