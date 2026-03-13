import uuid
from sqlalchemy.orm import Session

from models.user import User
from schemas.user import UserCreate
from core.security import hash_password, verify_password


def get_user_by_email(db: Session, email: str) -> User | None:
    """Look up a user by email address."""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    """Look up a user by primary key."""
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, payload: UserCreate, store_id: uuid.UUID) -> User:
    """
    Register a new user linked to the given store.
    Hashes the plain-text password before storing.
    """
    user = User(
        store_id=store_id,
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """
    Verify credentials.  Returns the User if email exists AND password matches,
    otherwise None.
    """
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def update_user_profile(db: Session, user: User, name: str | None, email: str | None) -> User:
    """Update the user's name and/or email."""
    if name is not None:
        user.name = name
    if email is not None:
        user.email = email
    db.commit()
    db.refresh(user)
    return user


def change_user_password(db: Session, user: User, new_password: str) -> User:
    """Change the user's password."""
    user.password_hash = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user

