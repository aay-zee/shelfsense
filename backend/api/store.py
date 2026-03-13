import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import get_current_user
from models.user import User
from schemas.store import StoreCreate, StoreRead, StoreUpdate
from services.store import create_store, get_store, get_all_stores, update_store

router = APIRouter(
    prefix="/stores",
    tags=["Stores"],
    dependencies=[Depends(get_current_user)],
)


@router.get("/my-store", response_model=StoreRead)
def get_my_store(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the current user's store."""
    store = get_store(db, current_user.store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.patch("/my-store", response_model=StoreRead)
def update_my_store(
    payload: StoreUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the current user's store name."""
    store = get_store(db, current_user.store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    if payload.name is not None:
        return update_store(db, store, payload.name)
    return store


# For admin I think
# @router.post("/", response_model=StoreRead, status_code=201)
# def create(payload: StoreCreate, db: Session = Depends(get_db)):
#     """Create a new store."""
#     return create_store(db, payload)

# #for admin i think
# @router.get("/", response_model=list[StoreRead])
# def read_all(db: Session = Depends(get_db)):
#     """List every store."""
#     return get_all_stores(db)


# #for admin i think
# @router.get("/{store_id}", response_model=StoreRead)
# def read_one(store_id: uuid.UUID, db: Session = Depends(get_db)):
#     """Get a single store by ID."""
#     store = get_store(db, store_id)
#     if not store:
#         raise HTTPException(status_code=404, detail="Store not found")
#     return store

