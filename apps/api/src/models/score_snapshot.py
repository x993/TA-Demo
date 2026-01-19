import uuid
from datetime import datetime, date

from sqlalchemy import String, Integer, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class TenantScoreSnapshot(Base):
    """
    Point-in-time status for a tenant.
    Enables trend analysis and historical comparison.
    """

    __tablename__ = "tenant_score_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id"), index=True
    )

    as_of_date: Mapped[date] = mapped_column(Date, index=True)
    status: Mapped[str] = mapped_column(String(20))  # critical, watch, stable, improving

    # Internal scoring (optional, for potential future use)
    score: Mapped[int | None] = mapped_column(Integer)  # 0-100

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="score_snapshots")

    __table_args__ = (
        UniqueConstraint("tenant_id", "as_of_date", name="uq_tenant_snapshot_date"),
    )


# Import for type hints
from src.models.tenant import Tenant
