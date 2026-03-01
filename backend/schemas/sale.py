
import uuid
from datetime import datetime

from pydantic import ConfigDict

from .base import Base
from .sale_item import SaleItemCreate, SaleItemRead


# ── Request body for POST /sales ──
# total_amount is computed server-side from the items
class SaleCreate(Base):
    store_id: uuid.UUID
    user_id: uuid.UUID
    items: list[SaleItemCreate]        # at least one item expected


# ── Request body for PATCH /sales/{id} ──
class SaleUpdate(Base):
    store_id: uuid.UUID | None = None
    user_id: uuid.UUID | None = None


# ── Response body returned by GET/POST /sales ──
class SaleRead(Base):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    store_id: uuid.UUID
    user_id: uuid.UUID
    total_amount: float
    created_at: datetime
    items: list[SaleItemRead]          # nested line items
