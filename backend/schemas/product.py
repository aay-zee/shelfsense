import uuid
from decimal import Decimal
from datetime import datetime

from .base import Base
from models.enums import UnitType, UnitLabel
from pydantic import ConfigDict


# ── POST /products ──
class ProductCreate(Base):
    name: str
    sku: str | None = None             # optional, so give it a default
    price: Decimal
    # Decimal — supports weight/volume (8.5 kg)
    quantity: Decimal = Decimal(0)
    unit_type: UnitType
    unit_label: UnitLabel


# ── PATCH /products/{id} — all fields optional ──
class ProductUpdate(Base):
    name: str | None = None
    sku: str | None = None
    price: Decimal | None = None
    quantity: Decimal | None = None
    unit_type: UnitType | None = None
    unit_label: UnitLabel | None = None


# ── GET response — mirrors every column ──
class ProductRead(Base):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    store_id: uuid.UUID
    name: str
    sku: str | None
    price: Decimal
    quantity: Decimal
    unit_type: UnitType
    unit_label: UnitLabel
    created_at: datetime
    updated_at: datetime
