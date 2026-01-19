import uuid
from datetime import datetime, date

from sqlalchemy import String, Date, DateTime, ForeignKey, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class EvidenceSource(Base):
    """
    A source document supporting an event/memo.
    """

    __tablename__ = "evidence_sources"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("events.id"), index=True
    )

    source_type: Mapped[str] = mapped_column(String(50))  # sec_filing, news, press_release, court_filing, credit_report
    title: Mapped[str] = mapped_column(String(500))
    publisher: Mapped[str] = mapped_column(String(255))
    source_date: Mapped[date] = mapped_column(Date)
    url: Mapped[str | None] = mapped_column(String(2000))

    # Content for citation verification
    excerpt: Mapped[str | None] = mapped_column(Text)  # Relevant passage
    raw_text: Mapped[str | None] = mapped_column(Text)  # Full text (for validation)
    page_reference: Mapped[str | None] = mapped_column(String(50))  # "Page 47" or "Section 4.2"

    # Tier for source ordering
    tier: Mapped[int] = mapped_column(Integer, default=2)  # 1 = SEC/primary, 2 = major news, 3 = other

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    event: Mapped["Event"] = relationship(back_populates="evidence_sources")


# Import for type hints
from src.models.event import Event
