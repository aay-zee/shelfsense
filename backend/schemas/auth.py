from pydantic import EmailStr

from .base import Base


# ── POST /auth/register ──
class RegisterRequest(Base):
    store_name: str                    # a new store will be created with this name
    name: str                          # owner's display name
    email: EmailStr
    password: str


# ── POST /auth/login ──
class LoginRequest(Base):
    email: EmailStr
    password: str


# ── Token response ──
class Token(Base):
    access_token: str
    token_type: str = "bearer"


# ── Internal — data extracted from a decoded JWT ──
class TokenData(Base):
    user_id: str | None = None


# ── PATCH /auth/me/password ──
class PasswordChangeRequest(Base):
    current_password: str
    new_password: str

