import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class Tenant(Base):
    """
    Tenant entity.
    Static tenant identity. Memos live in events.
    """

    __tablename__ = "tenants"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    portfolio_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("portfolios.id"), index=True
    )

    name: Mapped[str] = mapped_column(String(255))
    ticker: Mapped[str | None] = mapped_column(String(20))
    cik: Mapped[str | None] = mapped_column(String(20))
    industry: Mapped[str | None] = mapped_column(String(100))
    entity_type: Mapped[str] = mapped_column(String(20), default="private")  # public, private
    website: Mapped[str | None] = mapped_column(String(500))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    portfolio: Mapped["Portfolio"] = relationship(back_populates="tenants")
    leases: Mapped[list["Lease"]] = relationship(back_populates="tenant")
    events: Mapped[list["Event"]] = relationship(back_populates="tenant")
    score_snapshots: Mapped[list["TenantScoreSnapshot"]] = relationship(
        back_populates="tenant"
    )


# Import for type hints
from src.models.portfolio import Portfolio
from src.models.lease import Lease
from src.models.event import Event
from src.models.score_snapshot import TenantScoreSnapshot
