import uuid
from datetime import datetime, date

from sqlalchemy import String, Integer, Date, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from src.database import Base


class PortfolioBriefSnapshot(Base):
    """
    Executive brief for a portfolio at a point in time.
    This is the top-level summary shown on the Weekly Summary screen.
    """

    __tablename__ = "portfolio_brief_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    portfolio_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("portfolios.id"), index=True
    )

    as_of_date: Mapped[date] = mapped_column(Date, index=True)
    headline: Mapped[str] = mapped_column(Text)  # Factual summary sentence
    headline_validated: Mapped[bool] = mapped_column(Boolean, default=False)

    # Denormalized counts for fast display
    critical_count: Mapped[int] = mapped_column(Integer, default=0)
    watch_count: Mapped[int] = mapped_column(Integer, default=0)
    stable_count: Mapped[int] = mapped_column(Integer, default=0)
    improving_count: Mapped[int] = mapped_column(Integer, default=0)

    # Executive layer fields
    # portfolio_verdict: {direction: str, magnitude: str, statement: str, confidence: float}
    portfolio_verdict: Mapped[dict | None] = mapped_column(JSONB)
    # narrative_bullets: [{priority: 1|2|3, text: str, supporting_tenant_ids: [str]}]
    narrative_bullets: Mapped[list | None] = mapped_column(JSONB)
    # concentration_insights: [{text: str, affected_property_ids: [str], affected_tenant_ids: [str]}]
    concentration_insights: Mapped[list | None] = mapped_column(JSONB)
    # exec_questions: [str]
    exec_questions: Mapped[list | None] = mapped_column(JSONB)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    portfolio: Mapped["Portfolio"] = relationship(back_populates="brief_snapshots")


# Import for type hints
from src.models.portfolio import Portfolio
