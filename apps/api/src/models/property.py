import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class Property(Base):
    """
    Property entity.
    Represents a physical property in the portfolio.
    """

    __tablename__ = "properties"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    portfolio_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("portfolios.id"), index=True
    )

    name: Mapped[str] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(100))
    state: Mapped[str] = mapped_column(String(50))
    asset_class: Mapped[str] = mapped_column(String(50))  # Retail, Office, Industrial, etc.

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    portfolio: Mapped["Portfolio"] = relationship(back_populates="properties")
    leases: Mapped[list["Lease"]] = relationship(back_populates="property")


# Import for type hints
from src.models.portfolio import Portfolio
from src.models.lease import Lease
