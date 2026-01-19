import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class Lease(Base):
    """
    Lease entity.
    Links a tenant to a property with optional metadata.
    """

    __tablename__ = "leases"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id"), index=True
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id"), index=True
    )

    # Optional lease metadata
    suite_label: Mapped[str | None] = mapped_column(String(100))  # "Suite 100" or "Anchor"
    rent_share_estimate: Mapped[float | None] = mapped_column(Float)  # 0.0 to 1.0

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="leases")
    property: Mapped["Property"] = relationship(back_populates="leases")


# Import for type hints
from src.models.tenant import Tenant
from src.models.property import Property
