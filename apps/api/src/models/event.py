import uuid
from datetime import datetime, date

from sqlalchemy import String, Date, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from src.database import Base


class Event(Base):
    """
    A material event for a tenant (filing, news, metric change).
    This is where memos/narratives attach.
    """

    __tablename__ = "events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id"), index=True
    )

    event_type: Mapped[str] = mapped_column(String(50))  # sec_filing, news, court_filing, press_release, credit_report
    event_date: Mapped[date] = mapped_column(Date, index=True)
    headline: Mapped[str] = mapped_column(String(500))

    # Memo content (structured)
    memo_what_disclosed: Mapped[str | None] = mapped_column(Text)  # Plain text summary
    memo_key_details: Mapped[list | None] = mapped_column(JSONB)  # [{fact: str, citation: str}, ...]
    memo_context: Mapped[list | None] = mapped_column(JSONB)  # [str, ...]
    # Additional memo sections for actionability
    memo_why_it_matters: Mapped[str | None] = mapped_column(Text)  # Credit analysis
    memo_recommended_actions: Mapped[list | None] = mapped_column(JSONB)  # [str, ...]
    memo_what_to_watch: Mapped[list | None] = mapped_column(JSONB)  # [str, ...]

    # Validation
    memo_validated: Mapped[bool] = mapped_column(Boolean, default=False)
    validation_errors: Mapped[list | None] = mapped_column(JSONB)  # [{error: str}, ...]

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="events")
    evidence_sources: Mapped[list["EvidenceSource"]] = relationship(
        back_populates="event", lazy="selectin"
    )


# Import for type hints
from src.models.tenant import Tenant
from src.models.evidence import EvidenceSource
