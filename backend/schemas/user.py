import uuid
from datetime import datetime

from pydantic import ConfigDict, EmailStr

from .base import Base


# ── POST /users (registration) ──
class UserCreate(Base):
    store_id: uuid.UUID
    name: str
    email: EmailStr                    # validates email format automatically
    password: str                      # plain text — service layer hashes it


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
