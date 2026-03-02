import uuid
from datetime import datetime

from pydantic import ConfigDict, EmailStr

from .base import Base


# ── Internal — used by the service layer (store_id is set by the register flow) ──
class UserCreate(Base):
    name: str
    email: EmailStr
    password: str


# ── PATCH /users/{id} ──
class UserUpdate(Base):
    name: str | None = None
    email: EmailStr | None = None
    password: str | None = None


# ── GET response — never expose password_hash ──
class UserRead(Base):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    store_id: uuid.UUID
    name: str
    email: str
    is_active: bool
    created_at: datetime
