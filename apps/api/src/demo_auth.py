"""
Demo-mode authentication via headers.
No JWT, no sessions — just role headers for the demo.

Usage:
  X-DEMO-ROLE: exec | am
  X-DEMO-USER: jane (optional, for display)
"""

from fastapi import Request, HTTPException


class DemoUser:
    def __init__(self, role: str, name: str | None = None):
        self.role = role
        self.name = name or "Demo User"
        self.is_exec = role == "exec"
        self.is_am = role == "am"


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

    return DemoUser(role=role, name=name)
