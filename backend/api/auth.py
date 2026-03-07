from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import create_access_token
from schemas.auth import LoginRequest, RegisterRequest, Token
from schemas.user import UserCreate, UserRead
from services.store import create_store
from services.user import authenticate_user, create_user, get_user_by_email
from schemas.store import StoreCreate

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
