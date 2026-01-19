"""
Demo-mode authentication via headers.
No JWT, no sessions — just role headers for the demo.

Usage:
  X-DEMO-ROLE: exec | am
  X-DEMO-USER: jane (optional, for display)
"""

from fastapi import Request, HTTPException


# Demo AM assigned properties (subset of portfolio)
# In production, this would come from database
DEMO_AM_ASSIGNED_PROPERTIES = [
    "a0000001-0000-0000-0000-000000000001",  # Park Plaza
    "a0000001-0000-0000-0000-000000000002",  # Southfield Retail Center
    "a0000001-0000-0000-0000-000000000009",  # Willowbrook Plaza
    "a0000001-0000-0000-0000-000000000003",  # Riverside Tower
    "a0000001-0000-0000-0000-000000000004",  # Metropolitan Center
]


class DemoUser:
    def __init__(self, role: str, name: str | None = None, assigned_property_ids: list[str] | None = None):
        self.role = role
        self.name = name or "Demo User"
        self.is_exec = role == "exec"
        self.is_am = role == "am"
        self.assigned_property_ids = assigned_property_ids or []


def get_demo_user(request: Request) -> DemoUser:
    """
    Extract demo user from headers.
    Defaults to 'exec' role if not specified.
    """
    role = request.headers.get("X-DEMO-ROLE", "exec").lower()
    name = request.headers.get("X-DEMO-USER")

    if role not in ("exec", "am"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid X-DEMO-ROLE: {role}. Must be 'exec' or 'am'.",
        )

    # AM gets assigned properties
    assigned_properties = DEMO_AM_ASSIGNED_PROPERTIES if role == "am" else []

    return DemoUser(role=role, name=name, assigned_property_ids=assigned_properties)
