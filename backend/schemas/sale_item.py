
import uuid
from decimal import Decimal

from pydantic import ConfigDict

from .base import Base


# for post/put — sale_id is set server-side from the parent Sale
class SaleItemCreate(Base):
    product_id: uuid.UUID
    quantity: Decimal
    price_at_sale: Decimal


# for update patch
class SaleItemUpdate(Base):
    quantity: Decimal | None = None
    price_at_sale: Decimal | None = None

# for get response


class SaleItemRead(Base):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    sale_id: uuid.UUID
    product_id: uuid.UUID
    quantity: Decimal
    price_at_sale: Decimal
