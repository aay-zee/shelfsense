
import uuid
from decimal import Decimal
from datetime import datetime

from pydantic import ConfigDict

from .base import Base
from .sale_item import SaleItemCreate, SaleItemRead


# ── Request body for POST /sales ──
# store_id, user_id, and total_amount are all set server-side
class SaleCreate(Base):
    items: list[SaleItemCreate]        # at least one item expected


# ── Request body for PATCH /sales/{id} ──
# Only items can be corrected; store/user are immutable
class SaleUpdate(Base):
    items: list[SaleItemCreate] | None = None


# ── Response body returned by GET/POST /sales ──
class SaleRead(Base):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    store_id: uuid.UUID
    user_id: uuid.UUID
    total_amount: Decimal
    created_at: datetime
    items: list[SaleItemRead]          # nested line items
