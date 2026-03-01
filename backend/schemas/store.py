import uuid
from datetime import datetime
from pydantic import ConfigDict
from .base import Base


# ── Request body for POST /stores ──
class StoreCreate(Base):
    name: str


# ── Request body for PATCH /stores/{id} ──
class StoreUpdate(Base):
    name: str | None = None


# ── Response body returned by GET/POST ──
class StoreRead(Base):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    created_at: datetime
