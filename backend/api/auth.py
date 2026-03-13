from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import create_access_token, verify_password
from core.deps import get_current_user
from schemas.auth import LoginRequest, RegisterRequest, Token, PasswordChangeRequest
from schemas.user import UserCreate, UserRead, UserUpdate
from services.store import create_store
from services.user import (
    authenticate_user,
    create_user,
    get_user_by_email,
    update_user_profile,
    change_user_password,
)
from schemas.store import StoreCreate
from models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserRead, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new store owner.
    Creates the store first, then the user linked to it.
    Returns 409 if the email is already taken.
    """

    if get_user_by_email(db, payload.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # 1. Create the store
    store = create_store(db, StoreCreate(name=payload.store_name))

    # 2. Create the owner linked to that store
    user_payload = UserCreate(
        name=payload.name,
        email=payload.email,
        password=payload.password,
    )
    user = create_user(db, user_payload, store_id=store.id)
    return user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticate with email + password.
    Accepts form data (username/password) so Swagger's Authorize dialog works directly.
    The 'username' field should contain the user's email.
    Returns a JWT access token on success, 401 on failure.
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=access_token)


@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return current_user


@router.patch("/me", response_model=UserRead)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the current user's name and/or email."""
    if payload.email and payload.email != current_user.email:
        existing = get_user_by_email(db, payload.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already in use",
            )
    return update_user_profile(db, current_user, payload.name, payload.email)


@router.patch("/me/password")
def change_password(
    payload: PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change the current user's password."""
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    change_user_password(db, current_user, payload.new_password)
    return {"message": "Password changed successfully"}

