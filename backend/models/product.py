import uuid
from decimal import Decimal
from sqlalchemy import String, Numeric, Integer, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone

from .base import Base
from .enums import UnitLabel, UnitType


class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    store_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("stores.id"), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    sku: Mapped[str | None] = mapped_column(String, nullable=True, unique=True)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    quantity: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    min_stock: Mapped[int] = mapped_column(Integer, default=0)
    unit_type: Mapped[UnitType] = mapped_column(Enum(UnitType), nullable=False)
    unit_label: Mapped[UnitLabel] = mapped_column(
        Enum(UnitLabel), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ── relationships ──
    store = relationship("Store", back_populates="products")
    sale_items = relationship("SaleItem", back_populates="product")
