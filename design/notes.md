# Implementation Notes

## FastAPI + Pydantic v2 camelCase Serialization

### Problem

FastAPI + Pydantic v2 doesn't use field aliases in `response_model` by default. Setting `serialize_by_alias=True` in Pydantic's `ConfigDict` only affects direct `model_dump()` calls, not FastAPI's internal serialization.

### Solution

Two components work together:

**1. Base Model with Built-in Alias Generator**

```python
# apps/api/src/schemas/base.py
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel  # Built-in, no custom function needed

class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,  # Accept both snake_case and camelCase input
    )
```

**2. Custom Router with `response_model_by_alias=True` Default**

```python
# apps/api/src/responses.py
from fastapi import APIRouter

class CamelRouter(APIRouter):
    def api_route(self, path: str, *, response_model_by_alias: bool = True, **kwargs):
        return super().api_route(path, response_model_by_alias=response_model_by_alias, **kwargs)

    def add_api_route(self, path: str, endpoint, *, response_model_by_alias: bool = True, **kwargs):
        super().add_api_route(path, endpoint, response_model_by_alias=response_model_by_alias, **kwargs)
```

### Usage

```python
# In routers
from src.responses import CamelRouter
from src.schemas.base import CamelModel

router = CamelRouter(tags=["example"])

class MyResponse(CamelModel):
    user_name: str      # Serializes as "userName"
    created_at: str     # Serializes as "createdAt"

@router.get("/example", response_model=MyResponse)
async def example():
    return MyResponse(user_name="John", created_at="2024-01-01")
```

### Why This Works

- `CamelModel` defines the aliases via `alias_generator=to_camel`
- `CamelRouter` ensures FastAPI uses those aliases when serializing responses
- OpenAPI documentation is preserved (unlike the `default_response_class` approach)
- No manual `model_dump(by_alias=True)` calls needed

### What Doesn't Work

- `serialize_by_alias=True` in ConfigDict - FastAPI ignores this
- Custom `JSONResponse` with `default_response_class` - FastAPI serializes before the response class receives data
- Manual `Response()` with JSON - loses OpenAPI schema documentation

### References

- https://github.com/fastapi/fastapi/discussions/10009
- https://github.com/fastapi/fastapi/discussions/2753
- https://docs.pydantic.dev/latest/api/config/
