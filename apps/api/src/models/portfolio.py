import uuid
from datetime import datetime

from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class Portfolio(Base):
    """
    Top-level portfolio entity.
    For the demo, we have a single portfolio.
    """

    __tablename__ = "portfolios"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    tenants: Mapped[list["Tenant"]] = relationship(back_populates="portfolio")
    properties: Mapped[list["Property"]] = relationship(back_populates="portfolio")
    brief_snapshots: Mapped[list["PortfolioBriefSnapshot"]] = relationship(
        back_populates="portfolio"
    )


# Import for type hints
from src.models.tenant import Tenant
from src.models.property import Property
from src.models.brief_snapshot import PortfolioBriefSnapshot
